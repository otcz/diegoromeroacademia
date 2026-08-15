import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Modal } from './modal';

describe('Modal', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('titulo', 'Cancelar suscripcion');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('no debe dibujar nada mientras esta cerrado', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('debe anunciarse como dialogo modal y quedar rotulado por su titulo', async () => {
    const fixture = await crear({ abierto: true });

    const dialogo: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    const titulo: HTMLElement = fixture.nativeElement.querySelector('.adr-modal__titulo');

    expect(dialogo.getAttribute('aria-modal')).toBe('true');
    expect(dialogo.getAttribute('aria-labelledby')).toBe(titulo.id);
    expect(titulo.textContent).toContain('Cancelar suscripcion');
  });

  it('debe mantener la anatomia de tres zonas que alinea todos los modales', async () => {
    const fixture = await crear({ abierto: true });

    expect(fixture.nativeElement.querySelector('.adr-modal__encabezado')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.adr-modal__cuerpo')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.adr-modal__pie')).not.toBeNull();
  });

  it('debe usar el ancho medio por defecto', async () => {
    const fixture = await crear({ abierto: true });

    expect(fixture.nativeElement.querySelector('.adr-modal__caja').className).toContain(
      'adr-modal__caja--md',
    );
  });

  it('debe aplicar el ancho pedido', async () => {
    const fixture = await crear({ abierto: true, ancho: 'lg' });

    expect(fixture.nativeElement.querySelector('.adr-modal__caja').className).toContain(
      'adr-modal__caja--lg',
    );
  });

  it('debe cerrarse con el boton de cerrar y avisar a quien lo abrio', async () => {
    const fixture = await crear({ abierto: true });
    let cierres = 0;
    fixture.componentInstance.cerrado.subscribe(() => cierres++);

    fixture.nativeElement.querySelector('.adr-modal__cerrar').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.abierto()).toBe(false);
    expect(cierres).toBe(1);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('debe cerrarse con la tecla Escape', async () => {
    const fixture = await crear({ abierto: true });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.abierto()).toBe(false);
  });

  it('no debe emitir cierre si Escape se pulsa con el modal ya cerrado', async () => {
    const fixture = await crear();
    let cierres = 0;
    fixture.componentInstance.cerrado.subscribe(() => cierres++);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cierres).toBe(0);
  });
});
