import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Boton } from '../../../compartido/componentes/boton/boton';
import { MarcoImagen } from '../../../compartido/componentes/marco-imagen/marco-imagen';
import { PanelCristal } from '../../../compartido/componentes/panel-cristal/panel-cristal';
import { RutaNiveles } from '../../../compartido/componentes/ruta-niveles/ruta-niveles';
import { ACTIVOS } from '../../../disenio/activos';
import { ESTACIONES, HEROE } from '../landing.contenido';

/**
 * Héroe: la promesa y la ruta, juntas sobre el pliegue.
 *
 * <p>El panel de cristal con la ruta compacta es la única superficie con desenfoque de toda
 * la página, por el presupuesto del ADR 0008. Enseñar el camino antes de pedir el registro
 * es lo que convierte «apúntate» en «empieza por el nivel 1».
 *
 * <p>El texto se ancla en el tercio izquierdo, donde el velo supera el 70% de opacidad: así
 * cualquier foto que Diego entregue mañana cumple contraste sin retocar la fórmula.
 */
@Component({
  selector: 'adr-seccion-heroe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, MarcoImagen, PanelCristal, RutaNiveles],
  template: `
    <section id="inicio" class="heroe">
      <adr-marco-imagen
        [fuente]="activos.heroe"
        variante="fondo"
        velo="lateral"
        tono="oscuro"
        relacion="16/9"
        [prioritaria]="true"
      />

      <div class="adr-contenedor heroe__rejilla">
        <div class="heroe__promesa">
          <p class="adr-kicker adr-kicker--mango">{{ texto.kicker }}</p>

          <h1 class="heroe__titulo">
            {{ texto.tituloAntes }}<br />
            <span class="adr-subrayado">{{ texto.tituloSubrayado }}</span>
          </h1>

          <p class="heroe__bajada">{{ texto.bajada }}</p>

          <div class="heroe__acciones">
            <adr-boton variante="primario" enlace="/registro">{{ texto.accion }}</adr-boton>
            <a class="heroe__enlace" href="#planes">{{ texto.enlaceSecundario }}</a>
          </div>

          <p class="heroe__nota">{{ texto.nota }}</p>
        </div>

        <adr-panel-cristal variante="oscuro" class="heroe__panel">
          <p class="adr-kicker heroe__panel-titulo">Tu ruta</p>
          <adr-ruta-niveles
            [estaciones]="estaciones"
            [compacta]="true"
            [sobreOscuro]="true"
          />
          <p class="heroe__panel-pie">{{ texto.resumenRuta }}</p>
        </adr-panel-cristal>
      </div>
    </section>
  `,
  styleUrl: './seccion-heroe.scss',
})
export class SeccionHeroe {
  protected readonly texto = HEROE;
  protected readonly estaciones = ESTACIONES;
  protected readonly activos = ACTIVOS;
}
