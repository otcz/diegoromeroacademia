import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BarraProgreso } from './barra-progreso';

describe('BarraProgreso', () => {
  async function crear(entradas: Record<string, unknown>) {
    const fixture = TestBed.createComponent(BarraProgreso);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe anunciar el progreso a los lectores de pantalla', async () => {
    const fixture = await crear({ valor: 40 });

    const barra: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(barra.getAttribute('aria-valuenow')).toBe('40');
    expect(barra.getAttribute('aria-valuemin')).toBe('0');
    expect(barra.getAttribute('aria-valuemax')).toBe('100');
  });

  it('debe recortar un valor por encima de cien en vez de dibujar una barra rota', async () => {
    const fixture = await crear({ valor: 180 });

    expect(
      fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),
    ).toBe('100');
  });

  it('debe recortar un valor negativo a cero', async () => {
    const fixture = await crear({ valor: -20 });

    expect(
      fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),
    ).toBe('0');
  });

  it('debe tratar un valor no numerico como cero, sin romper la pantalla', async () => {
    const fixture = await crear({ valor: Number.NaN });

    expect(
      fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),
    ).toBe('0');
  });

  it('debe redondear los decimales del calculo de progreso', async () => {
    const fixture = await crear({ valor: 33.6 });

    expect(
      fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),
    ).toBe('34');
  });

  it('debe ocultar el texto salvo que se pida', async () => {
    const sinTexto = await crear({ valor: 50 });
    expect(sinTexto.nativeElement.querySelector('.adr-barra__texto')).toBeNull();

    const conTexto = await crear({ valor: 50, mostrarTexto: true });
    expect(conTexto.nativeElement.querySelector('.adr-barra__texto').textContent).toContain('50%');
  });
});
