import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RutaActivo } from '../../../disenio/activos';

export type RelacionAspecto = '16/9' | '16/10' | '4/5' | '3/2';
export type VeloMarco = 'lateral' | 'inferior' | 'ninguno';
export type VarianteMarco = 'plano' | 'fondo' | 'ventana';
export type TonoMarcador = 'oscuro' | 'claro';

/**
 * Marco de imagen con degradación elegante (ADR 0008).
 *
 * <p>Es el mecanismo que permite que la página funcione hoy sin una sola foto y las absorba
 * después sin tocar plantillas. Sostiene la relación de aspecto, el radio, el velo y los
 * atributos de carga; cuando `fuente` es `null` pinta un degradado del sistema en vez de un
 * hueco gris.
 *
 * <p>La degradación se decide por <b>entrada</b>, no por error de red. Apuntar a un archivo
 * inexistente y esperar el 404 dispararía una petición fallida por hueco en cada carga, con
 * error en consola, penalización en auditoría, y sería imposible de probar.
 *
 * <p>Reservar el espacio con `aspect-ratio` desde el primer pintado evita el salto de diseño
 * cuando la imagen llega: es lo que separa una página que se siente sólida de una que baila.
 */
@Component({
  selector: 'adr-marco-imagen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="clases()" [style.aspect-ratio]="relacion()">
      @if (fuente(); as ruta) {
        <img
          class="adr-marco__imagen"
          [src]="ruta"
          [alt]="alternativo()"
          [attr.loading]="prioritaria() ? 'eager' : 'lazy'"
          [attr.fetchpriority]="prioritaria() ? 'high' : null"
          decoding="async"
        />
      } @else {
        <div class="adr-marco__marcador" aria-hidden="true">
          <ng-content select="[marcador]" />
        </div>
      }

      @if (velo() !== 'ninguno') {
        <div [class]="clasesVelo()" aria-hidden="true"></div>
      }

      <ng-content />
    </div>
  `,
  styleUrl: './marco-imagen.scss',
})
export class MarcoImagen {
  /** Ruta del archivo, o `null` mientras no exista. Con `null` se pinta el marcador. */
  readonly fuente = input<RutaActivo>(null);

  readonly relacion = input<RelacionAspecto>('16/9');
  readonly velo = input<VeloMarco>('ninguno');
  readonly variante = input<VarianteMarco>('plano');

  /** Tono del marcador. Debe contrastar con el fondo de la sección que lo contiene. */
  readonly tono = input<TonoMarcador>('claro');

  /**
   * Texto alternativo. Vacío por defecto porque la mayoría de estos marcos son decorativos;
   * cuando la imagen aporta información, quien la usa está obligado a describirla.
   */
  readonly alternativo = input('');

  /**
   * Marca la imagen del primer pliegue. Evita que la portada del héroe compita con el resto
   * por ancho de banda, que es lo que hunde el LCP en móvil.
   */
  readonly prioritaria = input(false);

  protected readonly clases = computed(
    () => `adr-marco adr-marco--${this.variante()} adr-marco--marcador-${this.tono()}`,
  );

  protected readonly clasesVelo = computed(() => `adr-marco__velo adr-marco__velo--${this.velo()}`);
}
