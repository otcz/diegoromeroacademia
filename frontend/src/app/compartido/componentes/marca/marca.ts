import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MARCAS, NombreMarca } from '../../../disenio/iconos/marcas';

/**
 * Marca de un tercero: hoy, el proveedor de identidad de un boton de ingreso.
 *
 * <p><b>Por que no es `adr-icono`.</b> Aquel se tine con `currentColor` a proposito, que es
 * justo lo que aqui esta prohibido: la «G» de Google debe ir con sus cuatro colores. Meter
 * las marcas en el registro de iconos obligaria a que ese componente supiera cuando NO
 * heredar el color, y esa excepcion se olvidaria en el primer icono nuevo. Separarlos hace
 * que la regla se cumpla sola (ADR 0010).
 *
 * <p>Cada marca trae su propio `viewBox` porque cada titular dibuja en la rejilla que quiere;
 * forzarlas a la de Phosphor las deformaria, y una marca deformada no se puede usar.
 *
 * <p>Siempre va acompanada de texto visible («Continuar con Google»), asi que se oculta a
 * los lectores de pantalla: anunciarla repetiria la palabra dos veces seguidas.
 */
@Component({
  selector: 'adr-marca',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="marca().viewBox"
      [attr.width]="tamanio()"
      [attr.height]="tamanio()"
      aria-hidden="true"
      focusable="false"
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
export class Marca {
  private readonly sanitizador = inject(DomSanitizer);

  readonly nombre = input.required<NombreMarca>();

  /**
   * Lado del cuadro, en pixeles.
   *
   * <p>Veinte por defecto, igual que el icono estandar: dentro de un boton, la marca y el
   * icono tienen que ocupar lo mismo o las alturas dejan de coincidir entre botones.
   */
  readonly tamanio = input(20);

  protected readonly marca = computed(() => MARCAS[this.nombre()]);

  /**
   * Dibujo de la marca.
   *
   * <p>Se omite la sanitizacion igual que en `adr-icono` y por la misma razon: el valor sale
   * de una constante del propio codigo, nunca de datos de usuario ni de la API.
   */
  protected readonly contenido = computed<SafeHtml>(() =>
    this.sanitizador.bypassSecurityTrustHtml(this.marca().contenido),
  );
}
