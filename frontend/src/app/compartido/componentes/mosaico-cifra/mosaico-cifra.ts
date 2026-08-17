import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';
import { Icono } from '../icono/icono';

/** Tono del mosaico. Cada cifra del panel usa uno distinto para poder distinguirlas de reojo. */
export type TonoMosaico = 'azul' | 'dorado' | 'morado' | 'verde';

/**
 * Mosaico de cifra del panel de inicio: «31 / 74 lecciones vistas».
 *
 * <p>El numero grande y el complemento pequenio van SEPARADOS y no en una sola cadena. Si
 * fueran «31 / 74» de corrido, el «/ 74» pesaria lo mismo que el 31 y la cifra dejaria de
 * leerse de un vistazo, que es lo unico que tiene que hacer un mosaico.
 *
 * <p>El numero usa cifras tabulares: sin eso, pasar de 9 a 10 cambia el ancho del mosaico y
 * la fila de cuatro se recoloca sola.
 */
@Component({
  selector: 'adr-mosaico-cifra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <div class="mosaico" [class]="'mosaico--' + tono()">
      <div class="mosaico__cabecera">
        <span class="mosaico__icono">
          <adr-icono [nombre]="icono()" [tamanio]="20" />
        </span>
        <span class="mosaico__rotulo">{{ rotulo() }}</span>
      </div>
      <p class="mosaico__valor">
        {{ valor() }}<span class="mosaico__complemento">{{ complemento() }}</span>
      </p>
    </div>
  `,
  styleUrl: './mosaico-cifra.scss',
})
export class MosaicoCifra {
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string>();
  readonly complemento = input('');
  readonly icono = input.required<NombreIcono>();
  readonly tono = input<TonoMosaico>('azul');
}
