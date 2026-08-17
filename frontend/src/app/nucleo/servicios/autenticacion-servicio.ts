import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { entorno } from '../../../entornos/entorno';
import {
  CODIGOS_ERROR_ACCESO,
  ProveedorExterno,
  RespuestaAcceso,
  SolicitudAcceso,
  UsuarioSesion,
} from '../modelos/autenticacion';

/** Mensajes que ve el alumno, mapeados desde el codigo estable que envia el backend. */
const MENSAJES_POR_CODIGO: Record<string, string> = {
  [CODIGOS_ERROR_ACCESO.credencialesInvalidas]: 'El correo o la contraseña no coinciden.',
  [CODIGOS_ERROR_ACCESO.cuentaBloqueada]:
    'Tu cuenta está bloqueada temporalmente por varios intentos fallidos. Intenta de nuevo en unos minutos.',
  [CODIGOS_ERROR_ACCESO.correoNoVerificado]:
    'Todavía no has verificado tu correo. Revisa tu bandeja de entrada.',
  [CODIGOS_ERROR_ACCESO.limiteDispositivos]:
    'Ya hay sesiones abiertas en otros dispositivos. Cierra una desde tu perfil para continuar.',
};

const MENSAJE_GENERICO = 'No pudimos iniciar sesión. Intenta de nuevo en unos minutos.';

/**
 * Acceso a la API de autenticacion.
 *
 * <p>El componente no habla HTTP: pide a este servicio y reacciona. Asi la pantalla se puede
 * probar sin red y el manejo de errores vive en un solo sitio.
 *
 * <p>El token NO se guarda aqui todavia. Donde se guarda —memoria, cookie httpOnly— es una
 * decision de seguridad que se toma junto con el backend, y elegirla a la ligera es como se
 * termina con un token en localStorage al alcance de cualquier script inyectado.
 */
@Injectable({ providedIn: 'root' })
export class AutenticacionServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${entorno.urlApi}/acceso`;

  private readonly usuarioActual = signal<UsuarioSesion | null>(null);

  /** Peticion de sesion en curso, compartida por todos los que pregunten a la vez. */
  private enVuelo: Observable<UsuarioSesion | null> | null = null;

  /** Usuario de la sesion vigente, o nulo si no hay ninguna. Solo lectura hacia afuera. */
  readonly usuario = this.usuarioActual.asReadonly();

  /**
   * Inicia sesion con correo y contrasena.
   *
   * <p>Traduce el codigo de error del backend a un mensaje para el alumno. Nunca se muestra
   * el detalle tecnico: puede revelar si un correo existe, que es justo lo que permite
   * enumerar cuentas.
   */
  iniciarSesion(solicitud: SolicitudAcceso): Observable<RespuestaAcceso> {
    return this.http.post<RespuestaAcceso>(`${this.base}/sesion`, solicitud).pipe(
      tap((respuesta) => this.usuarioActual.set(respuesta.usuario)),
      catchError((error: HttpErrorResponse) => throwError(() => new Error(this.traducir(error)))),
    );
  }

  /**
   * Pregunta al backend quien tiene la sesion abierta.
   *
   * <p>Hace falta porque el ingreso con Google termina en una REDIRECCION: la aplicacion se
   * recarga desde cero y no sabe que alguien acaba de entrar. Sin esto, el usuario solo
   * existe para el frontend cuando el ingreso paso por su propio formulario, y cualquier
   * pantalla que dependa de la sesion funcionaria por un camino y no por el otro.
   *
   * <p>Un 401 no es un error a mostrar: significa «no hay sesion», que es una respuesta
   * legitima. Por eso se traduce a nulo en vez de propagarse.
   */
  sesionActual(): Observable<UsuarioSesion | null> {
    // Una sola peticion aunque pregunten varios a la vez.
    //
    // La barra pregunta al dibujarse y la pantalla de perfil tambien; sin esto, abrir
    // `/perfil` disparaba DOS llamadas identicas al mismo endpoint en el mismo instante.
    // Ademas de sobrar una, las dos escriben el mismo signal y la que conteste ultima manda:
    // hoy dan lo mismo, pero es una carrera esperando a que dejen de darlo.
    //
    // Se comparte solo mientras esta EN VUELO, no se cachea el resultado: al entrar o al
    // salir hay que volver a preguntar de verdad.
    this.enVuelo ??= this.http.get<UsuarioSesion>(`${this.base}/sesion`).pipe(
      catchError(() => of(null)),
      tap((usuario) => {
        this.usuarioActual.set(usuario);
        this.enVuelo = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.enVuelo;
  }

  /**
   * Cierra la sesion.
   *
   * <p>Es el BACKEND quien la cierra: invalida la sesion del servidor y borra la cookie. Un
   * «cerrar sesion» que solo olvidara al usuario en el frontend seria mentira — la cookie
   * seguiria valiendo, y quien tomara el computador despues entraria recargando la pagina.
   *
   * <p>Va por POST y no por GET a proposito: un GET lo dispara cualquier sitio ajeno con una
   * etiqueta de imagen apuntando aqui, y el alumno se veria expulsado a mitad de una clase
   * sin que nada lo explique.
   *
   * <p>Se olvida al usuario pase lo que pase. Si la peticion falla —red caida, sesion ya
   * vencida— dejar la barra diciendo que hay sesion es peor que quedarse corto: el alumno
   * cree que sigue dentro y no vuelve a entrar.
   */
  cerrarSesion(): Observable<void> {
    return this.http.post<void>(`${this.base}/salir`, {}).pipe(
      catchError(() => of(undefined)),
      tap(() => this.usuarioActual.set(null)),
    );
  }

  /**
   * Pone o cambia la contrasena de la cuenta con sesion abierta.
   *
   * <p>El backend exige ademas que el correo este verificado. Quien entro por un proveedor
   * externo ya cumple: el proveedor lo verifico.
   */
  establecerContrasena(contrasena: string): Observable<void> {
    return this.http
      .post<void>(`${this.base}/contrasena`, { contrasena })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => new Error(this.traducir(error)))),
      );
  }

  /**
   * Lleva al alumno al proveedor externo.
   *
   * <p>El flujo lo inicia el backend, no el frontend: es el unico que conoce el secreto de
   * cliente y el que valida que el proveedor declare el correo como verificado. Sin esa
   * validacion, cualquiera podria apropiarse de la cuenta de otro registrando su correo en
   * el proveedor (docs/06 §1).
   */
  urlProveedor(proveedor: ProveedorExterno): string {
    return `${entorno.urlApi}/acceso/oauth2/${proveedor}`;
  }

  private traducir(error: HttpErrorResponse): string {
    const codigo = error.error?.codigoError as string | undefined;
    return (codigo && MENSAJES_POR_CODIGO[codigo]) || MENSAJE_GENERICO;
  }
}
