import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Acceso } from './acceso';

describe('Acceso', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  async function crear() {
    const fixture = TestBed.createComponent(Acceso);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  async function refrescar(fixture: Awaited<ReturnType<typeof crear>>) {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function escribirCredenciales(fixture: Awaited<ReturnType<typeof crear>>) {
    const entradas: HTMLInputElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('input'),
    );
    entradas[0].value = 'alumno@correo.com';
    entradas[0].dispatchEvent(new Event('input'));
    entradas[1].value = 'secreta123';
    entradas[1].dispatchEvent(new Event('input'));
  }

  it('debe ofrecer Google arriba del formulario de correo, como pide la jerarquia', async () => {
    const fixture = await crear();

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('Continuar con Google');
    expect(texto).toContain('o con tu correo');
    expect(fixture.nativeElement.querySelectorAll('adr-campo').length).toBe(2);
  });

  it('no debe ofrecer Facebook mientras su bandera este apagada', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).not.toContain('Continuar con Facebook');
  });

  it('debe llevar el acceso con Google al backend, que es quien conoce el secreto', async () => {
    const fixture = await crear();

    const enlaces: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const google = enlaces.find((a) => a.textContent?.includes('Google'));

    expect(google?.getAttribute('href')).toContain('/acceso/oauth2/google');
  });

  it('debe explicar la unificacion de cuentas, que es el no negociable numero uno', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).toContain('llegarás a la misma');
  });

  it('no debe ofrecer ninguna salida que todavia no exista', async () => {
    const fixture = await crear();
    const texto: string = fixture.nativeElement.textContent;

    // Esta pantalla solo INICIA SESION: su unico boton dice «Entrar» y el backend todavia no
    // expone ningun controlador. Prometer registro o recuperacion de contrasena manda al
    // visitante a la pantalla de error justo donde hay que ganarse su confianza.
    expect(texto).toContain('Crear cuenta — próximamente');
    expect(texto).toContain('¿Olvidaste tu contraseña? — próximamente');

    for (const roto of ['/registro', '/recuperar-contrasena']) {
      expect(fixture.nativeElement.querySelector(`a[href="${roto}"]`)).toBeNull();
    }
  });

  it('no debe enviar nada con el formulario vacio, y debe marcar los errores', async () => {
    const fixture = await crear();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    http.expectNone((r) => r.url.endsWith('/acceso/sesion'));
    expect(fixture.nativeElement.querySelectorAll('.adr-campo__error').length).toBe(2);
  });

  it('debe enviar las credenciales cuando el formulario es valido', async () => {
    const fixture = await crear();
    escribirCredenciales(fixture);
    await refrescar(fixture);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    const peticion = http.expectOne((r) => r.url.endsWith('/acceso/sesion'));
    expect(peticion.request.body).toEqual({
      correo: 'alumno@correo.com',
      contrasena: 'secreta123',
    });
  });

  it('debe indicar que esta enviando, para que nadie pulse dos veces', async () => {
    const fixture = await crear();
    escribirCredenciales(fixture);
    await refrescar(fixture);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toContain('Entrando');

    http.expectOne((r) => r.url.endsWith('/acceso/sesion')).flush({}, { status: 500, statusText: 'x' });
  });

  it('debe mostrar una alerta cuando el acceso falla', async () => {
    const fixture = await crear();
    escribirCredenciales(fixture);
    await refrescar(fixture);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    http
      .expectOne((r) => r.url.endsWith('/acceso/sesion'))
      .flush({ codigoError: 'CREDENCIALES_INVALIDAS' }, { status: 400, statusText: 'Bad Request' });
    await refrescar(fixture);

    const alerta: HTMLElement = fixture.nativeElement.querySelector('.adr-alerta--error');
    expect(alerta.textContent).toContain('no coinciden');
    expect(alerta.getAttribute('role')).toBe('alert');
  });

  it('debe volver al estado normal tras un acceso correcto', async () => {
    const fixture = await crear();
    escribirCredenciales(fixture);
    await refrescar(fixture);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    http.expectOne((r) => r.url.endsWith('/acceso/sesion')).flush({
      tokenAcceso: 't',
      expiraEn: '2026-08-15T06:00:00Z',
      usuario: { id: '1', nombre: 'Alumno', correo: 'alumno@correo.com', rol: 'estudiante' },
    });
    await refrescar(fixture);

    expect(fixture.nativeElement.querySelector('.adr-alerta--error')).toBeNull();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(boton.disabled).toBe(false);
  });
});
