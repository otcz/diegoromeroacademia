import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { EstacionRuta, RutaNiveles } from './ruta-niveles';

const ESTACIONES: readonly EstacionRuta[] = [
  { numero: 1, titulo: 'Nivel 1', resumen: null, estado: 'actual' },
  { numero: 2, titulo: 'Nivel 2', resumen: null, estado: 'bloqueado' },
  { numero: 3, titulo: 'Nivel 3', resumen: null, estado: 'bloqueado' },
  { numero: 4, titulo: 'Nivel 4', resumen: null, estado: 'bloqueado' },
  { numero: 5, titulo: 'Certificado', resumen: null, estado: 'meta' },
];

describe('RutaNiveles', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RutaNiveles);
    fixture.componentRef.setInput('estaciones', ESTACIONES);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe dibujar una parada por estación, sin perder ninguna', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelectorAll('adr-item-nivel').length).toBe(5);
  });

  it('no debe perder estaciones al cambiar de orientación', async () => {
    // Se descartó el carrusel justamente por esto: en móvil escondería tres de cinco.
    for (const orientacion of ['auto', 'horizontal', 'vertical']) {
      const fixture = await crear({ orientacion });
      expect(fixture.nativeElement.querySelectorAll('adr-item-nivel').length).toBe(5);
    }
  });

  it('debe usarse como lista ordenada, para que se anuncie como camino de cinco pasos', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('ol')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(5);
  });

  it('debe aplicar la orientación pedida', async () => {
    const horizontal = await crear({ orientacion: 'horizontal' });
    expect(horizontal.nativeElement.querySelector('ol').className).toContain(
      'adr-ruta--horizontal',
    );

    const vertical = await crear({ orientacion: 'vertical' });
    expect(vertical.nativeElement.querySelector('ol').className).toContain('adr-ruta--vertical');
  });

  it('debe forzar la vertical en modo compacto, aunque se pida otra orientación', async () => {
    const fixture = await crear({ compacta: true, orientacion: 'horizontal' });

    const lista: HTMLElement = fixture.nativeElement.querySelector('ol');
    expect(lista.className).toContain('adr-ruta--vertical');
    expect(lista.className).toContain('adr-ruta--compacta');
    expect(lista.className).not.toContain('adr-ruta--horizontal');
  });

  it('debe propagar el modo compacto y el fondo oscuro a cada parada', async () => {
    const fixture = await crear({ compacta: true, sobreOscuro: true });

    const paradas = fixture.nativeElement.querySelectorAll('.adr-nivel');
    expect(paradas.length).toBe(5);
    expect(paradas[0].className).toContain('adr-nivel--compacta');
    expect(paradas[0].className).toContain('adr-nivel--sobre-oscuro');
  });

  it('debe conservar el orden de las estaciones tal y como se le entregan', async () => {
    const fixture = await crear();

    const titulos = Array.from(fixture.nativeElement.querySelectorAll('.adr-nivel__titulo'), (n) =>
      (n as HTMLElement).textContent?.trim(),
    );
    expect(titulos).toEqual(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Certificado']);
  });
});
