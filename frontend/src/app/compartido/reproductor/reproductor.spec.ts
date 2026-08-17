import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PasoPisada } from '../../nucleo/modelos/aprendizaje';
import { BPM_MAXIMO, BPM_MINIMO } from '../../nucleo/servicios/practica-servicio';
import { Reproductor, SALTO_SEGUNDOS, VELOCIDADES } from './reproductor';

/**
 * El reproductor.
 *
 * <p>Todavia no reproduce video —falta elegir proveedor de streaming—, asi que lo que hay que
 * probar es lo que SI existe y no va a cambiar cuando lo haya: los controles, la sincronia
 * del simulador y la honestidad de la pantalla.
 */
describe('Reproductor', () => {
  const PISTA: readonly PasoPisada[] = [
    { segundo: 0, fila: 0, boton: 1, direccion: 'abriendo', bajo: 'Sol' },
    { segundo: 0.67, fila: 1, boton: 2, direccion: 'cerrando', bajo: 'Do' },
  ];

  /** Duracion redonda para que las cuentas de la prueba se lean solas. */
  const DURACION = 600;

  function crear(
    modo: 'clase' | 'tutorial' | 'ejercicio' = 'clase',
  ): ComponentFixture<Reproductor> {
    const fixture = TestBed.createComponent(Reproductor);
    fixture.componentRef.setInput('duracionSegundos', DURACION);
    fixture.componentRef.setInput('pisadas', PISTA);
    fixture.componentRef.setInput('modo', modo);
    fixture.detectChanges();
    return fixture;
  }

  /** Acceso al interior. Los miembros son `protected` a proposito: la plantilla los usa. */
  function interno(fixture: ComponentFixture<Reproductor>) {
    return fixture.componentInstance as unknown as {
      tiempo(): number;
      playing(): boolean;
      simulador(): boolean;
      completa(): boolean;
      bpm(): number;
      velocidad(): number;
      rotuloRitmo(): string;
      avanceEntero(): number;
      tiempoSimulador(): number;
      alternarReproduccion(): void;
      alternarSimulador(): void;
      alternarPantallaCompleta(): void;
      siguienteVelocidad(): void;
      retroceder(): void;
      avanzar(): void;
      subirBpm(): void;
      bajarBpm(): void;
    };
  }

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('debe decir que el video todavia no esta conectado', () => {
    // Un reproductor que parece funcionar y no reproduce es lo que el propietario descubre
    // delante de un alumno. Mientras no haya video, se dice.
    const fixture = crear();

    expect(fixture.nativeElement.textContent).toContain('el vídeo aún no está conectado');
  });

  it('debe llevar la marca de agua identificable', () => {
    // Mitigacion del riesgo de filtracion que registra docs/00 §7.
    const fixture = crear();

    expect(fixture.nativeElement.querySelector('.repro__marca').textContent).toContain(
      'Estudio Académico DR',
    );
  });

  it('debe pausar y reanudar', () => {
    const fixture = crear();
    const r = interno(fixture);

    expect(r.playing()).toBe(true);
    r.alternarReproduccion();

    expect(r.playing()).toBe(false);
  });

  it('debe avanzar el reloj solo mientras reproduce', () => {
    const fixture = crear();
    const r = interno(fixture);

    vi.advanceTimersByTime(1_600);
    const conMarcha = r.tiempo();
    expect(conMarcha).toBeGreaterThan(0);

    r.alternarReproduccion();
    vi.advanceTimersByTime(1_600);

    expect(r.tiempo()).toBe(conMarcha);
  });

  it('debe correr mas rapido al subir la velocidad', () => {
    const fixture = crear();
    const r = interno(fixture);

    vi.advanceTimersByTime(1_600);
    const aVelocidadNormal = r.tiempo();

    r.alternarReproduccion();
    // De 1x a 1,25x.
    r.siguienteVelocidad();
    r.alternarReproduccion();
    const antes = r.tiempo();
    vi.advanceTimersByTime(1_600);

    expect(r.tiempo() - antes).toBeGreaterThan(aVelocidadNormal * 0.9);
  });

  it('debe rotar por las seis velocidades y volver al principio', () => {
    const fixture = crear();
    const r = interno(fixture);
    const recorridas: number[] = [r.velocidad()];

    for (let i = 1; i < VELOCIDADES.length; i++) {
      r.siguienteVelocidad();
      recorridas.push(r.velocidad());
    }

    expect(new Set(recorridas).size).toBe(VELOCIDADES.length);

    r.siguienteVelocidad();
    expect(r.velocidad()).toBe(recorridas[0]);
  });

  it('debe saltar quince segundos y no salirse del video', () => {
    const fixture = crear();
    const r = interno(fixture);
    r.alternarReproduccion();

    r.avanzar();
    expect(r.tiempo()).toBeCloseTo(SALTO_SEGUNDOS, 0);

    // Retroceder desde el principio no puede dar un tiempo negativo.
    r.retroceder();
    r.retroceder();
    expect(r.tiempo()).toBe(0);
  });

  it('debe poder saltar a un capitulo desde fuera', () => {
    // Es lo unico que la pantalla de clase le pide al reproductor.
    const fixture = crear();
    fixture.componentInstance.irA(250);

    expect(interno(fixture).tiempo()).toBe(250);
  });

  it('debe recortar un salto que se pase de la duracion', () => {
    const fixture = crear();
    fixture.componentInstance.irA(DURACION * 5);

    expect(interno(fixture).tiempo()).toBe(DURACION);
  });

  it('debe mostrar y ocultar el simulador', () => {
    const fixture = crear();
    const r = interno(fixture);

    expect(fixture.nativeElement.querySelector('adr-simulador-pisadas')).not.toBeNull();

    r.alternarSimulador();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('adr-simulador-pisadas')).toBeNull();
  });

  it('no debe dibujar el simulador en una leccion sin pista de digitacion', () => {
    // Un panel vacio anunciando «ACORDEÓN VALLENATO» sin nada encendido parece roto.
    const fixture = TestBed.createComponent(Reproductor);
    fixture.componentRef.setInput('duracionSegundos', DURACION);
    fixture.componentRef.setInput('pisadas', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('adr-simulador-pisadas')).toBeNull();
  });

  it('debe entrar y salir de pantalla completa', () => {
    const fixture = crear();
    const r = interno(fixture);

    r.alternarPantallaCompleta();
    fixture.detectChanges();

    expect(r.completa()).toBe(true);
    expect(fixture.nativeElement.querySelector('.repro--completa')).not.toBeNull();
  });

  it('debe ensenar el control de BPM solo en un ejercicio', () => {
    expect(crear('clase').nativeElement.querySelector('.repro__bpm')).toBeNull();
    expect(crear('ejercicio').nativeElement.querySelector('.repro__bpm')).not.toBeNull();
  });

  it('debe mover el BPM de cinco en cinco y respetar los topes', () => {
    const fixture = crear('ejercicio');
    const r = interno(fixture);

    expect(r.bpm()).toBe(90);
    r.subirBpm();
    expect(r.bpm()).toBe(95);
    r.bajarBpm();
    expect(r.bpm()).toBe(90);

    for (let i = 0; i < 40; i++) {
      r.subirBpm();
    }
    expect(r.bpm()).toBe(BPM_MAXIMO);

    for (let i = 0; i < 60; i++) {
      r.bajarBpm();
    }
    expect(r.bpm()).toBe(BPM_MINIMO);
  });

  it('debe escalar la pista con el BPM en un ejercicio', () => {
    // Es la diferencia de fondo entre practicar y ver una clase: aqui manda el metronomo.
    const fixture = crear('ejercicio');
    const r = interno(fixture);
    fixture.componentInstance.irA(10);

    const aNoventa = r.tiempoSimulador();
    for (let i = 0; i < 18; i++) {
      r.subirBpm();
    }

    expect(r.bpm()).toBe(BPM_MAXIMO);
    expect(r.tiempoSimulador()).toBeCloseTo(aNoventa * 2, 5);
  });

  it('debe rotular el ritmo con la velocidad en clase y con el BPM en un ejercicio', () => {
    expect(interno(crear('clase')).rotuloRitmo()).toBe('1x');
    expect(interno(crear('ejercicio')).rotuloRitmo()).toBe('90 BPM');
  });

  it('debe redondear el avance que anuncia a los lectores de pantalla', () => {
    // «41,8372 por ciento» no lo dice nadie.
    const fixture = crear();
    fixture.componentInstance.irA(DURACION / 3);

    expect(interno(fixture).avanceEntero()).toBe(33);
  });

  it('debe parar el reloj al destruirse', () => {
    // Sin esto, navegar entre cinco lecciones deja cinco relojes escribiendo en signals de
    // componentes que ya no existen.
    const fixture = crear();
    const r = interno(fixture);
    vi.advanceTimersByTime(320);
    const alSalir = r.tiempo();

    fixture.destroy();
    vi.advanceTimersByTime(3_200);

    expect(r.tiempo()).toBe(alSalir);
  });
});
