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

  it('debe empezar con la barra lateral expandida y todo lo flotante cerrado', () => {
    // Un panel abierto al entrar tapa la pantalla que el alumno vino a ver.
    const disposicion = crear();

    expect(disposicion.barraLateralExpandida()).toBe(true);
    expect(disposicion.carrito()).toBe(false);
    expect(disposicion.menuUsuario()).toBe(false);
  });

  it('debe recordar la barra lateral plegada entre visitas', () => {
    // Quien la pliega lo hace para ganar ancho: volver a plegarla en cada carga es
    // exactamente el trabajo que se queria evitar.
    crear().alternarBarraLateral();

    // El valor guardado sigue diciendo «oculta» aunque plegada la barra siga visible como
    // riel: renombrarlo habria descolocado la preferencia ya escrita en cada navegador.
    expect(localStorage.getItem(CLAVE_BARRA_LATERAL)).toBe('oculta');

    TestBed.resetTestingModule();
    expect(crear().barraLateralExpandida()).toBe(false);
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
