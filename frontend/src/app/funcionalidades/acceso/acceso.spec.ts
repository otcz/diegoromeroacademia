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

    // El formulario de esta pantalla solo INICIA SESION —su unico boton dice «Entrar»— y no
    // hay pantalla de recuperacion. Llevar al visitante a un 404 justo donde hay que ganarse
    // su confianza es el peor sitio para hacerlo.
    //
    // Se comprueba el destino y no el texto: la redaccion se afina, y una prueba clavada a
    // la frase exacta solo obliga a venir a reescribirla sin proteger nada.
    for (const roto of ['/registro', '/recuperar-contrasena']) {
      expect(fixture.nativeElement.querySelector(`a[href="${roto}"]`)).toBeNull();
    }
  });

  it('debe meter TODO el texto de marca dentro del cuerpo, que es lo que lleva el velo', async () => {
    const fixture = await crear();
    const cuerpo = fixture.nativeElement.querySelector('.acceso__marca-cuerpo');

    // El contraste sobre la foto no se consigue midiendo la imagen —cambia en cada pixel—
    // sino tapandola donde hay letra, y el velo que la tapa es el fondo de ESTE bloque. Un
    // texto colgado fuera queda sobre la foto limpia: legible o no segun la toma y segun el
    // alto de la ventana. Paso de verdad con el pie de instrumentos, que estaba suelto.
    for (const parte of ['titulo', 'cifras', 'procedencia', 'pie']) {
      const clase = parte === 'cifras' ? '.acceso__cifras' : `.acceso__marca-${parte}`;
      const elemento = fixture.nativeElement.querySelector(
        parte === 'procedencia' ? '.acceso__procedencia' : clase,
      );
      expect(elemento, parte).not.toBeNull();
      expect(cuerpo.contains(elemento), parte).toBe(true);
    }
  });

  it('debe decir la verdad sobre como se abre una cuenta: entrando con Google', async () => {
    const fixture = await crear();
    const texto: string = fixture.nativeElement.textContent;

    // Decia «Crear cuenta — proximamente» y era falso: `IngresarConProveedorExterno` busca
    // por sujeto, luego por correo, y si no encuentra a nadie CREA el usuario. Quien llegaba
    // por primera vez leia que no podia entrar, teniendo el boton que lo hace justo encima.
    expect(texto).toContain('Primera vez');
    expect(texto).toContain('Google');
    expect(texto).not.toContain('próximamente');
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
