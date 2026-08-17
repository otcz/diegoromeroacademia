import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Pastilla de filtro.
 *
 * <p>Se usa en grupo: categorias de la tienda, tipos de ejercicio, ciclo de plan, idioma,
 * nivel del perfil. Todas esas listas son la misma pieza, y el handoff las dibuja igual.
 *
 * <p><b>Es un `<button>`, no un `<div>` con `click`.</b> Un div no se alcanza con el
 * tabulador, no responde a la barra espaciadora y no se anuncia como control. Y lleva
 * `aria-pressed` porque «seleccionado» aqui es un estado del boton, no una pagina activa:
 * con `aria-current` un lector de pantalla lo leeria como si fuera navegacion.
 */
@Component({
  selector: 'adr-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="chip"
      [class.chip--activo]="activo()"
      [attr.aria-pressed]="activo()"
      (click)="elegido.emit()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './chip.scss',
})
export class Chip {
  readonly activo = input(false);
  readonly elegido = output<void>();
}
