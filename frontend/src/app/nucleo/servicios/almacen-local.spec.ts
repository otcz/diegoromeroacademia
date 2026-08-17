import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AlmacenLocal } from './almacen-local';

/**
 * El envoltorio del almacenamiento.
 *
 * <p>Lo unico que hay que probar aqui es la DEGRADACION: que un almacen que lanza excepcion
 * —Safari en privado— o un valor corrupto no tumben la aplicacion. Que `setItem` funcione lo
 * garantiza el navegador.
 */
describe('AlmacenLocal', () => {
  let almacen: AlmacenLocal;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    almacen = TestBed.inject(AlmacenLocal);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('debe guardar y leer texto', () => {
    almacen.escribirTexto('adr-prueba', 'hola');

    expect(almacen.leerTexto('adr-prueba')).toBe('hola');
  });

  it('debe devolver nulo cuando la clave no existe', () => {
    expect(almacen.leerTexto('adr-inexistente')).toBeNull();
  });

  it('debe guardar y leer objetos', () => {
    almacen.escribirObjeto('adr-carro', { ac1: 2 });

    expect(almacen.leerObjeto('adr-carro', {})).toEqual({ ac1: 2 });
  });

  it('debe caer en el respaldo cuando el JSON guardado esta corrupto', () => {
    // Pasa con una pestania cerrada a mitad de escritura o con un formato anterior. Un
    // carrito ilegible no puede impedir que la tienda se dibuje.
    localStorage.setItem('adr-carro', '{roto');

    expect(almacen.leerObjeto('adr-carro', { vacio: true })).toEqual({ vacio: true });
  });

  it('debe devolver el respaldo, y no reventar, si el almacen lanza al leer', () => {
    // Safari en navegacion privada: el objeto existe pero cualquier acceso tira SecurityError.
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(almacen.leerTexto('adr-tema')).toBeNull();
    expect(almacen.leerObjeto('adr-carro', { vacio: true })).toEqual({ vacio: true });
  });

  it('debe tragarse el fallo al escribir en vez de propagarlo', () => {
    // Tambien pasa al llenarse la cuota. Que una preferencia no se recuerde es un
    // inconveniente; que la pantalla se caiga al guardarla es un fallo.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => almacen.escribirTexto('adr-tema', 'oscuro')).not.toThrow();
    expect(() => almacen.escribirObjeto('adr-carro', { ac1: 1 })).not.toThrow();
  });

  it('debe tragarse una estructura que no se puede serializar', () => {
    const conCiclo: Record<string, unknown> = {};
    conCiclo['yo'] = conCiclo;

    expect(() => almacen.escribirObjeto('adr-ciclo', conCiclo)).not.toThrow();
  });
});
