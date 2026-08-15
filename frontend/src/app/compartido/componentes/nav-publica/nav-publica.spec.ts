import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NavPublica } from './nav-publica';

describe('NavPublica', () => {
  async function crear() {
    const fixture = TestBed.createComponent(NavPublica);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

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
