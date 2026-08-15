import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type VarianteCristal = 'oscuro' | 'claro';

/**
 * Superficie de cristal esmerilado (ADR 0008).
 *
 * <p>Encapsula en un solo sitio el `backdrop-filter`, el borde, el radio, el respaldo macizo
 * bajo `@supports` y el apagado bajo `prefers-reduced-transparency`. Sin este componente,
 * cada pantalla reimplementaría las cuatro cosas y tres de ellas se olvidarían.
 *
 * <p><b>Presupuesto:</b> el desenfoque cuesta GPU. El ADR 0008 fija un máximo de dos
 * superficies con cristal en toda la página y un blur reducido bajo 768 px. Quien añada una
 * tercera está gastando conversión en el dispositivo mayoritario.
 */
@Component({
  selector: 'adr-panel-cristal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="clases()">
      <ng-content />
    </div>
  `,
  styleUrl: './panel-cristal.scss',
})
export class PanelCristal {
  readonly variante = input<VarianteCristal>('oscuro');

  protected readonly clases = computed(() => `adr-cristal adr-cristal--${this.variante()}`);
}
