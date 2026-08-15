import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { EstadoEstacion, ItemNivel } from './item-nivel';

describe('ItemNivel', () => {
  async function crear(estado: EstadoEstacion, entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ItemNivel);
    fixture.componentRef.setInput('estado', estado);
    fixture.componentRef.setInput('numero', 1);
    fixture.componentRef.setInput('titulo', 'Nivel 1');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe distinguir los cuatro estados con FORMA, no solo con color', async () => {
    // Un candado y un check se distinguen sin ver el color; dos circulos que solo
    // difieren en tinte, no.
    const bloqueado = await crear('bloqueado');
    expect(bloqueado.nativeElement.querySelector('adr-icono')).not.toBeNull();

    const completado = await crear('completado');
    expect(completado.nativeElement.querySelector('adr-icono')).not.toBeNull();

    const meta = await crear('meta');
    expect(meta.nativeElement.querySelector('adr-icono')).not.toBeNull();

    // El actual muestra el numeral: es la unica parada que el alumno puede abrir.
    const actual = await crear('actual');
    expect(actual.nativeElement.querySelector('adr-icono')).toBeNull();
    expect(actual.nativeElement.querySelector('.adr-nivel__numero').textContent).toContain('1');
  });

  it('debe acompaniar cada estado de un texto breve, no solo de un icono', async () => {
    // De una palabra: tres lineas contra una desalineaban las cinco tarjetas de la ruta,
    // y ademas repetian lo que la nota bajo la seccion ya dice una vez.
    expect((await crear('bloqueado')).nativeElement.textContent).toContain('Bloqueado');
    expect((await crear('actual')).nativeElement.textContent).toContain('Disponible');
    expect((await crear('completado')).nativeElement.textContent).toContain('Aprobado');
    expect((await crear('meta')).nativeElement.textContent).toContain('Certificado');
  });

  it('debe aplicar la clase del estado para que el estilo lo distinga', async () => {
    const fixture = await crear('bloqueado');

    expect(fixture.nativeElement.querySelector('.adr-nivel').className).toContain(
      'adr-nivel--bloqueado',
    );
  });

  it('debe mostrar el resumen solo cuando existe y no esta en modo compacto', async () => {
    const sinResumen = await crear('actual');
    expect(sinResumen.nativeElement.querySelector('.adr-nivel__resumen')).toBeNull();

    const conResumen = await crear('actual', { resumen: 'Primeros fuelles y postura.' });
    expect(conResumen.nativeElement.querySelector('.adr-nivel__resumen').textContent).toContain(
      'Primeros fuelles',
    );

    const compacta = await crear('actual', { resumen: 'Primeros fuelles.', compacta: true });
    expect(compacta.nativeElement.querySelector('.adr-nivel__resumen')).toBeNull();
  });

  it('debe usar el mismo texto breve en compacto y en completo', async () => {
    const completa = await crear('bloqueado');
    const compacta = await crear('bloqueado', { compacta: true });

    const leer = (f: typeof completa) =>
      f.nativeElement.querySelector('.adr-nivel__estado').textContent.trim();

    expect(leer(completa)).toBe('Bloqueado');
    expect(leer(compacta)).toBe('Bloqueado');
  });

  it('debe marcar la variante sobre oscuro, que cambia todos los colores de texto', async () => {
    const fixture = await crear('actual', { sobreOscuro: true });

    expect(fixture.nativeElement.querySelector('.adr-nivel').className).toContain(
      'adr-nivel--sobre-oscuro',
    );
  });
});
