import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PanelCristal } from './panel-cristal';

describe('PanelCristal', () => {
  async function crear(variante?: string) {
    const fixture = TestBed.createComponent(PanelCristal);
    if (variante) {
      fixture.componentRef.setInput('variante', variante);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('.adr-cristal') as HTMLElement;
  }

  it('debe usar la variante oscura cuando no se indica otra', async () => {
    expect((await crear()).className).toContain('adr-cristal--oscuro');
  });

  it('debe aplicar la variante clara', async () => {
    expect((await crear('claro')).className).toContain('adr-cristal--claro');
  });

  it('debe llevar siempre la clase base, que es donde vive el respaldo sin desenfoque', async () => {
    const panel = await crear('claro');

    expect(panel.className).toContain('adr-cristal');
  });
});
