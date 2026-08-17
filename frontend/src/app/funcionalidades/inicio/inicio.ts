import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Icono } from '../../compartido/componentes/icono/icono';
import { ItemListaComponente } from '../../compartido/componentes/item-lista/item-lista';
import { MosaicoCifra } from '../../compartido/componentes/mosaico-cifra/mosaico-cifra';
import { TarjetaTutorial } from '../../compartido/componentes/tarjeta-tutorial/tarjeta-tutorial';
import { PesosPipe } from '../../compartido/formato/pesos-pipe';
import { ACTIVOS } from '../../disenio/activos';
import { NombreIcono } from '../../disenio/iconos/registro-iconos';
import { ItemLista } from '../../nucleo/modelos/aprendizaje';
import { CatalogoServicio } from '../../nucleo/servicios/catalogo-servicio';
import { ComercioServicio } from '../../nucleo/servicios/comercio-servicio';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';

/**
 * Tolerancia al comparar el desplazamiento del carrusel con su ancho.
 *
 * <p>`scrollLeft` es fraccionario con zoom del navegador o en pantallas HiDPI, asi que la
 * comparacion exacta deja la flecha derecha encendida al final del recorrido: el alumno pulsa
 * y no pasa nada. Un pixel de margen absorbe esa fraccion.
 */
const MARGEN_SUBPIXEL = 1;

/**
 * Panel de inicio del estudiante.
 *
 * <p>Responde a la unica pregunta con la que el alumno abre la aplicacion: «¿por donde iba?».
 * Por eso lo primero y mas grande es «continuar donde quedaste» — sale de
 * `AvanceClase.segundo_ultimo` cuando exista el backend — y no un saludo ni un resumen.
 *
 * <p>Debajo: cuatro cifras, la ruta del nivel en marcha junto al taller en vivo, los
 * tutoriales comprados y las compras de la tienda.
 *
 * <p><b>El estado de la suscripcion no se repite aqui.</b> Vive en la barra lateral, que esta
 * en todas las pantallas, y en `/suscripcion`. Un tercer sitio con el precio y el medio de
 * pago solo anadia un dato de facturacion en medio del plan de estudio.
 */
