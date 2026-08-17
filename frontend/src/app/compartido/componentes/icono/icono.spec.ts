import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Icono } from './icono';

describe('Icono', () => {
  async function crear(entradas: Record<string, unknown>) {
    const fixture = TestBed.createComponent(Icono);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe dibujar el svg con viewBox unico para que todos los iconos queden alineados', async () => {
    // La rejilla de Material Symbols. Un icono con otro viewBox se dibuja a otra escala
    // dentro del mismo hueco, y eso es exactamente lo que hace ver una fila desalineada.
    const fixture = await crear({ nombre: 'lock' });

    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 -960 960 960');
    expect(svg.getAttribute('fill')).toBe('currentColor');
  });

  it('debe usar 24px cuando no se indica tamanio', async () => {
    const fixture = await crear({ nombre: 'user' });

    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('debe aplicar el tamanio pedido', async () => {
    const fixture = await crear({ nombre: 'star', tamanio: 32 });

    expect(fixture.nativeElement.querySelector('svg').getAttribute('width')).toBe('32');
  });

  it('debe ocultarse a los lectores de pantalla cuando no lleva etiqueta', async () => {
    const fixture = await crear({ nombre: 'caret-right' });

    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBeNull();
  });

  it('debe anunciarse como imagen cuando lleva etiqueta', async () => {
    const fixture = await crear({ nombre: 'lock', etiqueta: 'Nivel bloqueado' });

    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Nivel bloqueado');
    expect(svg.getAttribute('aria-hidden')).toBeNull();
  });

  it('debe cambiar de contenido al cambiar de nombre', async () => {
    const fixture = await crear({ nombre: 'lock' });
    const conCandado = fixture.nativeElement.querySelector('svg').innerHTML;

    fixture.componentRef.setInput('nombre', 'user');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('svg').innerHTML).not.toBe(conCandado);
  });
});
