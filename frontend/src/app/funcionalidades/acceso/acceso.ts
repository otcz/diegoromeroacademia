import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alerta } from '../../compartido/componentes/alerta/alerta';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Campo } from '../../compartido/componentes/campo/campo';
import { Marca } from '../../compartido/componentes/marca/marca';
import { AutenticacionServicio } from '../../nucleo/servicios/autenticacion-servicio';
import { ACTIVOS } from '../../disenio/activos';
import { DESTINO_TRAS_INGRESAR } from '../../app.routes';
import { NombreMarca } from '../../disenio/iconos/marcas';
import { entorno } from '../../../entornos/entorno';

/**
 * Los textos de la pantalla, del handoff de diseño aprobado.
 *
 * <p>Viven aqui arriba y no repartidos por la plantilla: el titular y la bajada aparecen en
 * el panel de la foto y son lo que ANTES estaba quemado dentro del afiche. Sacarlos a texto
 * es la mitad del rediseño — asi escalan con el navegador, se pueden seleccionar, los lee un
 * lector de pantalla y algun dia se pueden traducir.
 */
const TITULAR = 'Aprende a tocar acordeón desde cero';
const BAJADA = 'Clases en video, a tu ritmo, con acompañamiento real.';
const INTRO = 'Accede a tus lecciones de acordeón y sigue desde donde quedaste.';

/** Bloque de identidad que encabeza la pantalla. El nombre de la academia, en dos lineas. */
const MARCA = { nombre: 'Diego Romero Acordeón', bajada: 'Estudio académico' } as const;

/**
 * Rotulo de la esquina superior de la foto.
 *
 * <p>Dice QUE es esto en tres palabras, sin repetir el nombre que ya esta en el bloque de
 * marca. Es lo primero que necesita saber quien llega sin conocer la escuela — el titular de
 * abajo dice que se aprende, este dice donde se esta.
 */
const KICKER_FOTO = 'Escuela de acordeón vallenato';

/**
 * Redes sociales, al pie de la foto.
 *
 * <p>Hoy solo YouTube: es el unico destino que se ha podido verificar. Los otros cuatro
 * —TikTok, Facebook, X e Instagram— entran en cuanto el propietario pase sus usuarios.
 * Inventarlos llevaria al alumno al perfil de otra persona con el logotipo de la academia
 * al lado, que es peor que no ofrecer el enlace.
 */
export interface RedSocial {
  readonly marca: NombreMarca;
  readonly nombre: string;
  readonly url: string;
}

const REDES: readonly RedSocial[] = [
  { marca: 'youtube', nombre: 'YouTube', url: 'https://youtube.com/@DiegoRomeroAcordeon' },
];

/** Longitud minima de contrasena aceptada por el formulario. La real la impone el backend. */
const LONGITUD_MINIMA_CONTRASENA = 8;

type EstadoAcceso = 'inactivo' | 'enviando' | 'error';

/**
 * Pantalla de acceso (pantalla 3, especificacion §6.1).
 *
 * <p>Los tres metodos de ingreso quedan jerarquizados como pide la especificacion §14.1:
 * los proveedores externos arriba, porque eliminan el soporte por contrasenas olvidadas
 * —constante en este publico—, y el correo debajo como respaldo obligatorio.
 *
 * <p>La validacion de aqui es solo comodidad para el alumno. La de verdad esta en el
 * backend: este formulario asume que puede ser sustituido por `curl` (docs/06 §2).
 */
@Component({
  selector: 'adr-acceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alerta, Boton, Campo, Marca, ReactiveFormsModule],
  templateUrl: './acceso.html',
  styleUrl: './acceso.scss',
})
export class Acceso {
  private readonly autenticacion = inject(AutenticacionServicio);
  private readonly router = inject(Router);

  protected readonly formulario = new FormGroup({
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    contrasena: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(LONGITUD_MINIMA_CONTRASENA)],
    }),
  });

  protected readonly estado = signal<EstadoAcceso>('inactivo');
  protected readonly mensajeError = signal('');

  /**
   * La foto del panel, sin los textos del afiche.
   *
   * <p>El afiche traia su rotulacion quemada; el diseño aprobado la saca a la interfaz. La
   * imagen se queda con lo que solo ella puede dar: a Diego tocando.
   */
  protected readonly foto = ACTIVOS.diegoTocando;

  /** El mismo logotipo que la barra y el pie: una sola fuente para la marca. */
  protected readonly logotipo = ACTIVOS.logotipo;

  protected readonly titular = TITULAR;
  protected readonly bajada = BAJADA;
  protected readonly intro = INTRO;
  protected readonly marca = MARCA;
  protected readonly kickerFoto = KICKER_FOTO;
  protected readonly redes = REDES;

  protected readonly urlGoogle = this.autenticacion.urlProveedor('google');
  protected readonly urlFacebook = this.autenticacion.urlProveedor('facebook');
  protected readonly facebookHabilitado = entorno.loginFacebookHabilitado;

  /**
   * Envia las credenciales.
   *
   * <p>Si el formulario es invalido se marcan todos los campos como tocados para que los
   * errores aparezcan de golpe: dejar el boton sin respuesta visible es lo que hace que el
   * alumno crea que la pagina se rompio.
   */
  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.estado.set('enviando');
    this.mensajeError.set('');

    this.autenticacion.iniciarSesion(this.formulario.getRawValue()).subscribe({
      // Entrar TIENE que llevar a algun sitio. Antes solo se apagaba el estado de envio: la
      // contrasena correcta dejaba al alumno en la misma pantalla, mirando el mismo
      // formulario, sin nada que dijera que habia entrado. Indistinguible de no funcionar.
      //
      // Y va reemplazando la entrada del historial: sin eso, «atras» devuelve al formulario
      // de ingreso a alguien que acaba de ingresar. Con Google no basta —la redireccion la
      // hace el servidor y `/acceso` ya esta en el historial—, y por eso ademas hay guarda.
      next: () => {
        this.estado.set('inactivo');
        this.router.navigate([DESTINO_TRAS_INGRESAR], { replaceUrl: true });
      },
      error: (error: Error) => {
        this.estado.set('error');
        this.mensajeError.set(error.message);
      },
    });
  }
}
