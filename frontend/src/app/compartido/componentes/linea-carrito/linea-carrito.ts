import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LineaCarrito } from '../../../nucleo/modelos/comercio';
import { iniciales } from '../../formato/formato';
import { PesosPipe } from '../../formato/pesos-pipe';
import { Icono } from '../icono/icono';

/**
 * Una linea del carrito: miniatura, nombre, precio por unidad y control de cantidad.
 *
 * <p>La miniatura es de INICIALES mientras no haya fotos de producto (pendiente del handoff).
 * Un cuadro gris vacio se lee como una imagen que no cargo; unas iniciales se leen como una
 * decision.
 *
 * <p>El componente no toca el carrito: emite `cambio` con el delta y quien lo use decide. Asi
 * la misma linea sirve en el panel lateral y en la columna de la tienda sin duplicarse, y se
 * puede probar sin montar el servicio.
 */
@Component({
  selector: 'adr-linea-carrito',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono, PesosPipe],
  template: `
    <div class="linea">
      <span class="linea__miniatura" aria-hidden="true">{{ siglas() }}</span>

      <span class="linea__texto">
        <span class="linea__nombre">{{ linea().producto.nombre }}</span>
        <span class="linea__precio">
          {{ linea().producto.precioCentavos | pesos }} c/u ·
          <strong>{{ linea().subtotalCentavos | pesos }}</strong>
        </span>
      </span>

      <span class="linea__cantidad">
        <button
          type="button"
          (click)="cambio.emit(-1)"
          [attr.aria-label]="'Quitar uno de ' + linea().producto.nombre"
        >
          <adr-icono nombre="minus" [tamanio]="16" />
        </button>
        <span class="linea__numero">{{ linea().cantidad }}</span>
        <button
          type="button"
          (click)="cambio.emit(1)"
          [attr.aria-label]="'Añadir uno de ' + linea().producto.nombre"
        >
          <adr-icono nombre="plus" [tamanio]="16" />
        </button>
      </span>
    </div>
  `,
  styleUrl: './linea-carrito.scss',
})
export class LineaCarritoComponente {
  readonly linea = input.required<LineaCarrito>();

  /** Cuantas unidades sumar o restar. Siempre 1 o −1. */
  readonly cambio = output<number>();

  protected readonly siglas = computed(() => iniciales(this.linea().producto.nombre));
}
