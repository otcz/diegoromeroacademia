import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AutenticacionServicio } from './autenticacion-servicio';
import { RespuestaAcceso } from '../modelos/autenticacion';

describe('AutenticacionServicio', () => {
  let servicio: AutenticacionServicio;
  let http: HttpTestingController;

  const RESPUESTA: RespuestaAcceso = {
    tokenAcceso: 'token-de-prueba',
    expiraEn: '2026-08-15T06:00:00Z',
    usuario: {
      id: '1',
      nombre: 'Alumno de prueba',
      correo: 'alumno@correo.com',
      rol: 'estudiante',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(AutenticacionServicio);
    http = TestBed.inject(HttpTestingController);
  });

  it('debe enviar las credenciales al endpoint de sesion', async () => {
    servicio.iniciarSesion({ correo: 'alumno@correo.com', contrasena: 'secreta123' }).subscribe();

    const peticion = http.expectOne((r) => r.url.endsWith('/acceso/sesion'));
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body.correo).toBe('alumno@correo.com');
    peticion.flush(RESPUESTA);
  });

  it('debe guardar el usuario de la sesion tras un acceso correcto', async () => {
    expect(servicio.usuario()).toBeNull();

    servicio.iniciarSesion({ correo: 'alumno@correo.com', contrasena: 'secreta123' }).subscribe();
    http.expectOne((r) => r.url.endsWith('/acceso/sesion')).flush(RESPUESTA);

    expect(servicio.usuario()?.correo).toBe('alumno@correo.com');
  });

  it('debe traducir el codigo de credenciales invalidas a un mensaje para el alumno', async () => {
    let mensaje = '';
    servicio
      .iniciarSesion({ correo: 'alumno@correo.com', contrasena: 'equivocada' })
      .subscribe({ error: (e: Error) => (mensaje = e.message) });

    http
      .expectOne((r) => r.url.endsWith('/acceso/sesion'))
      .flush({ codigoError: 'CREDENCIALES_INVALIDAS' }, { status: 400, statusText: 'Bad Request' });

    expect(mensaje).toContain('no coinciden');
  });

  it('debe traducir el bloqueo por intentos fallidos', async () => {
    let mensaje = '';
    servicio
      .iniciarSesion({ correo: 'alumno@correo.com', contrasena: 'x' })
      .subscribe({ error: (e: Error) => (mensaje = e.message) });

    http
      .expectOne((r) => r.url.endsWith('/acceso/sesion'))
      .flush({ codigoError: 'CUENTA_BLOQUEADA' }, { status: 423, statusText: 'Locked' });

    expect(mensaje).toContain('bloqueada temporalmente');
  });

  it('debe dar un mensaje generico ante un error sin codigo, sin filtrar el detalle', async () => {
    let mensaje = '';
    servicio
      .iniciarSesion({ correo: 'alumno@correo.com', contrasena: 'x' })
      .subscribe({ error: (e: Error) => (mensaje = e.message) });

    http
      .expectOne((r) => r.url.endsWith('/acceso/sesion'))
      .flush(
        { detalle: 'org.postgresql.util.PSQLException: relation usuario does not exist' },
        { status: 500, statusText: 'Server Error' },
      );

    expect(mensaje).toBe('No pudimos iniciar sesión. Intenta de nuevo en unos minutos.');
    expect(mensaje).not.toContain('PSQLException');
  });

  it('debe construir la URL del proveedor apuntando al backend, no al proveedor', async () => {
    expect(servicio.urlProveedor('google')).toContain('/acceso/oauth2/google');
    expect(servicio.urlProveedor('facebook')).toContain('/acceso/oauth2/facebook');
  });
});
