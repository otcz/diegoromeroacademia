import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Dato } from './dato';

describe('Dato', () => {
  async function crear(valor: string, rotulo: string) {
    const fixture = TestBed.createComponent(Dato);
    fixture.componentRef.setInput('valor', valor);
    fixture.componentRef.setInput('rotulo', rotulo);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe mostrar la cifra y su rotulo', async () => {
    const fixture = await crear('26.000', 'Suscriptores');

    expect(fixture.nativeElement.querySelector('.adr-dato__valor').textContent).toContain('26.000');
    expect(fixture.nativeElement.querySelector('.adr-dato__rotulo').textContent).toContain(
      'Suscriptores',
    );
  });

  it('debe transportar el valor ya formateado, sin tocarlo', async () => {
    const fixture = await crear('4 niveles', 'Del cero al escenario');

    expect(fixture.nativeElement.querySelector('.adr-dato__valor').textContent.trim()).toBe(
      '4 niveles',
    );
  });
});
