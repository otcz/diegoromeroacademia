import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { PasoPisada } from '../../nucleo/modelos/aprendizaje';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';
import { BPM_MAXIMO, BPM_MINIMO, BPM_PASO } from '../../nucleo/servicios/practica-servicio';
import { Icono } from '../componentes/icono/icono';
import { DuracionPipe } from '../formato/pesos-pipe';
import { DisposicionSimulador, SimuladorPisadas } from './simulador-pisadas';

/** Velocidades del handoff. Fijas: media velocidad para estudiar, doble para repasar. */
export const VELOCIDADES: readonly number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

/** Cuantos segundos salta el retroceso y el avance. */
export const SALTO_SEGUNDOS = 15;

/** Cada cuanto avanza el reloj interno, en milisegundos. */
const INTERVALO_MS = 160;

/**
 * Modo del reproductor.
 *
 * <p>Cambia los controles, no el aspecto: en un ejercicio manda el metronomo y no la
 * velocidad del video, asi que salen el control de BPM y el boton de repetir la seccion en
 * lugar de los saltos de quince segundos.
 */
export type ModoReproductor = 'clase' | 'tutorial' | 'ejercicio';

/**
 * Reproductor de clase, tutorial y ejercicio guiado.
 *
 * <p><b>Todavia no reproduce video.</b> No hay proveedor de streaming elegido —decision
 * pendiente 3 de `docs/00 §5`— ni URL firmada que pedir, asi que lo que se ve es el poster
 * de la leccion con una linea de tiempo que corre de verdad. Sirve para lo que hace falta
 * hoy: probar la sincronia del simulador, los controles y la disposicion.
 *
 * <p>Se dice en la interfaz con un rotulo, en vez de disimularlo. Un reproductor que parece
 * funcionar y no reproduce es la clase de cosa que el propietario descubre delante de un
 * alumno.
 *
 * <p>CONDICION DE SALIDA: el `<img>` del poster pasa a `<video>` con HLS y URL firmada, y
 * `tiempo` se alimenta del evento `timeupdate` en vez del reloj interno. El resto —controles,
 * simulador, disposiciones— no cambia, y por eso el tiempo esta encapsulado aqui.
 *
 * <p>La altura NUNCA es fija: `aspect-ratio: 16/9` con un tope. Un alto en pixeles deja
 * franjas negras arriba y abajo en cuanto cambia el ancho, y en movil parte el video.
 */
@Component({
  selector: 'adr-reproductor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DuracionPipe, Icono, SimuladorPisadas],
  templateUrl: './reproductor.html',
  styleUrl: './reproductor.scss',
})
export class Reproductor {
  private readonly destruccion = inject(DestroyRef);
  private readonly cuenta = inject(CuentaServicio);

  readonly poster = input<string | null>(null);
  readonly duracionSegundos = input.required<number>();
  readonly pisadas = input<readonly PasoPisada[]>([]);
  readonly modo = input<ModoReproductor>('clase');

  /** Rotulo del kicker sobre el video: «TUTORIAL · PARTE 3», «EJERCICIO GUIADO». */
  readonly kicker = input('');

  private readonly reproduciendo = signal(true);
  private readonly segundo = signal(0);
  private readonly indiceVelocidad = signal(VELOCIDADES.indexOf(1));
  private readonly pantallaCompleta = signal(false);
  private readonly bpmActual = signal(90);

  /**
   * Visibilidad del simulador.
   *
   * <p>Arranca con lo que el alumno dejo puesto en Ajustes. Es la unica preferencia de
   * reproduccion que se nota de inmediato, y forzarla abierta en cada leccion a quien la
   * cerro convierte un ajuste en una sugerencia.
   */
  private readonly simuladorVisible = signal(this.cuenta.preferencias().reproduccion.simulador);

  protected readonly playing = this.reproduciendo.asReadonly();
  protected readonly tiempo = this.segundo.asReadonly();
  protected readonly completa = this.pantallaCompleta.asReadonly();
  protected readonly simulador = this.simuladorVisible.asReadonly();
  protected readonly bpm = this.bpmActual.asReadonly();

  protected readonly velocidad = computed(() => VELOCIDADES[this.indiceVelocidad()]);
  protected readonly rotuloVelocidad = computed(() => `${this.velocidad()}x`);
  protected readonly esEjercicio = computed(() => this.modo() === 'ejercicio');

  /** Rotulo del ritmo que muestra el simulador: la velocidad, o el BPM en un ejercicio. */
  protected readonly rotuloRitmo = computed(() =>
    this.esEjercicio() ? `${this.bpm()} BPM` : this.rotuloVelocidad(),
  );

