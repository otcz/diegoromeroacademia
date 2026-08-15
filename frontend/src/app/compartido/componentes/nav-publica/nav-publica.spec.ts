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
    expect(texto).toContain('Planes');
    expect(texto).toContain('Entrar');
    expect(texto).toContain('Registrarme');
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
