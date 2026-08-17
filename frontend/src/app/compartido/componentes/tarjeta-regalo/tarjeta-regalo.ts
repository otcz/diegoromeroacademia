import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ACTIVOS } from '../../../disenio/activos';

/**
 * Vista previa de la tarjeta de regalo.
 *
 * <p><b>Se actualiza mientras se escribe, y ese es el punto.</b> Quien regala no esta comprando
 * un producto: esta mandando un gesto, y lo que quiere ver antes de pagar es como le va a
 * llegar. Un resumen de texto no cumple esa funcion.
 *
 * <p>Es un componente propio y no unas clases dentro de la pantalla de regalo por dos razones:
 * la pieza se va a reutilizar en el correo de canje y en «Mis regalos», y sacarla dejo la hoja
 * de la pantalla por debajo de su presupuesto de estilos.
 *
 * <p>Oscura en los dos temas: es un objeto de marca, no una superficie de la interfaz. Igual
 * que el reproductor y que el papel del certificado.
 */
@Component({
  selector: 'adr-tarjeta-regalo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      aria-hidden: la tarjeta cambia con cada tecla y anunciarla seria insoportable. Los
      mismos datos estan en los campos que se estan rellenando, que si se anuncian.
    -->
    <div class="regalo" aria-hidden="true">
      <div class="regalo__marca">
        <span class="regalo__logotipo">
          <img [src]="logotipo" alt="" width="32" height="32" />
        </span>
        <span class="regalo__marca-texto">
          <span class="regalo__marca-nombre">Estudio Académico DR</span>
          <span class="regalo__marca-kicker">TARJETA DE REGALO</span>
        </span>
      </div>

      <p class="regalo__para">Para</p>
      <p class="regalo__nombre">{{ destinatario() }}</p>
      <p class="regalo__mensaje">{{ mensaje() }}</p>

      <div class="regalo__pie">
        <span>{{ concepto() }}</span>
        <span>{{ entrega() }}</span>
      </div>
    </div>
  `,
  styleUrl: './tarjeta-regalo.scss',
})
export class TarjetaRegalo {
  readonly destinatario = input.required<string>();
  readonly mensaje = input.required<string>();
  readonly concepto = input.required<string>();
  readonly entrega = input.required<string>();

  protected readonly logotipo = ACTIVOS.logotipo;
}
