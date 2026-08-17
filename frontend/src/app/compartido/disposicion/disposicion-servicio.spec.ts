import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLAVE_BARRA_LATERAL, DisposicionServicio } from './disposicion-servicio';

describe('DisposicionServicio', () => {
  function crear(): DisposicionServicio {
    TestBed.configureTestingModule({});
    return TestBed.inject(DisposicionServicio);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('debe empezar con la barra lateral visible y todo lo flotante cerrado', () => {
    // Un panel abierto al entrar tapa la pantalla que el alumno vino a ver.
    const disposicion = crear();

    expect(disposicion.barraLateralVisible()).toBe(true);
    expect(disposicion.carrito()).toBe(false);
    expect(disposicion.menuUsuario()).toBe(false);
  });

  it('debe recordar la barra lateral oculta entre visitas', () => {
    // Quien la oculta lo hace para ganar ancho: volver a ocultarla en cada carga es
    // exactamente el trabajo que se queria evitar.
    crear().alternarBarraLateral();

    expect(localStorage.getItem(CLAVE_BARRA_LATERAL)).toBe('oculta');

    TestBed.resetTestingModule();
    expect(crear().barraLateralVisible()).toBe(false);
  });

  it('NO debe recordar el carrito abierto', () => {
    const disposicion = crear();
    disposicion.abrirCarrito();

    TestBed.resetTestingModule();

    expect(crear().carrito()).toBe(false);
  });

  it('debe cerrar el menu de usuario al abrir el carrito, y al reves', () => {
    // Dos capas flotantes a la vez dejan sin saber cual cierra `Esc`, y en movil se tapan.
    const disposicion = crear();

    disposicion.alternarMenuUsuario();
    disposicion.abrirCarrito();
    expect(disposicion.menuUsuario()).toBe(false);
    expect(disposicion.carrito()).toBe(true);

    disposicion.alternarMenuUsuario();
    expect(disposicion.carrito()).toBe(false);
    expect(disposicion.menuUsuario()).toBe(true);
  });

  it('debe cerrar todo lo flotante de una vez', () => {
    // Lo llama el armazon en cada navegacion: sin esto, tocar «Mi perfil» en el menu
    // navegaba y dejaba el menu abierto encima de la pantalla nueva.
    const disposicion = crear();
    disposicion.abrirCarrito();

    disposicion.cerrarFlotantes();

    expect(disposicion.carrito()).toBe(false);
    expect(disposicion.menuUsuario()).toBe(false);
  });
});
