import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TarjetaPlan } from './tarjeta-plan';

describe('TarjetaPlan', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TarjetaPlan);
    fixture.componentRef.setInput('nombre', 'Anual');
    fixture.componentRef.setInput('precio', '$349.900');
    fixture.componentRef.setInput('descripcion', 'Ahorras más de dos meses.');
    fixture.componentRef.setInput('textoAccion', 'Elegir anual');
    fixture.componentRef.setInput('enlace', '/registro');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe mostrar precio y periodicidad juntos', async () => {
    const fixture = await crear({ periodicidad: '/año' });

    const precio: string = fixture.nativeElement.querySelector('.adr-plan__precio').textContent;
    expect(precio).toContain('$349.900');
    expect(precio).toContain('/año');
  });

  it('no debe destacarse por defecto', async () => {
    const fixture = await crear();

    const plan: HTMLElement = fixture.nativeElement.querySelector('.adr-plan');
    expect(plan.className).not.toContain('adr-plan--recomendado');
    expect(fixture.nativeElement.querySelector('adr-etiqueta')).toBeNull();
  });

  it('debe destacar el plan recomendado con distintivo y acción primaria', async () => {
    const fixture = await crear({ recomendado: true });

    expect(fixture.nativeElement.querySelector('.adr-plan').className).toContain(
      'adr-plan--recomendado',
    );
    expect(fixture.nativeElement.querySelector('adr-etiqueta').textContent).toContain(
      'Recomendado',
    );
    expect(fixture.nativeElement.querySelector('.adr-boton--primario')).not.toBeNull();
  });

  it('debe usar acción secundaria cuando no es el plan promovido', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('.adr-boton--secundario')).not.toBeNull();
  });

  it('debe permitir cambiar el texto del distintivo', async () => {
    const fixture = await crear({ recomendado: true, textoDistintivo: 'Más elegido' });

    expect(fixture.nativeElement.querySelector('adr-etiqueta').textContent).toContain(
      'Más elegido',
    );
  });
});
