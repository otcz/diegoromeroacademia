import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MarcoImagen } from './marco-imagen';

describe('MarcoImagen', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MarcoImagen);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe pintar el marcador del sistema cuando todavia no hay foto', async () => {
    const fixture = await crear({ fuente: null });

    expect(fixture.nativeElement.querySelector('.adr-marco__marcador')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('debe pintar la imagen en cuanto la ruta existe', async () => {
    const fixture = await crear({ fuente: '/imagenes/heroe.webp' });

    const imagen: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(imagen.getAttribute('src')).toBe('/imagenes/heroe.webp');
    expect(fixture.nativeElement.querySelector('.adr-marco__marcador')).toBeNull();
  });

  it('debe reservar el espacio con la relacion de aspecto, para que la pagina no salte', async () => {
    const fixture = await crear({ relacion: '4/5' });

    const marco: HTMLElement = fixture.nativeElement.querySelector('.adr-marco');
    expect(marco.style.aspectRatio).toBe('4/5');
  });

  it('debe usar 16/9 cuando no se indica relacion', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('.adr-marco').style.aspectRatio).toBe('16/9');
  });

  it('no debe dibujar velo salvo que se pida', async () => {
    const sinVelo = await crear();
    expect(sinVelo.nativeElement.querySelector('.adr-marco__velo')).toBeNull();

    const conVelo = await crear({ velo: 'lateral' });
    expect(conVelo.nativeElement.querySelector('.adr-marco__velo--lateral')).not.toBeNull();
  });

  it('debe aplicar el velo inferior cuando se pide', async () => {
    const fixture = await crear({ velo: 'inferior' });

    expect(fixture.nativeElement.querySelector('.adr-marco__velo--inferior')).not.toBeNull();
  });

  it('debe cargar con prioridad solo la imagen del primer pliegue', async () => {
    const normal = await crear({ fuente: '/a.webp' });
    const img1: HTMLImageElement = normal.nativeElement.querySelector('img');
    expect(img1.getAttribute('loading')).toBe('lazy');
    expect(img1.getAttribute('fetchpriority')).toBeNull();

    const heroe = await crear({ fuente: '/a.webp', prioritaria: true });
    const img2: HTMLImageElement = heroe.nativeElement.querySelector('img');
    expect(img2.getAttribute('loading')).toBe('eager');
    expect(img2.getAttribute('fetchpriority')).toBe('high');
  });

  it('debe aplicar la variante y el tono de marcador pedidos', async () => {
    const fixture = await crear({ variante: 'ventana', tono: 'oscuro' });

    const marco: HTMLElement = fixture.nativeElement.querySelector('.adr-marco');
    expect(marco.className).toContain('adr-marco--ventana');
    expect(marco.className).toContain('adr-marco--marcador-oscuro');
  });

  it('debe dejar el texto alternativo vacio por defecto, porque casi siempre es decorativo', async () => {
    const fixture = await crear({ fuente: '/a.webp' });

    expect(fixture.nativeElement.querySelector('img').getAttribute('alt')).toBe('');
  });

  it('debe describir la imagen cuando aporta informacion', async () => {
    const fixture = await crear({ fuente: '/a.webp', alternativo: 'Diego tocando el acordeón' });

    expect(fixture.nativeElement.querySelector('img').getAttribute('alt')).toBe(
      'Diego tocando el acordeón',
    );
  });
});
