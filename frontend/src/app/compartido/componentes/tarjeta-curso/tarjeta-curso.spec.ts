import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TarjetaCurso } from './tarjeta-curso';

describe('TarjetaCurso', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TarjetaCurso);
    fixture.componentRef.setInput('titulo', 'La gota fría — paso a paso');
    fixture.componentRef.setInput('kicker', 'Tutorial suelto');
    fixture.componentRef.setInput('descripcion', 'El clásico de Emiliano Zuleta.');
    fixture.componentRef.setInput('textoAccion', 'Comprar');
    fixture.componentRef.setInput('enlace', '/registro');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe pasar la portada por el marco, que degrada sin foto', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('adr-marco-imagen')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.adr-marco__marcador')).not.toBeNull();
  });

  it('debe aplicar velo inferior para que la etiqueta contraste sobre cualquier foto', async () => {
    const fixture = await crear({ etiqueta: 'Nuevo' });

    expect(fixture.nativeElement.querySelector('.adr-marco__velo--inferior')).not.toBeNull();
  });

  it('debe dibujar la etiqueta solo cuando se indica', async () => {
    const sin = await crear();
    expect(sin.nativeElement.querySelector('adr-etiqueta')).toBeNull();

    const con = await crear({ etiqueta: 'Nuevo' });
    expect(con.nativeElement.querySelector('adr-etiqueta').textContent).toContain('Nuevo');
  });

  it('debe mostrar el precio junto a una acción secundaria cuando el curso se vende suelto', async () => {
    const fixture = await crear({ precio: '$34.900' });

    expect(fixture.nativeElement.querySelector('.adr-curso__precio').textContent).toContain(
      '$34.900',
    );
    expect(fixture.nativeElement.querySelector('.adr-boton--secundario')).not.toBeNull();
  });

  it('debe dar todo el ancho a la acción cuando va incluido en el plan', async () => {
    const fixture = await crear({ precio: null, textoAccion: 'Empezar con el plan' });

    expect(fixture.nativeElement.querySelector('.adr-curso__precio')).toBeNull();
    const boton: HTMLElement = fixture.nativeElement.querySelector('.adr-boton');
    expect(boton.className).toContain('adr-boton--primario');
    expect(boton.className).toContain('adr-boton--ancho-completo');
  });

  it('debe mostrar la dificultad y los alumnos solo cuando existen', async () => {
    const sin = await crear();
    expect(sin.nativeElement.querySelector('adr-dificultad')).toBeNull();

    const con = await crear({ dificultad: 3, alumnos: 184 });
    expect(con.nativeElement.querySelector('adr-dificultad')).not.toBeNull();
    expect(con.nativeElement.querySelector('.adr-curso__meta').textContent).toContain('184');
  });
});
