import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Tintes disponibles.
 *
 * <p>`mango` esta reservado a «Nuevo» y «Recomendado»; `verde` solo comunica progreso o
 * aprobacion. Usarlos para otra cosa rompe la lectura del sistema: el alumno aprende que
 * el verde significa «aprobado» y deja de creerlo si aparece como decoracion.
 */
export type TinteEtiqueta = 'azul' | 'mango' | 'verde' | 'neutro';

/** Etiqueta de estado o categoria (docs/04 §3). */
@Component({
  selector: 'adr-etiqueta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="clases()"><ng-content /></span>`,
  styleUrl: './etiqueta.scss',
})
export class Etiqueta {
  readonly tinte = input<TinteEtiqueta>('neutro');

  protected readonly clases = computed(() => `adr-etiqueta adr-etiqueta--${this.tinte()}`);
}
