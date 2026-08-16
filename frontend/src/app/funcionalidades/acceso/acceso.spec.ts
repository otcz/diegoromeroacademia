import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('debe conservar un h1, aunque no se vea: es el nombre de la pagina', async () => {
    const fixture = await crear();
    const titulo: HTMLElement = fixture.nativeElement.querySelector('h1');

    // El propietario pidio quitar el texto visible. Borrar el encabezado ademas habria
    // dejado la pagina sin nombre para quien navega saltando de encabezado en encabezado
    // con un lector de pantalla, y sin el h1 que espera cualquier auditoria. Se oculta a la
    // vista, no a la asistencia: son dos cosas distintas y aqui solo se pidio una.
    expect(titulo).not.toBeNull();
    expect(titulo.textContent?.trim()).not.toBe('');
    expect(titulo.className).toContain('adr-solo-lectores');
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

  it('NO debe poner texto propio sobre el afiche, y debe darle un rotulo al lector', async () => {
    const fixture = await crear();
    const panel: HTMLElement = fixture.nativeElement.querySelector('.acceso__marca');

    // Sin texto nuestro: el afiche ya trae el suyo quemado, y dos textos en la misma columna
    // se pelean. Ademas cualquier palabra que vuelva aqui quedaria sobre la imagen sin velo
    // detras, con el contraste a merced de los pixeles que le tocaran.
    expect(panel.textContent?.trim()).toBe('');

    // Pero NO oculto al lector de pantalla: la rotulacion del afiche es hoy lo unico que
    // nombra la marca en esta pantalla, y un lector no puede leer letras hechas de pixeles.
    expect(panel.getAttribute('role')).toBe('img');
    expect(panel.getAttribute('aria-label')).toContain('Diego Romero');
    expect(panel.getAttribute('aria-hidden')).toBeNull();
  });

  it('no debe llevar mas texto del imprescindible para entrar', async () => {
    const fixture = await crear();
    const texto: string = fixture.nativeElement.textContent;

    // Se quitaron la explicacion del metodo y la nota de primera vez: el propietario los
    // considera ruido, y los dos botones ya dicen lo que hacen. Esta prueba sujeta esa
    // decision — sin ella, la proxima frase «util» vuelve sin que nadie lo note.
    //
    // El titular no esta en la lista porque NO se borro: sigue en el `h1` invisible, y por
    // tanto sigue en `textContent`. Que no se vea lo comprueba la prueba de arriba.
    for (const retirado of ['Usa el método', 'Primera vez', 'queda creada']) {
      expect(texto, retirado).not.toContain(retirado);
    }

    // Lo que si tiene que seguir estando.
    expect(texto).toContain('Continuar con Google');
    expect(texto).toContain('Entrar');
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

  it('debe LLEVAR a algun sitio tras entrar, y sin dejar el formulario en el historial', async () => {
    const fixture = await crear();
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    escribirCredenciales(fixture);
    await refrescar(fixture);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await refrescar(fixture);

    http.expectOne((r) => r.url.endsWith('/acceso/sesion')).flush({ usuario: {} });
    await refrescar(fixture);

    // Antes solo se apagaba el estado de envio: la contrasena correcta dejaba al alumno en
    // la misma pantalla, mirando el mismo formulario. Indistinguible de no funcionar.
    //
    // `replaceUrl` porque, si no, «atras» devuelve al formulario de ingreso a alguien que
    // acaba de ingresar. Es la mitad del arreglo — la otra es la guarda de la ruta, que es
    // la que cubre el ingreso con Google, donde la redireccion la hace el servidor.
    expect(navegar).toHaveBeenCalledWith(['/'], { replaceUrl: true });
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
