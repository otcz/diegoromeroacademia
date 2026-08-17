import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
 * Panel de inicio del estudiante.
 *
 * <p>Responde a la unica pregunta con la que el alumno abre la aplicacion: «¿por donde iba?».
 * Por eso lo primero y mas grande es «continuar donde quedaste» — sale de
 * `AvanceClase.segundo_ultimo` cuando exista el backend — y no un saludo ni un resumen.
 *
 * <p>Debajo: cuatro cifras, la ruta del nivel en marcha, el estado de la suscripcion, el
 * taller en vivo, los tutoriales comprados y las compras de la tienda.
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
  protected readonly tutoriales = toSignal(this.catalogo.tutoriales(), { initialValue: [] });
  protected readonly pedidos = toSignal(this.comercio.pedidos(), { initialValue: [] });
  protected readonly suscripcion = toSignal(this.comercio.suscripcion(), { initialValue: null });

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
