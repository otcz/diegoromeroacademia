import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Dificultad } from './dificultad';

describe('Dificultad', () => {
  async function crear(nivel: number) {
    const fixture = TestBed.createComponent(Dificultad);
    fixture.componentRef.setInput('nivel', nivel);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  function contarLlenas(fixture: { nativeElement: HTMLElement }) {
    return fixture.nativeElement.querySelectorAll('.adr-dificultad__estrella--llena').length;
  }

  it('debe dibujar siempre cinco estrellas', async () => {
    const fixture = await crear(3);

    expect(fixture.nativeElement.querySelectorAll('adr-icono').length).toBe(5);
  });

  it('debe rellenar tantas estrellas como indique el nivel', async () => {
    expect(contarLlenas(await crear(3))).toBe(3);
    expect(contarLlenas(await crear(1))).toBe(1);
    expect(contarLlenas(await crear(5))).toBe(5);
  });

  it('debe recortar un nivel fuera de rango en vez de dibujar de mas', async () => {
    expect(contarLlenas(await crear(9))).toBe(5);
    expect(contarLlenas(await crear(0))).toBe(1);
    expect(contarLlenas(await crear(-4))).toBe(1);
  });

  it('debe redondear un nivel decimal', async () => {
    expect(contarLlenas(await crear(3.6))).toBe(4);
  });

  it('debe tratar un valor no numerico como el minimo', async () => {
    expect(contarLlenas(await crear(Number.NaN))).toBe(1);
  });

  it('debe anunciar la dificultad en texto, porque el color solo no comunica', async () => {
    const fixture = await crear(3);

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.adr-dificultad');
    expect(contenedor.getAttribute('aria-label')).toBe('Dificultad 3 de 5');
  });
});
