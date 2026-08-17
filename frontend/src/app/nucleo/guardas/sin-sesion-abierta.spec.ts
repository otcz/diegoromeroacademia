import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { DESTINO_TRAS_INGRESAR } from '../../app.routes';
import { entorno } from '../../../entornos/entorno';
import { sinSesionAbierta } from './sin-sesion-abierta';

/**
 * La guarda que impide volver al formulario de ingreso estando ya dentro.
 *
 * <p>El defecto que la motivo: entrar con Google termina en una redireccion del servidor, y
 * `/acceso` se queda en el historial. Al pulsar «atras» el alumno volvia al formulario —ya
 * autenticado, mirando una pantalla que le pide autenticarse.
 */
describe('sinSesionAbierta', () => {
  const USUARIO = {
    id: '5d082da2-aafe-4606-a53a-76326f5713e2',
    nombre: 'Alumno',
    correo: 'alumno@ejemplo.com',
    rol: 'estudiante',
  };

  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  function invocar(): Observable<boolean | UrlTree> {
    return TestBed.runInInjectionContext(() =>
      sinSesionAbierta({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as Observable<boolean | UrlTree>;
  }

  /**
   * Ejecuta la guarda y devuelve su veredicto.
   *
   * <p>Se SUSCRIBE antes de responder a proposito: el observable es frio y sin suscripcion la
   * peticion no llega a salir, asi que `expectOne` no encontraria nada.
   */
  async function ejecutar(respuesta: object | null, estado?: number) {
    const veredicto = firstValueFrom(invocar());

    const peticion = http.expectOne(`${entorno.urlApi}/acceso/sesion`);
    peticion.flush(respuesta, estado ? { status: estado, statusText: '' } : undefined);

    return veredicto;
  }

  it('debe dejar ver el formulario a quien NO tiene sesion', async () => {
    // Un 401 aqui no es un fallo: es la respuesta esperada de un visitante.
    expect(await ejecutar(null, 401)).toBe(true);
  });

  it('debe desviar al panel del alumno a quien YA entro', async () => {
    const veredicto = await ejecutar(USUARIO);

    // Un UrlTree y no un `false`: devolver `false` deja al visitante donde estaba y sin
    // decir nada, que pulsando «atras» significa quedarse mirando el formulario.
    expect(veredicto).toBeInstanceOf(UrlTree);
    // El destino sale de DESTINO_TRAS_INGRESAR y no se escribe aqui a mano: si se copiara,
    // el dia que cambie la prueba seguiria verde comprobando el destino viejo.
    expect(TestBed.inject(Router).serializeUrl(veredicto as UrlTree)).toBe(DESTINO_TRAS_INGRESAR);
  });

  it('debe PREGUNTAR al backend y no fiarse de lo que el frontend recuerde', async () => {
    // Tras la redireccion de Google la aplicacion arranca de cero: lo que el frontend
    // recuerda esta vacio justo cuando mas importa saber quien entro.
    await ejecutar(USUARIO);

    http.verify();
  });
});
