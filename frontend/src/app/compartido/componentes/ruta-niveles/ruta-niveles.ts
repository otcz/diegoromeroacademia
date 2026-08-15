import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EstadoEstacion, ItemNivel } from '../item-nivel/item-nivel';

/** Una parada de la ruta, tal y como la consume el componente. */
export interface EstacionRuta {
  readonly numero: number;
  readonly titulo: string;
  /** Una línea sobre el contenido. Nulo mientras no esté confirmado el temario. */
  readonly resumen: string | null;
  readonly estado: EstadoEstacion;
}

export type OrientacionRuta = 'auto' | 'horizontal' | 'vertical';

/**
 * La ruta de aprendizaje: el eje narrativo de la página (docs/04 §3).
 *
 * <p>Es el patrón que la especificación §14.2 toma de Platzi y el que convierte una lista de
 * argumentos en un camino. Se usa en la landing en modo compacto —dentro del panel del
 * héroe— y completo en la sección central; la pantalla del curso reutilizará el mismo
 * componente con estado real.
 *
 * <p>El riel <b>no lleva tramo relleno en verde</b>. El verde solo comunica progreso o
 * aprobación (regla de color 3), y un visitante que aún no se ha registrado tiene progreso
 * cero: pintarle una barra de avance sería mentirle.
 *
 * <p>Se descarta el carrusel en móvil: escondería tres de las cinco estaciones justo en el
 * dispositivo desde el que llega la mayoría del tráfico.
 */
@Component({
  selector: 'adr-ruta-niveles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemNivel],
  template: `
    <ol [class]="clases()">
      @for (estacion of estaciones(); track estacion.numero) {
        <li class="adr-ruta__estacion">
          <adr-item-nivel
            [estado]="estacion.estado"
            [numero]="estacion.numero"
            [titulo]="estacion.titulo"
            [resumen]="estacion.resumen"
            [compacta]="compacta()"
            [sobreOscuro]="sobreOscuro()"
          />
        </li>
      }
    </ol>
  `,
  styleUrl: './ruta-niveles.scss',
})
export class RutaNiveles {
  readonly estaciones = input.required<readonly EstacionRuta[]>();

  /** `auto` es horizontal en escritorio y vertical en móvil. La compacta siempre es vertical. */
  readonly orientacion = input<OrientacionRuta>('auto');

  readonly compacta = input(false);
  readonly sobreOscuro = input(false);

  protected readonly clases = computed(() => {
    const orientacion = this.compacta() ? 'vertical' : this.orientacion();
    const partes = ['adr-ruta', `adr-ruta--${orientacion}`];
    if (this.compacta()) {
      partes.push('adr-ruta--compacta');
    }
    if (this.sobreOscuro()) {
      partes.push('adr-ruta--sobre-oscuro');
    }
    return partes.join(' ');
  });
}
