import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Marca } from '../marca/marca';

/**
 * Boton flotante de WhatsApp (docs/04 §3, especificacion §14.3).
 *
 * <p>Siempre visible, en todos los tamanios de pantalla. El publico de este proyecto llega
 * desde YouTube en celular y resuelve por WhatsApp, no por formulario de contacto: quitarlo
 * de movil seria quitarlo justo donde mas se usa.
 *
 * <p>Es el unico elemento de la interfaz que puede ir en verde WhatsApp. Ese color esta
 * reservado a esta marca y no participa del sistema «Azul rey».
 *
 * <p>El simbolo entra por `<adr-marca>` y no por `<adr-icono>`: Material Symbols no tiene
 * logotipos (ADR 0014) y, de tenerlos, una marca no se recolorea. Va la version a color, y el
 * circulo verde del logotipo se funde con la pastilla —el token vale exactamente el verde de
 * la marca— asi que se ve el auricular blanco solo, que es la forma que WhatsApp aprueba
 * sobre su propio verde.
 */
@Component({
  selector: 'adr-whatsapp-flotante',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Marca],
  template: `
    <a
      class="adr-whatsapp"
      [href]="enlace()"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
    >
      <adr-marca nombre="whatsapp" [tamanio]="32" />
      <span class="adr-whatsapp__texto">{{ etiqueta() }}</span>
    </a>
  `,
  styleUrl: './whatsapp-flotante.scss',
})
export class WhatsappFlotante {
  /** Numero en formato internacional sin signos, por ejemplo 573001234567. */
  readonly numero = input.required<string>();

  /** Mensaje precargado. Baja la friccion: el alumno no tiene que redactar nada. */
  readonly mensaje = input('Hola, quiero informacion sobre las clases de acordeon');

  readonly etiqueta = input('Escríbenos');

  protected readonly enlace = computed(
    () =>
      `https://api.whatsapp.com/send?phone=${this.numero()}&text=${encodeURIComponent(this.mensaje())}`,
  );
}
