import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const MINIMO = 0;
const MAXIMO = 100;

/**
 * Barra de progreso de un curso o nivel (docs/04 §3).
 *
 * <p>El relleno es verde porque el verde solo comunica progreso o aprobacion (regla de
 * color 3). El valor se recorta al rango valido en vez de confiar en quien lo envia: un
 * calculo de progreso mal hecho no debe poder dibujar una barra rota.
 */
@Component({
  selector: 'adr-barra-progreso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="adr-barra"
      role="progressbar"
      [attr.aria-valuenow]="valorSeguro()"
      [attr.aria-valuemin]="minimo"
      [attr.aria-valuemax]="maximo"
      [attr.aria-label]="etiqueta()"
    >
      <div class="adr-barra__relleno" [style.width.%]="valorSeguro()"></div>
    </div>
    @if (mostrarTexto()) {
      <span class="adr-barra__texto">{{ valorSeguro() }}%</span>
    }
  `,
  styleUrl: './barra-progreso.scss',
})
export class BarraProgreso {
  protected readonly minimo = MINIMO;
  protected readonly maximo = MAXIMO;

  /** Porcentaje completado. Se recorta a 0–100. */
  readonly valor = input.required<number>();
  readonly etiqueta = input('Progreso del curso');
  readonly mostrarTexto = input(false);

  protected readonly valorSeguro = computed(() => {
    const valor = this.valor();
    if (!Number.isFinite(valor)) {
      return MINIMO;
    }
    return Math.min(MAXIMO, Math.max(MINIMO, Math.round(valor)));
  });
}
