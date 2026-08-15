import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Icono, TamanioIcono } from '../icono/icono';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';

/**
 * Variantes del boton.
 *
 * <p>No existe una variante mango: la regla de color 2 prohibe el mango en botones. Es
 * acento, no accion. Dejar la variante fuera del tipo hace que ni siquiera se pueda pedir.
 */
export type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'sobre-oscuro' | 'peligro';

export type TipoBoton = 'button' | 'submit';

/**
 * Boton estandar del catalogo (docs/04 §3).
 *
 * <p>Ninguna pantalla crea su propio boton. Cuando cada pantalla improvisa el suyo, las
 * alturas y los radios dejan de coincidir y la interfaz se ve armada por partes (regla 11).
 *
 * <p>Envuelve un `<button>` nativo para conservar el comportamiento de teclado, el envio
 * de formulario y el estado deshabilitado sin reimplementarlos.
 */
@Component({
  selector: 'adr-boton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <button
      [type]="tipo()"
      [class]="clases()"
      [disabled]="deshabilitado() || cargando()"
      [attr.aria-busy]="cargando() ? 'true' : null"
      (click)="accion.emit()"
    >
      @if (icono(); as nombreIcono) {
        <adr-icono [nombre]="nombreIcono" [tamanio]="tamanioIcono" />
      }
      <span class="adr-boton__texto"><ng-content /></span>
    </button>
  `,
  styleUrl: './boton.scss',
})
export class Boton {
  protected readonly tamanioIcono: TamanioIcono = 20;

  readonly variante = input<VarianteBoton>('primario');
  readonly tipo = input<TipoBoton>('button');
  readonly deshabilitado = input(false);
  readonly cargando = input(false);
  readonly anchoCompleto = input(false);
  readonly icono = input<NombreIcono | null>(null);

  readonly accion = output<void>();

  protected readonly clases = computed(() => {
    const partes = ['adr-boton', `adr-boton--${this.variante()}`];
    if (this.anchoCompleto()) {
      partes.push('adr-boton--ancho-completo');
    }
    if (this.cargando()) {
      partes.push('adr-boton--cargando');
    }
    return partes.join(' ');
  });
}
