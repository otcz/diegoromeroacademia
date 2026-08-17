import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { EstadoVacio } from '../../compartido/componentes/estado-vacio/estado-vacio';
import { Icono } from '../../compartido/componentes/icono/icono';
import { TarjetaEjercicio } from '../../compartido/componentes/tarjeta-ejercicio/tarjeta-ejercicio';
import { TipoEjercicio } from '../../nucleo/modelos/aprendizaje';
import { PracticaServicio } from '../../nucleo/servicios/practica-servicio';

/** «Todos» mas los cuatro tipos. El filtro vive en la pantalla, no en el servicio. */
type FiltroTipo = 'Todos' | TipoEjercicio;

/**
 * Zona de ejercicios: reto semanal, filtros y catalogo.
 *
 * <p>El reto va primero y ocupa toda la fila. Es lo que convierte «tengo doce ejercicios» en
 * «hoy me toca esto»: sin un objetivo del dia, un catalogo de practica se mira y no se usa.
 */
@Component({
  selector: 'adr-practica',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraProgreso, Boton, Chip, EstadoVacio, Icono, TarjetaEjercicio],
  templateUrl: './practica.html',
  styleUrl: './practica.scss',
})
export class Practica {
  private readonly practica = inject(PracticaServicio);

  private readonly ejercicios = toSignal(this.practica.ejercicios(), { initialValue: [] });

  protected readonly reto = toSignal(this.practica.reto(), { initialValue: null });
  protected readonly filtro = signal<FiltroTipo>('Todos');

  protected readonly tipos: readonly FiltroTipo[] = [
    'Todos',
    'Escalas',
    'Bajos',
    'Ritmos',
    'Velocidad',
  ];

  protected readonly visibles = computed(() => {
    const tipo = this.filtro();
    return tipo === 'Todos' ? this.ejercicios() : this.ejercicios().filter((e) => e.tipo === tipo);
  });

  /** Cuenta para el chip «Todos · 12». El numero es lo que dice si vale la pena filtrar. */
  protected readonly total = computed(() => this.ejercicios().length);
}