@Component({
  selector: 'adr-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarraProgreso,
    Boton,
    Icono,
    ItemListaComponente,
    MosaicoCifra,
    PesosPipe,
    RouterLink,
    TarjetaTutorial,
  ],
  // Al cambiar el ancho, lo que cabe en la fila cambia y las flechas dejan de decir la verdad.
  host: { '(window:resize)': 'medirCarrusel()' },
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  private readonly catalogo = inject(CatalogoServicio);
  private readonly comercio = inject(ComercioServicio);
  private readonly cuenta = inject(CuentaServicio);

  protected readonly perfil = this.cuenta.perfil;
  protected readonly poster = ACTIVOS.diegoTocando;

  protected readonly cifras = toSignal(this.cuenta.cifras(), { initialValue: [] });
  protected readonly modulos = toSignal(this.catalogo.modulosDelCursoActual(), {
    initialValue: [],
  });
  protected readonly tutoriales = toSignal(this.catalogo.tutorialesComprados(), {
    initialValue: [],
  });
  protected readonly pedidos = toSignal(this.comercio.pedidos(), { initialValue: [] });
  protected readonly suscripcion = toSignal(this.comercio.suscripcion(), { initialValue: null });

  private readonly pista = viewChild<ElementRef<HTMLElement>>('pista');

  protected readonly puedeAnterior = signal(false);
  protected readonly puedeSiguiente = signal(false);

  /** Hay tarjetas fuera de vista a algun lado, que es lo unico que justifica las flechas. */
  protected readonly hayDesborde = computed(() => this.puedeAnterior() || this.puedeSiguiente());

  constructor() {
    // La primera medida necesita el DOM ya maquetado: antes de pintar, todos los anchos son 0
    // y el carrusel nacería sin flechas aunque la colección no quepa.
    afterNextRender(() => this.medirCarrusel());
  }

  /** La clase que continua. Con el backend saldra de `GET /yo/continuar`. */
  protected readonly continuar = {
    claseId: 'l7',
    titulo: 'Lección 7 · Bajos y acordes mayores',
    contexto: 'Módulo 4 de 12 — Nivel Intermedio',
    duracion: '18:42 min',
    avance: 42,
  };

  /** Taller en vivo mas proximo. Nulo cuando no hay ninguno programado. */
  protected readonly taller = {
    titulo: 'Taller de digitación con Diego',
    cuando: 'Jueves 20 ago · 7:00 p. m. (COL)',
    duracion: 'Dura 60 min',
    cupos: 'Quedan 8 lugares',
  };

  protected readonly rotuloPedido: Record<string, string> = {
    preparando: 'Preparando',
    enviado: 'En camino',
    entregado: 'Entregado',
    descargable: 'Descargable',
  };

  protected readonly iconoPedido: Record<string, NombreIcono> = {
    preparando: 'package',
    enviado: 'package',
    entregado: 'check-circle',
    descargable: 'download-simple',
  };

  /**
   * Vuelve a mirar cuanto queda por desplazar a cada lado del carrusel.
   *
   * <p>Se llama al desplazar y al cambiar el ancho de la ventana. Es una LECTURA del DOM y no
   * un estado propio a proposito: el desplazamiento tambien lo mueven el arrastre en movil, la
   * rueda y el teclado, y un contador de posicion en la clase se quedaria desfasado con los
   * tres.
   */
  protected medirCarrusel(): void {
    const pista = this.pista()?.nativeElement;
    if (!pista) {
      return;
    }

    const restante = pista.scrollWidth - pista.clientWidth - pista.scrollLeft;
    this.puedeAnterior.set(pista.scrollLeft > MARGEN_SUBPIXEL);
    this.puedeSiguiente.set(restante > MARGEN_SUBPIXEL);
  }

  /**
   * Mueve el carrusel una tarjeta hacia el lado indicado.
   *
   * <p>`-1` es hacia atras y `1` hacia delante. No hace falta recalcular nada despues: el
   * propio desplazamiento dispara `scroll`, que ya llama a `medirCarrusel()`.
   */
  protected desplazar(sentido: -1 | 1): void {
    const pista = this.pista()?.nativeElement;
    if (!pista) {
      return;
    }

    pista.scrollBy({ left: sentido * this.anchoDePaso(pista), behavior: 'smooth' });
  }

  /**
   * Cuanto avanza el carrusel en cada pulsacion: una tarjeta y su separacion.
   *
   * <p>Se MIDE del DOM en vez de escribirse aqui porque el ancho de la tarjeta lo decide el
   * CSS —y `flex` la estira cuando sobra sitio—, asi que un numero copiado a mano se
   * desincroniza en el primer retoque de la hoja de estilos y deja media tarjeta cortada.
   */
  private anchoDePaso(pista: HTMLElement): number {
    const tarjeta = pista.firstElementChild as HTMLElement | null;
    if (!tarjeta) {
      return pista.clientWidth;
    }

    const separacion = Number.parseFloat(getComputedStyle(pista).columnGap);
    return tarjeta.getBoundingClientRect().width + (Number.isNaN(separacion) ? 0 : separacion);
  }

  /**
   * Convierte un modulo en la forma que espera la fila de lista.
   *
   * <p>La conversion vive aqui y no en la plantilla porque un objeto construido dentro de una
   * expresion de plantilla se crea de nuevo en cada deteccion de cambios, y con `track` por
   * identidad eso vuelve a dibujar la lista entera sin que nada haya cambiado.
   */
  protected aItemLista(modulo: {
    numero: number;
    titulo: string;
    detalle: string;
    estado: string;
  }): ItemLista {
    return {
      id: `m${modulo.numero}`,
      numero: modulo.numero,
      titulo: `Módulo ${modulo.numero} · ${modulo.titulo}`,
      detalle: modulo.detalle,
      estado: modulo.estado as ItemLista['estado'],
    };
  }
}
