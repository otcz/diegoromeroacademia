import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLAVE_CARRITO, CarritoServicio } from './carrito-servicio';
import { COSTO_ENVIO_CENTAVOS, ENVIO_GRATIS_DESDE_CENTAVOS } from './comercio-servicio';

/**
 * El carrito.
 *
 * <p>Lo que hay que probar es la ARITMETICA y la persistencia, porque son las dos cosas que
 * cuestan dinero cuando fallan: un total mal calculado se cobra mal, y un carrito que se
 * vacia al recargar pierde la venta.
 */
describe('CarritoServicio', () => {
  /** Correas de cuero DR: $120.000. Barato, para poder probar el umbral de envio. */
  const CORREA = 'ax1';
  /** Hohner Corona III: $4.850.000. Por si solo pasa el umbral de envio gratis. */
  const ACORDEON = 'ac1';

  function crear(): CarritoServicio {
    TestBed.configureTestingModule({});
    return TestBed.inject(CarritoServicio);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('debe empezar vacio y sin cobrar envio', () => {
    const carrito = crear();

    expect(carrito.vacio()).toBe(true);
    expect(carrito.articulos()).toBe(0);
    expect(carrito.resumen().totalCentavos).toBe(0);
    // Sin esto, el panel vacio anunciaba $18.000 de envio sobre un total de cero.
    expect(carrito.resumen().envioCentavos).toBe(0);
    expect(carrito.resumen().envioGratis).toBe(true);
  });

  it('debe sumar unidades y calcular el subtotal contra el catalogo', () => {
    const carrito = crear();

    carrito.anadir(CORREA);
    carrito.anadir(CORREA);

    expect(carrito.cantidadDe(CORREA)).toBe(2);
    expect(carrito.articulos()).toBe(2);
    expect(carrito.resumen().subtotalCentavos).toBe(24_000_000);
    expect(carrito.resumen().lineas[0].subtotalCentavos).toBe(24_000_000);
  });

  it('debe cobrar envio por debajo del umbral y no cobrarlo por encima', () => {
    const carrito = crear();

    carrito.anadir(CORREA);
    expect(carrito.resumen().subtotalCentavos).toBeLessThan(ENVIO_GRATIS_DESDE_CENTAVOS);
    expect(carrito.resumen().envioCentavos).toBe(COSTO_ENVIO_CENTAVOS);
    expect(carrito.resumen().totalCentavos).toBe(12_000_000 + COSTO_ENVIO_CENTAVOS);

    carrito.anadir(ACORDEON);
    expect(carrito.resumen().envioGratis).toBe(true);
    expect(carrito.resumen().envioCentavos).toBe(0);
  });

  it('debe BORRAR la linea al llegar a cero, no dejarla en cero', () => {
    // Una entrada con cantidad cero es una linea fantasma que hay que filtrar en cada sitio
    // que lea el carrito. Basta olvidarlo una vez para que aparezca un producto vacio.
    const carrito = crear();
    carrito.anadir(CORREA);

    carrito.cambiar(CORREA, -1);

    expect(carrito.cantidadDe(CORREA)).toBe(0);
    expect(carrito.resumen().lineas).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? '{}')).toEqual({});
  });

  it('no debe bajar de cero aunque se reste de mas', () => {
    const carrito = crear();

    carrito.cambiar(CORREA, -3);

    expect(carrito.cantidadDe(CORREA)).toBe(0);
  });

  it('debe vaciarse por completo', () => {
    const carrito = crear();
    carrito.anadir(CORREA);
    carrito.anadir(ACORDEON);

    carrito.vaciar();

    expect(carrito.vacio()).toBe(true);
    expect(carrito.resumen().lineas).toHaveLength(0);
  });

  it('debe sobrevivir a una recarga', () => {
    // La razon de ser de la persistencia: el trafico llega en celular y una llamada a mitad
    // de compra no puede vaciar el carrito.
    crear().anadir(CORREA);

    TestBed.resetTestingModule();
    const otraSesion = crear();

    expect(otraSesion.cantidadDe(CORREA)).toBe(1);
  });

  it('debe descartar identificadores que ya no existen en el catalogo', () => {
    // Un producto retirado no puede dejar el carrito en un estado que la pantalla no sepa
    // dibujar. Y lo guardado son identificadores, asi que esto pasa de verdad.
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify({ 'producto-que-ya-no-existe': 3 }));

    const carrito = crear();

    expect(carrito.resumen().lineas).toHaveLength(0);
    expect(carrito.articulos()).toBe(0);
  });

  it('debe guardar identificadores y cantidades, nunca precios', () => {
    // Un precio guardado en el navegador se congela y ademas lo controla el cliente.
    const carrito = crear();
    carrito.anadir(ACORDEON);

    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? '{}');

    expect(guardado).toEqual({ [ACORDEON]: 1 });
    expect(JSON.stringify(guardado)).not.toContain('485');
  });
});