  /** Porcentaje recorrido, para la barra. */
  protected readonly avance = computed(() =>
    this.duracionSegundos() > 0 ? (this.segundo() / this.duracionSegundos()) * 100 : 0,
  );

  /** El mismo porcentaje redondeado. Un lector de pantalla no anuncia «41,8372 por ciento». */
  protected readonly avanceEntero = computed(() => Math.round(this.avance()));

  /**
   * Tiempo que consume el simulador.
   *
   * <p>En una clase es el segundo del video. En un ejercicio es el segundo ESCALADO por el
   * BPM que eligio el alumno: a 180 la pista corre el doble que a 90. Ese es el sentido del
   * ejercicio guiado — el video acompana, pero quien manda el ritmo es el metronomo.
   */
  protected readonly tiempoSimulador = computed(() =>
    this.esEjercicio() ? (this.segundo() * this.bpm()) / 90 : this.segundo(),
  );

  /**
   * Disposicion del simulador.
   *
   * <p>Vertical solo cuando hay sitio de verdad: el handoff pide 1460 px de ancho y 760 de
   * alto. Por debajo, la franja horizontal. Se mide con `matchMedia` y no con una clase CSS
   * porque el componente necesita SABER cual es —el panel vertical va flotando a un lado del
   * video y la franja va debajo, y eso es estructura, no estilo.
   */
  protected readonly disposicionSimulador = signal<DisposicionSimulador>('franja');

  protected readonly BPM_MINIMO = BPM_MINIMO;
  protected readonly BPM_MAXIMO = BPM_MAXIMO;

  constructor() {
    this.arrancarReloj();
    this.observarEspacio();

    // El BPM parte del original del ejercicio. `effect` y no un valor inicial porque la
    // entrada llega despues de construir el componente.
    effect(() => {
      if (this.esEjercicio()) {
        this.bpmActual.set(90);
      }
    });
  }

  protected alternarReproduccion(): void {
    this.reproduciendo.update((v) => !v);
  }

  protected alternarSimulador(): void {
    this.simuladorVisible.update((v) => !v);
  }

  protected alternarPantallaCompleta(): void {
    this.pantallaCompleta.update((v) => !v);
  }

  /** Rota por la lista de velocidades. Una sola tecla en vez de un desplegable de seis. */
  protected siguienteVelocidad(): void {
    this.indiceVelocidad.update((i) => (i + 1) % VELOCIDADES.length);
  }

  protected retroceder(): void {
    this.segundo.update((t) => Math.max(0, t - SALTO_SEGUNDOS));
  }

  protected avanzar(): void {
    this.segundo.update((t) => Math.min(this.duracionSegundos(), t + SALTO_SEGUNDOS));
  }

  /** Salta a un capitulo. Lo llama la lista de capitulos del resumen. */
  irA(segundo: number): void {
    this.segundo.set(Math.min(Math.max(0, segundo), this.duracionSegundos()));
  }

  protected subirBpm(): void {
    this.bpmActual.update((b) => Math.min(BPM_MAXIMO, b + BPM_PASO));
  }

  protected bajarBpm(): void {
    this.bpmActual.update((b) => Math.max(BPM_MINIMO, b - BPM_PASO));
  }

  /**
   * Reloj interno que hace correr la linea de tiempo.
   *
   * <p>Se detiene al destruir el componente. Sin eso, salir de una clase deja el intervalo
   * vivo para siempre: navegar entre cinco lecciones deja cinco relojes corriendo y
   * escribiendo en signals de componentes que ya no existen.
   */
  private arrancarReloj(): void {
    const reloj = setInterval(() => {
      if (!this.reproduciendo()) {
        return;
      }
      const paso = (INTERVALO_MS / 1000) * this.velocidad();
      const duracion = this.duracionSegundos();
      this.segundo.update((t) => (duracion > 0 ? (t + paso) % duracion : 0));
    }, INTERVALO_MS);

    this.destruccion.onDestroy(() => clearInterval(reloj));
  }

  /**
   * Decide la disposicion del simulador segun el espacio disponible.
   *
   * <p>`matchMedia` con escuchador y no una medida unica: cambiar el tamanio de la ventana o
   * girar la tableta tiene que recolocar el panel, y una medida tomada al arrancar deja el
   * panel vertical flotando sobre un video que ya no cabe.
   */
  private observarEspacio(): void {
    const ventana = typeof window === 'undefined' ? null : window;
    if (!ventana?.matchMedia) {
      return;
    }

    const consulta = ventana.matchMedia('(min-width: 1460px) and (min-height: 760px)');
    const aplicar = () => this.disposicionSimulador.set(consulta.matches ? 'vertical' : 'franja');

    aplicar();
    consulta.addEventListener('change', aplicar);
    this.destruccion.onDestroy(() => consulta.removeEventListener('change', aplicar));
  }
}
