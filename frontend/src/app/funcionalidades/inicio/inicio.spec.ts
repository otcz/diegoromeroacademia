import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { Inicio } from './inicio';

/**
 * El panel de inicio.
 *
 * <p>Lo que se vigila aqui son las tres reglas que este panel puede romper en silencio: que
 * bajo «Tutoriales que compraste» solo haya cosas COMPRADAS, que las flechas del carrusel
 * digan la verdad sobre lo que queda fuera de vista, y que la facturacion no vuelva a
 * colarse entre la ruta de estudio.
 */
describe('Inicio', () => {
  function crear(): ComponentFixture<Inicio> {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    return fixture;
  }

  const pista = (f: ComponentFixture<Inicio>): HTMLElement =>
    f.nativeElement.querySelector('.inicio__carrusel');

  const flechas = (f: ComponentFixture<Inicio>): HTMLButtonElement[] =>
    Array.from(f.nativeElement.querySelectorAll('.inicio__flecha'));

  /**
   * Finge una fila mas ancha que su hueco.
   *
   * <p>jsdom no maqueta: `scrollWidth`, `clientWidth` y `scrollLeft` devuelven 0 siempre, asi
   * que sin esto la prueba de las flechas pasaria en vacio para siempre.
   */
  function simularFila(
    elemento: HTMLElement,
    medidas: { visible: number; total: number; desplazado: number },
  ): void {
    Object.defineProperty(elemento, 'clientWidth', {
      value: medidas.visible,
      configurable: true,
    });
    Object.defineProperty(elemento, 'scrollWidth', { value: medidas.total, configurable: true });
    Object.defineProperty(elemento, 'scrollLeft', {
      value: medidas.desplazado,
      configurable: true,
      writable: true,
    });
    elemento.dispatchEvent(new Event('scroll'));
  }

  it('debe ensenar bajo «compraste» solo lo que el alumno pago', () => {
    // El fallo que motiva esta prueba: el panel listaba el catalogo entero, asi que bajo el
    // titulo «Tutoriales que compraste» aparecia una tarjeta con su boton de «Comprar».
    const fixture = crear();
    const carrusel = pista(fixture);

    expect(carrusel.querySelectorAll('adr-tarjeta-tutorial').length).toBeGreaterThan(1);
    expect(carrusel.textContent).not.toContain('Comprar');
    expect(carrusel.querySelectorAll('.tutorial__precio')).toHaveLength(0);
  });

  it('debe esconder las flechas cuando la coleccion entera cabe en la fila', () => {
    // Dos botones apagados en una fila que no se puede mover no informan de nada.
    const fixture = crear();

    simularFila(pista(fixture), { visible: 900, total: 900, desplazado: 0 });
    fixture.detectChanges();

    expect(flechas(fixture)).toHaveLength(0);
  });

  it('debe apagar la flecha del extremo en el que ya esta', () => {
    const fixture = crear();

    simularFila(pista(fixture), { visible: 400, total: 1200, desplazado: 0 });
    fixture.detectChanges();

    const [anterior, siguiente] = flechas(fixture);
    expect(anterior.disabled).toBe(true);
    expect(siguiente.disabled).toBe(false);

    simularFila(pista(fixture), { visible: 400, total: 1200, desplazado: 800 });
    fixture.detectChanges();

    expect(flechas(fixture)[0].disabled).toBe(false);
    expect(flechas(fixture)[1].disabled).toBe(true);
  });

  it('debe desplazar la fila una tarjeta al pulsar la flecha', () => {
    const fixture = crear();
    const carrusel = pista(fixture);
    const desplazamiento = vi.fn();
    // jsdom no implementa `scrollBy`: se comprueba con que se pida, y con que sentido.
    Object.defineProperty(carrusel, 'scrollBy', { value: desplazamiento, configurable: true });

    simularFila(carrusel, { visible: 400, total: 1200, desplazado: 200 });
    fixture.detectChanges();

    flechas(fixture)[1].click();
    expect(desplazamiento).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
    expect(desplazamiento.mock.calls[0][0].left).toBeGreaterThanOrEqual(0);

    flechas(fixture)[0].click();
    expect(desplazamiento.mock.calls[1][0].left).toBeLessThanOrEqual(0);
  });

  it('debe dejar la ruta y el taller en vivo como las dos unicas columnas', () => {
    // El panel de suscripcion vivia en esta fila. Se fue a la barra lateral y a /suscripcion:
    // el precio y el medio de pago no son parte del plan de estudio.
    const fixture = crear();
    const columnas = fixture.nativeElement.querySelector('.inicio__columnas');

    expect(columnas.children).toHaveLength(2);
    expect(columnas.textContent).toContain('Tu ruta del Nivel Intermedio');
    expect(columnas.textContent).toContain('CLASE EN VIVO');
    expect(fixture.nativeElement.textContent).not.toContain('Tu suscripción');
    expect(fixture.nativeElement.textContent).not.toContain('Gestionar plan');
  });

  it('debe conservar el estado de la suscripcion en la cabecera', () => {
    // Quitar el panel no puede dejar al alumno sin saber si su plan sigue vivo.
    expect(crear().nativeElement.querySelector('.inicio__estado').textContent).toContain(
      'Suscripción activa',
    );
  });
});
