import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ItemLista } from '../../../nucleo/modelos/aprendizaje';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';
import { Icono } from '../icono/icono';

/**
 * Fila de una lista secuencial: clases del reproductor, partes de un tutorial, modulos.
 *
 * <p>La marca de la izquierda cambia con el estado: check verde si esta completada, punto
 * azul si es la que se ve ahora, candado si esta bloqueada y el numero a secas si esta
 * pendiente. Cuatro estados con cuatro formas distintas, no cuatro colores del mismo circulo
 * — docs/04 §5: el color no puede ser el unico portador de significado.
 *
 * <p>El bloqueado no es solo visual. Ocultar o apagar la fila en el front no es control de
 * acceso: quien decide es el backend (no negociable 4). Aqui solo se dibuja el motivo.
 */
@Component({
  selector: 'adr-item-lista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <div class="item" [class]="'item--' + item().estado">
      <span class="item__marca">
        @if (iconoEstado(); as nombre) {
          <adr-icono [nombre]="nombre" [tamanio]="16" />
        } @else {
          {{ item().numero }}
        }
      </span>
      <span class="item__texto">
        <span class="item__titulo">{{ item().titulo }}</span>
        <span class="item__detalle">{{ item().detalle }}</span>
      </span>
      <ng-content />
    </div>
  `,
  styleUrl: './item-lista.scss',
})
export class ItemListaComponente {
  readonly item = input.required<ItemLista>();

  /**
   * Icono de la marca, o nulo cuando toca enseniar el numero.
   *
   * <p>«Viendo ahora» no tiene icono propio a proposito: su marca es un punto de color que
   * dibuja el CSS. Un icono de reproduccion ahi se confundiria con un boton para reproducir.
   */
  protected readonly iconoEstado = computed<NombreIcono | null>(() => {
    const estado = this.item().estado;
    if (estado === 'completado') {
      return 'check-circle';
    }
    if (estado === 'bloqueado') {
      return 'lock';
    }
    return null;
  });
}
