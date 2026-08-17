import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PasoPisada } from '../../nucleo/modelos/aprendizaje';
import {
  BOTONES_POR_COLUMNA_BAJO,
  BOTONES_POR_FILA,
  COLUMNAS_BAJO,
  PASOS_POR_SEGUNDO,
  SimuladorPisadas,
} from './simulador-pisadas';

/**
 * El simulador de pisadas: el componente que distingue a la academia.
 *
 * <p>Lo que se prueba no es el aspecto sino el MODELO y la SINCRONIA. Un diagrama bonito con
 * tres filas de diez es otro acordeon, y el alumno que mire su Corona III no encontrara el
 * boton que le senalan.
 */
describe('SimuladorPisadas', () => {
  const PISTA: readonly PasoPisada[] = [
    { segundo: 0, fila: 1, boton: 5, direccion: 'abriendo', bajo: 'Sol' },
    { segundo: 0.67, fila: 0, boton: 3, direccion: 'cerrando', bajo: 'Do' },
    { segundo: 1.33, fila: 2, boton: 9, direccion: 'abriendo', bajo: 'Re' },
  ];

  function crear(pista: readonly PasoPisada[] = PISTA, tiempo = 0) {
    const fixture = TestBed.createComponent(SimuladorPisadas);
    fixture.componentRef.setInput('pisadas', pista);
    fixture.componentRef.setInput('tiempo', tiempo);
    fixture.detectChanges();
    return fixture;
  }

  it('debe modelar el acordeon vallenato de 31 botones', () => {
    // 10 + 11 + 10 pitos y 12 bajos: 43 circulos, 31 de ellos pitos. No son numeros
    // redondeados, son el instrumento.
    expect(BOTONES_POR_FILA).toEqual([10, 11, 10]);
    expect(BOTONES_POR_FILA.reduce((a, b) => a + b, 0)).toBe(31);
    expect(BOTONES_POR_COLUMNA_BAJO * COLUMNAS_BAJO).toBe(12);
  });

  it('debe dibujar exactamente 43 teclas', () => {
    const fixture = crear();

    const teclas = fixture.nativeElement.querySelectorAll('.simulador__tecla');
    const bajos = fixture.nativeElement.querySelectorAll('.simulador__tecla--bajo');

    expect(teclas).toHaveLength(43);
    expect(bajos).toHaveLength(12);
  });

  it('debe encender una sola tecla de pito y un solo bajo a la vez', () => {
    const fixture = crear();

    const encendidas = fixture.nativeElement.querySelectorAll('.simulador__tecla--activa');

    // Una de pitos y una de bajos. Dos pitos encendidos serian dos notas.
    expect(encendidas).toHaveLength(2);
  });

  it('debe avanzar con el tiempo a un paso y medio por segundo', () => {
    const fixture = crear(PISTA, 0);
    const lectura = () =>
      fixture.nativeElement.querySelector('.simulador__paso').textContent.trim();

    expect(lectura()).toBe('Fila 2 · botón 6');

    // A 1,5 pasos por segundo, el segundo paso entra pasado 1/1,5 de segundo.
    fixture.componentRef.setInput('tiempo', 1 / PASOS_POR_SEGUNDO);
    fixture.detectChanges();

    expect(lectura()).toBe('Fila 1 · botón 4');
  });

  it('debe numerar filas y botones desde 1, como el alumno', () => {
    // El modelo empieza en 0, pero nadie llama «fila 0» a la primera fila de su acordeon.
    const fixture = crear([PISTA[0]]);

    expect(fixture.nativeElement.querySelector('.simulador__paso').textContent).toContain(
      'Fila 2 · botón 6',
    );
  });

  it('debe repetir la pista en bucle cuando el video dura mas que ella', () => {
    const fixture = crear(PISTA, 0);
    const primera = fixture.nativeElement.querySelector('.simulador__paso').textContent;

    // Tres pasos de pista: al cuarto vuelve al primero.
    fixture.componentRef.setInput('tiempo', 3 / PASOS_POR_SEGUNDO);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.simulador__paso').textContent).toBe(primera);
  });

  it('debe decir SIEMPRE la direccion del fuelle', () => {
    // El mismo boton suena distinto abriendo que cerrando: sin esa palabra falta la mitad
    // de la informacion y el alumno aprende la digitacion equivocada.
    const fixture = crear([PISTA[1]]);

    const detalle = fixture.nativeElement.querySelector('.simulador__detalle').textContent;

    expect(detalle).toContain('cerrando');
    expect(detalle).toContain('Bajo Do');
  });

  it('debe anunciar la lectura textual a los lectores de pantalla', () => {
    // El diagrama es `aria-hidden`: 43 circulos sin texto no dicen nada. La informacion
    // accesible es esta, y tiene que anunciarse al cambiar de paso.
    const fixture = crear();

    const cuerpo = fixture.nativeElement.querySelector('.simulador__cuerpo');
    const lectura = fixture.nativeElement.querySelector('.simulador__lectura');

    expect(cuerpo.getAttribute('aria-hidden')).toBe('true');
    expect(lectura.getAttribute('aria-live')).toBe('polite');
  });

  it('debe aguantar una leccion sin pista de digitacion', () => {
    // Hoy la mayoria no la tiene: el editor de secuencias es alcance de la fase 3.
    const fixture = crear([]);

    expect(fixture.nativeElement.querySelector('.simulador__paso').textContent.trim()).toBe(
      'Sin pista de digitación',
    );
    expect(fixture.nativeElement.querySelector('.simulador__tecla--activa')).toBeNull();
  });

  it('debe mostrar el ritmo que le pasen, sea velocidad o BPM', () => {
    const fixture = crear();
    fixture.componentRef.setInput('rotuloRitmo', '120 BPM');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.simulador__detalle').textContent).toContain(
      '120 BPM',
    );
  });

  it('debe llevar la disposicion en una clase del anfitrion', () => {
    // La usa el reproductor para colocarlo: panel flotante a un lado, o franja abajo.
    const fixture = crear();
    fixture.componentRef.setInput('disposicion', 'vertical');
    fixture.detectChanges();

    expect(fixture.nativeElement.className).toContain('simulador--vertical');
  });

  it('debe avisar cuando se pide ocultarlo', () => {
    const fixture = crear();
    let cerrado = false;
    fixture.componentInstance.cerrado.subscribe(() => (cerrado = true));

    fixture.nativeElement.querySelector('.simulador__cerrar').click();

    expect(cerrado).toBe(true);
  });
});
