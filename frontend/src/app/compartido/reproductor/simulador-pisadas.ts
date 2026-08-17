import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PasoPisada } from '../../nucleo/modelos/aprendizaje';
import { Icono } from '../componentes/icono/icono';

/**
 * Modelo del acordeon vallenato de 31 botones.
 *
 * <p>Tres filas de pitos a la izquierda —10, 11 y 10 botones— y doce bajos a la derecha en
 * dos columnas de seis. No son numeros redondeados: son el instrumento. Un diagrama con tres
 * filas de diez seria otro acordeon, y el alumno que mire su Corona III no encontrara el
 * boton que el simulador le senala.
 */
export const BOTONES_POR_FILA: readonly number[] = [10, 11, 10];
export const BOTONES_POR_COLUMNA_BAJO = 6;
export const COLUMNAS_BAJO = 2;

/**
 * A que boton de bajo corresponde cada nota.
 *
 * <p>Afinacion Sol/Do, la del vallenato. Los indices son posiciones en la rejilla de doce,
 * contando por columnas. Cuando el catalogo traiga la afinacion por ejercicio
 * (`Ejercicio.afinacion`), este mapa pasa a depender de ella.
 */
const POSICION_BAJO: Record<PasoPisada['bajo'], number> = { Sol: 2, Do: 6, Re: 9 };

/** Cuantos pasos por segundo avanza la pista a velocidad 1x. Del prototipo. */
export const PASOS_POR_SEGUNDO = 1.5;

/** Disposicion del panel. La elige el reproductor segun el sitio que tenga. */
export type DisposicionSimulador = 'vertical' | 'franja';

/**
 * Simulador de pisadas: el componente que distingue a esta academia.
 *
 * <p><b>Que hace.</b> Dado el segundo en que va el video y la pista de digitacion de la
 * leccion, enciende el boton que hay que pisar y el bajo que lo acompana, y lo dice tambien
 * en palabras: «Fila 2 · botón 5 — Bajo Sol · abriendo · 1x».
 *
 * <p><b>Por que el texto es obligatorio y no un extra.</b> Un diagrama de 43 circulos de
 * 13 px no lo lee un lector de pantalla, no se ve en un celular con el brillo bajo a plena
 * luz y no sirve para repetir en voz alta lo que hay que hacer. La lectura textual es la
 * version accesible del mismo dato, no un pie de foto.
 *
 * <p><b>La direccion del fuelle nunca se omite.</b> El mismo boton suena distinto abriendo
 * que cerrando: sin esa palabra, la mitad de la informacion falta y el alumno aprende la
 * digitacion equivocada.
 *
 * <p>Dos disposiciones, no dos componentes: vertical cuando hay sitio de sobra sobre el
 * video, y franja horizontal en todo lo demas — incluido movil. La eleccion la hace quien lo
 * usa, porque es quien conoce el hueco.
 */
@Component({
  selector: 'adr-simulador-pisadas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  templateUrl: './simulador-pisadas.html',
  styleUrl: './simulador-pisadas.scss',
  host: { '[class]': '"simulador--" + disposicion()' },
})
export class SimuladorPisadas {
  /** Pista de digitacion de la leccion. Vacia = no hay nada que mostrar. */
  readonly pisadas = input.required<readonly PasoPisada[]>();

  /** Segundo en que va el video, o el paso calculado desde el BPM en el ejercicio guiado. */
  readonly tiempo = input.required<number>();

  /** Multiplicador de velocidad del video. Solo se usa para el rotulo textual. */
  readonly velocidad = input(1);

  /** Rotulo del ritmo: «1x» en una clase, «90 BPM» en un ejercicio. */
  readonly rotuloRitmo = input('1x');

  readonly disposicion = input<DisposicionSimulador>('franja');

  /** Lo pulsa la «x» de la cabecera. Quien lo usa decide si se oculta. */
  readonly cerrado = output<void>();

  protected readonly filas = BOTONES_POR_FILA;
  protected readonly nombresFila = ['F1', 'F2', 'F3'];
  protected readonly nombresColumnaBajo = ['B1', 'B2'];

  /**
   * Paso vigente.
   *
   * <p>El indice se calcula por el tiempo y no por un contador propio: asi el simulador es
   * una funcion pura del segundo del video. Si llevara su propio contador, adelantar quince
   * segundos dejaria el diagrama desincronizado del video y no habria forma de recuperarlo
   * sin reiniciar.
   *
   * <p>El resto (`%`) hace que la pista se repita en bucle cuando el video dura mas que
   * ella, que es lo que ocurre hoy con las pistas de ejemplo.
   */
  protected readonly paso = computed<PasoPisada | null>(() => {
    const pista = this.pisadas();
    if (pista.length === 0) {
      return null;
    }
    const indice = Math.floor(this.tiempo() * PASOS_POR_SEGUNDO) % pista.length;
    return pista[indice];
  });

  /** Posicion del bajo encendido dentro de la rejilla de doce. −1 si no hay paso. */
  protected readonly bajoActivo = computed(() => {
    const paso = this.paso();
    return paso ? POSICION_BAJO[paso.bajo] : -1;
  });

  /**
   * Lectura textual del paso, la version accesible del diagrama.
   *
   * <p>Las filas y los botones se numeran desde 1 para el alumno aunque el modelo empiece en
   * 0: nadie llama «fila 0» a la primera fila de su acordeon.
   */
  protected readonly lectura = computed(() => {
    const paso = this.paso();
    return paso ? `Fila ${paso.fila + 1} · botón ${paso.boton + 1}` : 'Sin pista de digitación';
  });

  /** Los indices de una fila de pitos, para dibujarla. */
  protected botonesDe(fila: number): number[] {
    return Array.from({ length: BOTONES_POR_FILA[fila] }, (_, i) => i);
  }

  /** Los indices de una columna de bajos, en la numeracion continua de doce. */
  protected bajosDe(columna: number): number[] {
    return Array.from(
      { length: BOTONES_POR_COLUMNA_BAJO },
      (_, i) => columna * BOTONES_POR_COLUMNA_BAJO + i,
    );
  }

  protected estaActivo(fila: number, boton: number): boolean {
    const paso = this.paso();
    return paso !== null && paso.fila === fila && paso.boton === boton;
  }
}
