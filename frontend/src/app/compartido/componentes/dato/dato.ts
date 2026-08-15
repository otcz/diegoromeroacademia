import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Cifra con su rótulo (docs/04 §3).
 *
 * <p>Átomo de la cinta de prueba social. El valor va con `font-variant-numeric: tabular-nums`
 * para que los dígitos tengan el mismo ancho: sin eso, una fila de cifras baila al alinearse
 * y se lee como algo improvisado.
 *
 * <p>Solo transporta texto ya formateado. Formatear un número es responsabilidad de quien
 * conoce su unidad y su localización, no de un átomo de presentación.
 */
@Component({
  selector: 'adr-dato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="adr-dato__valor">{{ valor() }}</p>
    <p class="adr-dato__rotulo">{{ rotulo() }}</p>
  `,
  styleUrl: './dato.scss',
})
export class Dato {
  readonly valor = input.required<string>();
  readonly rotulo = input.required<string>();
}
