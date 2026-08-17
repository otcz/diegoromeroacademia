import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLAVE_PREFERENCIAS, CuentaServicio } from './cuenta-servicio';

describe('CuentaServicio', () => {
  function crear(): CuentaServicio {
    TestBed.configureTestingModule({});
    return TestBed.inject(CuentaServicio);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('debe armar el nombre completo en un solo sitio', () => {
    // Cinco pantallas lo enseñan; concatenarlo en cada una es como acaban discrepando.
    expect(crear().nombreCompleto()).toBe('Andrés Villa Restrepo');
  });

  it('debe alternar una notificacion y recordarla', () => {
    const cuenta = crear();
    const antes = cuenta.preferencias().notificaciones.clases;

    cuenta.alternarNotificacion('clases');

    expect(cuenta.preferencias().notificaciones.clases).toBe(!antes);
    expect(JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS) ?? '{}').notificaciones.clases).toBe(
      !antes,
    );
  });

  it('debe alternar una preferencia de reproduccion sin tocar las demas', () => {
    const cuenta = crear();
    const autoplayAntes = cuenta.preferencias().reproduccion.autoplay;

    cuenta.alternarReproduccion('simulador');

    expect(cuenta.preferencias().reproduccion.simulador).toBe(false);
    expect(cuenta.preferencias().reproduccion.autoplay).toBe(autoplayAntes);
  });

  it('debe recordar el idioma y el nivel elegidos', () => {
    const cuenta = crear();

    cuenta.establecerIdioma('Português');
    cuenta.establecerNivel('Avanzado');

    expect(cuenta.preferencias().idioma).toBe('Português');
    expect(cuenta.perfil().nivel).toBe('Avanzado');
  });

  it('debe sobrevivir a una recarga', () => {
    crear().alternarNotificacion('promociones');

    TestBed.resetTestingModule();

    expect(crear().preferencias().notificaciones.promociones).toBe(true);
  });

  it('debe MEZCLAR lo guardado con lo que trae por defecto', () => {
    // El caso que rompe sin mezcla: el dia que se anada una preferencia nueva, el objeto
    // guardado de todos los alumnos existentes no la tendra, y llegaria `undefined` a un
    // interruptor — que se dibuja apagado y ademas no es lo que el alumno eligio.
    localStorage.setItem(
      CLAVE_PREFERENCIAS,
      JSON.stringify({ notificaciones: { clases: false }, idioma: 'English' }),
    );

    const preferencias = crear().preferencias();

    expect(preferencias.notificaciones.clases).toBe(false);
    expect(preferencias.notificaciones.vivo).toBe(true);
    expect(preferencias.idioma).toBe('English');
    expect(preferencias.reproduccion.autoplay).toBe(true);
    expect(preferencias.zonaHoraria).toBe('Bogotá (GMT−5)');
  });

  it('debe caer en los valores por defecto si lo guardado esta corrupto', () => {
    localStorage.setItem(CLAVE_PREFERENCIAS, 'no-es-json');

    expect(crear().preferencias().idioma).toBe('Español');
  });
});
