import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RutaActivo } from '../../../disenio/activos';

export type RelacionAspecto = '16/9' | '16/10' | '4/5' | '3/2';
export type VeloMarco = 'lateral' | 'inferior' | 'ninguno';
export type VarianteMarco = 'plano' | 'fondo' | 'ventana';
export type TonoMarcador = 'oscuro' | 'claro';

/**
 * Cuánto pesa la imagen frente al degradado del sistema.
 *
 * <p>`textura` la deja al 30% y deja ver el degradado debajo. Sirve cuando la imagen aporta
 * carácter pero no da la talla como fotografía: a esa opacidad no se percibe ni el pixelado
 * ni un recorte forzado, y lo que queda es color y motivo.
 */
export type IntensidadImagen = 'plena' | 'textura';

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

  /**
   * Relacion de aspecto del hueco.
   *
   * <p>La ignora `variante="fondo"`: esa variante fija `inset: 0; height: 100%` y toma su
   * altura del contenedor. Pasarsela alli es una perilla que no hace nada y engania a quien
   * lea la plantilla creyendo que controla algo.
   */
  readonly relacion = input<RelacionAspecto>('16/9');
  readonly velo = input<VeloMarco>('ninguno');
  readonly variante = input<VarianteMarco>('plano');

  /** `textura` mezcla la imagen con el degradado en vez de sustituirlo. */
  readonly intensidad = input<IntensidadImagen>('plena');

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

  /**
   * El degradado del sistema solo se pinta cuando NO hay foto.
   *
   * <p>Antes la clase de marcador se anadia siempre, asi que el degradado quedaba DEBAJO de
   * cada foto — opaco, y por tanto tapando lo que hubiera detras del marco. En el heroe eso
   * anulaba por completo las tres capas de fondo de la seccion: se declaraban, se aplicaban
   * en el CSS y pintaban cero pixeles. `elementFromPoint` sobre el heroe devolvia el marco.
   *
   * <p>Con foto el degradado no aporta nada — queda oculto salvo en `intensidad="textura"`,
   * donde encima invertia la composicion que la seccion habia escrito. Sin foto se mantiene
   * intacto, que es el contrato del ADR 0008: un hueco vacio se ve deliberado, no roto.
   */
  protected readonly clases = computed(() => {
    const marcador = this.fuente() === null ? ` adr-marco--marcador-${this.tono()}` : '';
    return `adr-marco adr-marco--${this.variante()}${marcador} adr-marco--${this.intensidad()}`;
  });

  protected readonly clasesVelo = computed(() => `adr-marco__velo adr-marco__velo--${this.velo()}`);
}
