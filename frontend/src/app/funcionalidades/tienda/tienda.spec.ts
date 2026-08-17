import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DisposicionServicio } from '../../compartido/disposicion/disposicion-servicio';
import { CarritoServicio } from '../../nucleo/servicios/carrito-servicio';
import { Tienda } from './tienda';

/**
 * La tienda.
 *
 * <p>Lo que importa aqui es la relacion con el carrito: que anadir sume de verdad, que la
 * tarjeta diga cuantos hay y que el panel se abra la PRIMERA vez y no en cada toque.
 */
describe('Tienda', () => {
  function crear(): ComponentFixture<Tienda> {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(Tienda);
    fixture.detectChanges();
    return fixture;
  }

  const tarjetas = (f: ComponentFixture<Tienda>) =>
    Array.from(f.nativeElement.querySelectorAll('adr-tarjeta-producto')) as HTMLElement[];

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('debe dibujar el catalogo completo al entrar', () => {
    expect(tarjetas(crear())).toHaveLength(9);
  });

  it('debe filtrar por categoria y volver a todo', () => {
    const fixture = crear();
    const chips = Array.from(
      fixture.nativeElement.querySelectorAll('adr-chip button'),
    ) as HTMLButtonElement[];

    // «Todo» es el primero; «Acordeones» el segundo.
    chips[1].click();
    fixture.detectChanges();
    expect(tarjetas(fixture)).toHaveLength(2);

    chips[0].click();
    fixture.detectChanges();
    expect(tarjetas(fixture)).toHaveLength(9);
  });

  it('debe anadir al carrito y ensenar cuantos hay en la propia tarjeta', () => {
    // Sin el conteo, pulsar dos veces parece que no funciono y el alumno acaba con seis
    // acordeones en el carrito.
    const fixture = crear();
    const anadir = tarjetas(fixture)[0].querySelector('adr-boton button') as HTMLButtonElement;

    anadir.click();
    fixture.detectChanges();

    expect(TestBed.inject(CarritoServicio).articulos()).toBe(1);
    expect(tarjetas(fixture)[0].textContent).toContain('En el carrito · 1');
  });

  it('debe abrir el panel del carrito solo la PRIMERA vez', () => {
    // A partir de ahi la burbuja del icono ya responde, y abrir el panel en cada toque
    // taparia la rejilla justo cuando se anaden varias cosas seguidas.
    const fixture = crear();
    const disposicion = TestBed.inject(DisposicionServicio);
    const anadir = () =>
      (tarjetas(fixture)[0].querySelector('adr-boton button') as HTMLButtonElement).click();

    anadir();
    expect(disposicion.carrito()).toBe(true);

    disposicion.cerrarCarrito();
    anadir();
    fixture.detectChanges();

    expect(disposicion.carrito()).toBe(false);
    expect(TestBed.inject(CarritoServicio).articulos()).toBe(2);
  });

  it('debe ofrecer regalar cada producto', () => {
    // El handoff lo pide en todos: la tienda entera es regalable.
    const fixture = crear();

    const botones = fixture.nativeElement.querySelectorAll('.producto__regalo');

    expect(botones).toHaveLength(9);
  });

  it('debe anunciar el umbral de envio gratis con su importe', () => {
    // Es el dato que decide si el alumno anade una cosa mas.
    expect(crear().nativeElement.textContent).toContain('Envío gratis desde $300.000');
  });
});
