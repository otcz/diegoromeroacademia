import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Etiqueta } from './etiqueta';

describe('Etiqueta', () => {
  async function crear(tinte?: string) {
    const fixture = TestBed.createComponent(Etiqueta);
    if (tinte) {
      fixture.componentRef.setInput('tinte', tinte);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('span') as HTMLSpanElement;
  }

  it('debe usar el tinte neutro cuando no se indica ninguno', async () => {
    expect((await crear()).className).toContain('adr-etiqueta--neutro');
  });

  it('debe aplicar el tinte verde, reservado a progreso y aprobacion', async () => {
    expect((await crear('verde')).className).toContain('adr-etiqueta--verde');
  });

  it('debe aplicar el tinte mango, reservado a Nuevo y Recomendado', async () => {
    expect((await crear('mango')).className).toContain('adr-etiqueta--mango');
  });

  it('debe aplicar el tinte azul', async () => {
    expect((await crear('azul')).className).toContain('adr-etiqueta--azul');
  });
});
