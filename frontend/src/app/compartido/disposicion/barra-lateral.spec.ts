import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BarraLateral } from './barra-lateral';
import { DisposicionServicio } from './disposicion-servicio';

/**
 * La barra lateral y su riel de iconos.
 *
 * <p>Lo que se vigila aqui es una sola cosa, y es la que estaba mal: <b>plegar no es
 * esconder</b>. La hamburguesa borraba la barra de la pantalla y dejaba al alumno sin
 * navegacion, con un boton que no explicaba adonde se habia ido todo.
 *
 * <p>Y lo segundo: que al plegarla no se pierda ningun nombre. Un riel de iconos sin texto
 * accesible son siete enlaces que un lector de pantalla anuncia como «enlace, enlace, enlace».
 */
describe('BarraLateral', () => {
  function crear(): ComponentFixture<BarraLateral> {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(BarraLateral);
    fixture.detectChanges();
    return fixture;
  }

  function plegar(fixture: ComponentFixture<BarraLateral>): void {
    TestBed.inject(DisposicionServicio).alternarBarraLateral();
    fixture.detectChanges();
  }

  const enlaces = (f: ComponentFixture<BarraLateral>): HTMLAnchorElement[] =>
    Array.from(f.nativeElement.querySelectorAll('.lateral__enlace'));

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('debe seguir dibujando la navegacion al plegarse, no desaparecer', () => {
    // El fallo que motiva esta prueba: plegada, la barra entera iba a `display: none` y la
    // aplicacion se quedaba sin ninguna via de navegacion en escritorio.
    const fixture = crear();
    const seccionesAntes = fixture.nativeElement.querySelectorAll('.lateral__nav a').length;

    plegar(fixture);

    expect(fixture.nativeElement.querySelector('.lateral--riel')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.lateral__nav a')).toHaveLength(seccionesAntes);
    // Plegada suma uno: la tarjeta de plan pasa a ser el enlace de la corona.
    expect(enlaces(fixture)).toHaveLength(seccionesAntes + 3);
    expect(fixture.nativeElement.querySelectorAll('adr-icono')).toHaveLength(seccionesAntes + 3);
  });

  it('debe conservar el nombre de cada enlace cuando solo se ve el icono', () => {
    const fixture = crear();
    plegar(fixture);

    for (const enlace of enlaces(fixture)) {
      // El texto sigue en el DOM —oculto solo a la vista— y ademas se ofrece en el `title`,
      // que es lo que ve quien navega con raton.
      expect(enlace.textContent?.trim()).not.toBe('');
      expect(enlace.querySelector('.adr-solo-lectores')).not.toBeNull();
      expect(enlace.getAttribute('title')).toBeTruthy();
    }
  });

  it('debe cambiar la tarjeta de plan por su enlace, sin perder el plan ni su estado', () => {
    // Es el dato por el que el alumno mira aqui. Omitirlo en el riel convertiria el pliegue
    // en una perdida de funcion en vez de un ahorro de ancho.
    const fixture = crear();
    expect(fixture.nativeElement.querySelector('.lateral__plan')).not.toBeNull();

    plegar(fixture);

    const plan = fixture.nativeElement.querySelector('.lateral__plan-riel') as HTMLAnchorElement;
    expect(fixture.nativeElement.querySelector('.lateral__plan')).toBeNull();
    expect(plan.getAttribute('title')).toContain('Plan Intermedio');
    expect(plan.textContent).toContain('Activa');
  });

  it('debe ensenar los rotulos completos cuando esta expandida', () => {
    const fixture = crear();

    expect(fixture.nativeElement.textContent).toContain('Zona Ejercicios');
    expect(fixture.nativeElement.querySelector('.lateral--riel')).toBeNull();
    // Sin `title`: el rotulo ya se lee, y un globo repitiendo lo que esta escrito estorba.
    expect(enlaces(fixture)[0].getAttribute('title')).toBeNull();
  });
});
