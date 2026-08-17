import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONOS, NombreIcono } from '../../../disenio/iconos/registro-iconos';

/**
 * Tamanios permitidos. Regla 12: nada intermedio, para que todo quede alineado.
 *
 * <p>La escala subio un escalon entera al pasar a Material Symbols (ADR 0014). Material se
 * dibuja sobre una retícula de 24 con trazo de peso 400 y NO tiene la capa rellena del
 * duotone de Phosphor, asi que al mismo numero de pixeles pesa visualmente menos. A 16 px
 * quedaba delgado y timido justo donde mas se mira: el menu de cuenta y la barra lateral.
 */
export type TamanioIcono = 20 | 24 | 32 | 40;

/**
 * Icono Material Symbols Rounded.
 *
 * <p>Unico punto por el que entran iconos al proyecto. Pegar un `<svg>` suelto en una
 * plantilla es lo que termina mezclando librerias sin que nadie lo note, y eso hace que
 * la interfaz se vea armada por partes (regla 11).
 *
 * <p>Se tine solo con `currentColor`: hereda el color del texto que lo rodea, asi que
 * respeta los tokens sin necesidad de variantes de color por icono.
 */
@Component({
  selector: 'adr-icono',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      [attr.width]="tamanio()"
      [attr.height]="tamanio()"
      [attr.role]="etiqueta() ? 'img' : null"
      [attr.aria-label]="etiqueta()"
      [attr.aria-hidden]="etiqueta() ? null : 'true'"
      [innerHTML]="contenido()"
    ></svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class Icono {
  private readonly sanitizador = inject(DomSanitizer);

  readonly nombre = input.required<NombreIcono>();
  readonly tamanio = input<TamanioIcono>(24);

  /**
   * Texto alternativo. Si el icono va acompanado de texto visible se deja nulo y el
   * icono queda oculto para lectores de pantalla, que es lo correcto: leerlo dos veces
   * estorba mas de lo que ayuda.
   */
  readonly etiqueta = input<string | null>(null);

  /**
   * Contenido SVG del icono.
   *
   * <p>Se omite la sanitizacion a proposito y de forma segura: el valor sale de ICONOS,
   * una constante generada en tiempo de compilacion desde el paquete de Material Symbols.
   * Nunca proviene de datos de usuario ni de la API, asi que no hay vector de inyeccion.
   */
  protected readonly contenido = computed<SafeHtml>(() =>
    this.sanitizador.bypassSecurityTrustHtml(ICONOS[this.nombre()]),
  );
}
