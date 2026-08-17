import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DESTINO_REGISTRO } from '../../../app.routes';
import { ACTIVOS } from '../../../disenio/activos';
import { Boton } from '../boton/boton';

/**
 * Pie de las paginas publicas, con la llamada final a la accion (docs/04 §3).
 *
 * <p>Igual que la navegacion, vive en el catalogo porque se repite en todas las paginas
 * abiertas.
 *
 * <p>Terminos, reembolsos, verificacion de certificado y tienda figuran SIN enlace, como
 * «— proximamente»: sus paginas no existen y el comodin del enrutador las mandaba a la
 * pantalla de error, al 97% del scroll. Nombran lo que hay en el modelo de negocio sin
 * venderlo en presente. Terminos y reembolsos son ademas requisito para activar la pasarela.
 */
@Component({
  selector: 'adr-pie-publico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton],
  template: `
    <footer class="adr-seccion adr-seccion-oscura">
      <div class="adr-contenedor">
        <!-- Sin subrayado mango: el gesto ya se gasto en el H1 del heroe, y docs/04 §1 lo
             limita a una vez por pantalla. Repetido pierde todo su efecto. -->
        <h2 class="adr-pie__titulo">{{ titulo() }}</h2>

        <div class="adr-pie__acciones">
          <adr-boton variante="primario" [enlace]="destinoRegistro">{{ textoAccion() }}</adr-boton>
          @if (numeroWhatsapp()) {
            <adr-boton
              variante="sobre-oscuro"
              marca="whatsapp"
              [enlace]="'https://api.whatsapp.com/send?phone=' + numeroWhatsapp()"
              [nuevaPestania]="true"
            >
              Hablar por WhatsApp
            </adr-boton>
          }
        </div>

        @if (nota()) {
          <p class="adr-pie__nota">{{ nota() }}</p>
        }

        <div class="adr-pie__enlaces">
          <div class="adr-pie__identidad">
            <!-- Aqui SI cabe el logotipo con su nombre al lado: el pie no compite por
                 espacio como la barra. Va con alt vacio por lo mismo que en la barra — el
                 nombre esta escrito en texto justo al lado y repetirlo estorba. -->
            <img
              class="adr-pie__logotipo"
              [src]="logotipo"
              alt=""
              width="56"
              height="56"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p class="adr-pie__marca">Academia Diego Romero</p>
              <p class="adr-texto-claro">diegoromeroacademia.com</p>
            </div>
          </div>
          <div>
            <!-- Términos y Reembolsos apuntaban a rutas que no existen:
                 el comodín los devolvía a la portada y parecían funcionar. Van sin enlace
                 hasta que existan las páginas, y existir es REQUISITO para cobrar el primer
                 peso — no puede activarse la pasarela (decisión pendiente #1) sin ellas. -->
            <p class="adr-pie__pendiente">Términos y condiciones — próximamente</p>
            <p class="adr-pie__pendiente">Reembolsos — próximamente</p>
            <!-- El pie ya trataba así lo que no existe; este se quedó enlazado por descuido.
                 La ruta de verificación devuelve el index por el respaldo de SPA y el comodín
                 pinta la pantalla de error, al 97% del scroll. -->
            <p class="adr-pie__pendiente">Verificar certificado — próximamente</p>
            <!-- La cuarta fuente de ingreso de la especificación, nombrada sin venderla en
                 presente: existe en el modelo, todavía no en el producto. -->
            <p class="adr-pie__pendiente">Tienda de instrumentos y accesorios — próximamente</p>
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
  protected readonly logotipo = ACTIVOS.logotipo;
  readonly numeroWhatsapp = input('');
  readonly anio = input(new Date().getFullYear());

  /** Llamada final. Fusiona cierre y pie en una sola seccion, en vez de gastar dos. */
  readonly titulo = input('Empieza hoy por el nivel 1.');
  readonly textoAccion = input('Registrarme');
  /**
   * «Cancela cuando quieras» se dice DOS veces en la página, no tres.
   *
   * <p>La del héroe se queda: está 42 px bajo la llamada a la acción y es reversión de riesgo
   * estándar en ese sitio. Esta se retira porque llega DESPUÉS de que la sección de acceso ya
   * explicó que cancelar cuesta los cursos de la ruta — y dejar la promesa sin matizar como
   * lo último que la página dice sobre cancelar es exactamente lo que genera el reclamo.
   */
  readonly nota = input('Sin permanencia');

  protected readonly destinoRegistro = DESTINO_REGISTRO;
}
