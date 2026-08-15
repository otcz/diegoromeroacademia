import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Boton } from '../boton/boton';
import { entorno } from '../../../../entornos/entorno';

/**
 * Pie de las paginas publicas, con la llamada final a la accion (docs/04 §3).
 *
 * <p>Igual que la navegacion, vive en el catalogo porque se repite en todas las paginas
 * abiertas. El enlace de verificacion de certificado sale de la configuracion de entorno,
 * no escrito a mano: cambia entre desarrollo y produccion.
 */
@Component({
  selector: 'adr-pie-publico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton],
  template: `
    <footer class="adr-seccion adr-seccion-oscura">
      <div class="adr-contenedor">
        <h2 class="adr-pie__titulo">
          Tu primera canción está<br />
          <span class="adr-subrayado">más cerca</span> de lo que crees.
        </h2>

        <div class="adr-pie__acciones">
          <adr-boton variante="primario" enlace="/registro">Registrarme gratis</adr-boton>
          @if (numeroWhatsapp()) {
            <adr-boton
              variante="sobre-oscuro"
              icono="whatsapp-logo"
              [enlace]="'https://api.whatsapp.com/send?phone=' + numeroWhatsapp()"
              [nuevaPestania]="true"
            >
              Hablar por WhatsApp
            </adr-boton>
          }
        </div>

        <div class="adr-pie__enlaces">
          <div>
            <p class="adr-pie__marca">Academia Diego Romero</p>
            <p class="adr-texto-claro">diegoromeroacademia.com</p>
          </div>
          <div>
            <a href="/terminos">Términos y condiciones</a>
            <a href="/reembolsos">Reembolsos</a>
            <a [href]="urlVerificacion">Verificar certificado</a>
          </div>
          <div>
            <a
              href="https://youtube.com/@DiegoRomeroAcordeon"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube &#64;DiegoRomeroAcordeon
            </a>
          </div>
        </div>

        <p class="adr-pie__copyright">
          © {{ anio() }} Academia Diego Romero. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styleUrl: './pie-publico.scss',
})
export class PiePublico {
  readonly numeroWhatsapp = input('');
  readonly anio = input(2026);

  protected readonly urlVerificacion = entorno.urlVerificacionCertificado;
}
