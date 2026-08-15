import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TarjetaPlan } from '../../../compartido/componentes/tarjeta-plan/tarjeta-plan';
import { GARANTIAS, NOTA_PRECIOS, PLANES } from '../landing.contenido';

/**
 * Planes con precios visibles.
 *
 * <p>Mostrarlos sin exigir registro es la diferencia deliberada frente al competidor de
 * referencia, que los oculta hasta que te apuntas (especificación §1).
 *
 * <p>Los chips de garantía van justo debajo del precio porque es donde aparece la objeción:
 * cómo pago, y qué pasa si me arrepiento.
 */
@Component({
  selector: 'adr-seccion-planes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TarjetaPlan],
  template: `
    <section id="planes" class="adr-seccion planes">
      <div class="adr-contenedor">
        <!-- El diferenciador va DELANTE: enseñar los precios sin pedir registro es la
             diferencia deliberada frente al competidor que los esconde, y no se sacrifica
             por caber. «Suscripción» y no «plan»: un nombre por objeto. -->
        <p class="adr-kicker adr-kicker--azul">Precios visibles · Suscripción o pago único</p>
        <h2 class="adr-titulo-seccion">Elige cómo avanzar.</h2>

        <div class="planes__rejilla">
          @for (plan of planes; track plan.clave) {
            <adr-tarjeta-plan
              [nombre]="plan.nombre"
              [precio]="plan.precio"
              [periodicidad]="plan.periodicidad"
              [descripcion]="plan.descripcion"
              [textoAccion]="plan.textoAccion"
              [recomendado]="plan.recomendado"
              [enlace]="plan.enlace"
            />
          }
        </div>

        <ul class="planes__garantias">
          @for (garantia of garantias; track garantia) {
            <li class="planes__garantia">{{ garantia }}</li>
          }
        </ul>

        <p class="adr-nota">{{ nota }}</p>
      </div>
    </section>
  `,
  styleUrl: './seccion-planes.scss',
})
export class SeccionPlanes {
  protected readonly planes = PLANES;
  protected readonly garantias = GARANTIAS;
  protected readonly nota = NOTA_PRECIOS;
}
