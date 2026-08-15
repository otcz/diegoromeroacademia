import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icono } from '../../../compartido/componentes/icono/icono';
import { ACCESO } from '../landing.contenido';

/**
 * Cómo funciona el acceso: la regla completa, antes del precio.
 *
 * <p>Va entre catálogo y planes por tres razones a la vez. Es donde los dos productos ya
 * están físicamente juntos; es el latido inmediatamente anterior a pedir dinero, que es el
 * único momento en que esta información sirve de algo; y su fondo blanco rompe la costura de
 * dos secciones seguidas en niebla que hoy pega catálogo con planes sin una sola frontera.
 *
 * <p>Sin imágenes y sin verde. El verde comunica progreso o aprobación (regla de color 3) y
 * aquí no hay ninguno de los dos: hay una condición contractual. Tampoco trae un segundo
 * subrayado mango — el gesto de marca es uno por página y ya lo gasta el héroe.
 */
@Component({
  selector: 'adr-seccion-acceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <section class="adr-seccion acceso">
      <div class="adr-contenedor">
        <div class="acceso__encabezado">
          <p class="adr-kicker adr-kicker--azul">{{ texto.kicker }}</p>
          <h2 class="adr-titulo-seccion acceso__titulo-seccion">{{ texto.titulo }}</h2>
        </div>

        <div class="acceso__rejilla">
          @for (modalidad of texto.modalidades; track modalidad.clave) {
            <article class="acceso__tarjeta">
              <span class="acceso__marca" aria-hidden="true">
                <adr-icono [nombre]="modalidad.icono" [tamanio]="24" />
              </span>
              <h3 class="acceso__nombre">{{ modalidad.nombre }}</h3>
              <p class="acceso__incluye">{{ modalidad.queIncluye }}</p>
              <p class="acceso__despues">{{ modalidad.quePasaDespues }}</p>
            </article>
          }
        </div>

        <p class="acceso__garantia">
          <span class="acceso__marca acceso__marca--franja" aria-hidden="true">
            <adr-icono [nombre]="texto.iconoGarantia" [tamanio]="24" />
          </span>
          <span>{{ texto.garantia }}</span>
        </p>
      </div>
    </section>
  `,
  styleUrl: './seccion-acceso.scss',
})
export class SeccionAcceso {
  protected readonly texto = ACCESO;
}
