import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { entorno } from '../../../../entornos/entorno';
import { NavPublica } from './nav-publica';

describe('NavPublica', () => {
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

  async function crear() {
    const fixture = TestBed.createComponent(NavPublica);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  async function refrescar(fixture: Awaited<ReturnType<typeof crear>>) {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  /** La barra ya dibujada, con la respuesta de sesion que se le indique. */
  async function crearConSesion(usuario: object | null) {
    const fixture = TestBed.createComponent(NavPublica);
    fixture.detectChanges();

    const peticion = http.expectOne(`${entorno.urlApi}/acceso/sesion`);
    peticion.flush(usuario, usuario ? undefined : { status: 401, statusText: '' });

    await refrescar(fixture);
    return fixture;
  }

  it('NO debe ofrecer «Entrar» a quien ya entro, sino su cuenta y la salida', async () => {
    const fixture = await crearConSesion(USUARIO);
    const texto: string = fixture.nativeElement.textContent;

    // Antes la barra ofrecia «Entrar» y «Registrarme» a quien ya estaba dentro, y no ofrecia
    // ninguna forma de salir: la unica manera era borrar las cookies a mano.
    expect(texto).toContain('Cerrar sesión');
    expect(texto).toContain(USUARIO.nombre);
    expect(texto).not.toContain('Registrarme');
  });

  it('debe cerrar la sesion EN EL BACKEND, no solo olvidarla aqui', async () => {
    const fixture = await crearConSesion(USUARIO);

    const boton = [...fixture.nativeElement.querySelectorAll('button')].find((b) =>
      (b as HTMLButtonElement).textContent?.includes('Cerrar sesión'),
    ) as HTMLButtonElement;
    boton.click();
    await refrescar(fixture);

    // Olvidar al usuario solo en el frontend seria mentira: la cookie seguiria valiendo y
    // bastaria recargar para volver a estar dentro.
    const peticion = http.expectOne(`${entorno.urlApi}/acceso/salir`);

    // POST y no GET: un GET lo dispara cualquier sitio ajeno con una etiqueta de imagen
    // apuntando aqui, y el alumno se veria expulsado sin que nada lo explique.
    expect(peticion.request.method).toBe('POST');

    peticion.flush(null);
    await refrescar(fixture);

    expect(fixture.nativeElement.textContent).toContain('Entrar');
  });

  it('debe olvidar la sesion aunque la peticion de salir falle', async () => {
    const fixture = await crearConSesion(USUARIO);

    const boton = [...fixture.nativeElement.querySelectorAll('button')].find((b) =>
      (b as HTMLButtonElement).textContent?.includes('Cerrar sesión'),
    ) as HTMLButtonElement;
    boton.click();
    await refrescar(fixture);

    // Red caida o sesion ya vencida. Dejar la barra diciendo que hay sesion es peor que
    // quedarse corto: el alumno cree que sigue dentro y no vuelve a entrar.
    http
      .expectOne(`${entorno.urlApi}/acceso/salir`)
      .flush(null, { status: 500, statusText: 'Server Error' });
    await refrescar(fixture);

    expect(fixture.nativeElement.textContent).toContain('Entrar');
    expect(fixture.nativeElement.textContent).not.toContain('Cerrar sesión');
  });

  it('debe llevar el logotipo a la portada desde CUALQUIER pagina', async () => {
    const fixture = await crear();
    const marca: HTMLAnchorElement = fixture.nativeElement.querySelector('.adr-nav__marca');

    // Llevaba «#inicio» a secas. En la portada colaba, pero la barra tambien se usa en
    // /acceso y /perfil, y alli el ancla no existe: pulsar el logotipo solo pegaba «#inicio»
    // a la URL actual y no pasaba nada. Un control que parece pulsable y no responde es lo
    // que hace pensar que la aplicacion se rompio.
    //
    // Se comprueba el href resuelto y no el atributo: `routerLink` escribe uno y otro, y lo
    // que importa es a donde apunta de verdad.
    expect(new URL(marca.href).pathname).toBe('/');
    expect(new URL(marca.href).hash).toBe('#inicio');
  });

  it('debe llevar las tres secciones a la portada, no a un ancla suelta', async () => {
    const fixture = await crear();
    const enlaces: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('#menu-principal a'),
    );

    // Mismo defecto que tenia el logotipo: la barra se usa tambien en /perfil y en la
    // pagina de no encontrado, donde estas secciones NO existen. Con «#catalogo» a secas el
    // enlace se limitaba a pegar el ancla a la URL y no pasaba nada.
    for (const ancla of ['catalogo', 'simulador', 'planes']) {
      const enlace = enlaces.find((a) => a.href.endsWith(`#${ancla}`));
      expect(enlace, ancla).toBeDefined();
      expect(new URL(enlace!.href).pathname, ancla).toBe('/');
    }
  });

  it('debe ofrecer los tres enlaces de seccion y las dos acciones de cuenta', async () => {
    const fixture = await crear();

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('Cursos');
    expect(texto).toContain('Simulador');
    // «Precios» y no «Planes»: el visitante que llega de YouTube no compra software.
    expect(texto).toContain('Precios');
    expect(texto).toContain('Entrar');
    expect(texto).toContain('Registrarme');
  });

  it('debe dejar una accion FUERA del menu colapsable, para movil', async () => {
    const fixture = await crear();
    const raiz: HTMLElement = fixture.nativeElement;

    // En movil el menu esta oculto, asi que las cinco acciones vivian tras la hamburguesa:
    // medido, entre el bloque del heroe y el siguiente boton visible habia 4737 px, casi seis
    // pantallas de argumento sin nada que pulsar. Y es el canal mayoritario (§14.1).
    const cta = raiz.querySelector('.adr-nav__cta-movil');
    expect(cta).not.toBeNull();
    expect(cta?.closest('.adr-nav__menu')).toBeNull();
    expect(cta?.textContent?.trim()).toBe('Empezar');
  });

  it('debe navegar sin recargar la aplicacion en los destinos internos', async () => {
    const fixture = await crear();

    // Con `href`, cada clic interno vuelve a descargar el paquete entero y el visitante ve
    // un parpadeo en blanco. `routerLink` deja el `href` puesto para el clic derecho y para
    // los buscadores, pero intercepta la navegacion.
    const acciones: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.adr-nav__acciones a'),
    );

    expect(acciones.length).toBe(2);
    for (const enlace of acciones) {
      expect(enlace.getAttribute('href')?.startsWith('/')).toBe(true);
    }
  });

  it('debe arrancar con el menu movil cerrado', async () => {
    const fixture = await crear();

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('.adr-nav__boton');
    const menu: HTMLElement = fixture.nativeElement.querySelector('#menu-principal');

    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(menu.className).not.toContain('adr-nav__menu--abierto');
  });

  it('debe abrir el menu al pulsar y anunciarlo con aria-expanded', async () => {
    const fixture = await crear();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('.adr-nav__boton');

    boton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const menu: HTMLElement = fixture.nativeElement.querySelector('#menu-principal');
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(menu.className).toContain('adr-nav__menu--abierto');
  });

  it('debe cerrarse al elegir un enlace, para no tapar el destino al que se navega', async () => {
    const fixture = await crear();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('.adr-nav__boton');

    boton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const enlace: HTMLAnchorElement = fixture.nativeElement.querySelector('#menu-principal a');
    enlace.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const menu: HTMLElement = fixture.nativeElement.querySelector('#menu-principal');
    expect(menu.className).not.toContain('adr-nav__menu--abierto');
  });
});
