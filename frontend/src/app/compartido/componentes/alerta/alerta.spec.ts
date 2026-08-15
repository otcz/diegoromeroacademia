import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Alerta } from './alerta';

describe('Alerta', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Alerta);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('.adr-alerta') as HTMLElement;
  }

  it('debe usar el tono informativo cuando no se indica otro', async () => {
    expect((await crear()).className).toContain('adr-alerta--informacion');
  });

  it('debe aplicar el tono pedido', async () => {
    expect((await crear({ tono: 'exito' })).className).toContain('adr-alerta--exito');
    expect((await crear({ tono: 'error' })).className).toContain('adr-alerta--error');
  });

  it('debe llevar siempre icono, porque el color solo no comunica', async () => {
    expect((await crear({ tono: 'error' })).querySelector('adr-icono')).not.toBeNull();
  });

  it('debe anunciarse como alerta cuando es urgente y como estado cuando no', async () => {
    expect((await crear({ tono: 'error' })).getAttribute('role')).toBe('alert');
    expect((await crear({ tono: 'advertencia' })).getAttribute('role')).toBe('alert');
    expect((await crear({ tono: 'informacion' })).getAttribute('role')).toBe('status');
    expect((await crear({ tono: 'exito' })).getAttribute('role')).toBe('status');
  });

  it('debe mostrar el titulo solo cuando se indica', async () => {
    expect((await crear()).querySelector('.adr-alerta__titulo')).toBeNull();
    expect((await crear({ titulo: 'Revisa esto' })).querySelector('.adr-alerta__titulo')?.textContent)
      .toContain('Revisa esto');
  });
});
