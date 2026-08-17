import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DESTINO_REGISTRO } from '../../../app.routes';
import { Boton } from '../../../compartido/componentes/boton/boton';
import { MarcoImagen } from '../../../compartido/componentes/marco-imagen/marco-imagen';
import { PanelCristal } from '../../../compartido/componentes/panel-cristal/panel-cristal';
import { RutaNiveles } from '../../../compartido/componentes/ruta-niveles/ruta-niveles';
import { ACTIVOS } from '../../../disenio/activos';
import { ESTACIONES, HEROE, INSTRUMENTOS } from '../landing.contenido';

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
      <!-- La imagen entregada es vertical (567x720) y este hueco es panoramico a sangre:
           a plena opacidad el acordeon salia gigante y pixelado. En modo textura se mezcla
           con el degradado del sistema, aporta el motivo vallenato y deja de notarse que
           esta forzada. Cuando llegue una foto real de Diego, intensidad pasa a plena. -->
      <adr-marco-imagen
        [fuente]="activos.heroe"
        variante="fondo"
        velo="lateral"
        tono="oscuro"
        intensidad="textura"
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
            <adr-boton variante="primario" [enlace]="destinoRegistro">{{ texto.accion }}</adr-boton>
            <a class="heroe__enlace" href="#planes">{{ texto.enlaceSecundario }}</a>
          </div>

          <p class="heroe__nota">{{ texto.nota }}</p>

          <!-- El conjunto completo, con el acordeón primero y marcado. La academia enseña
               los cuatro, pero la página se enfoca en el acordeón a propósito: es lo que se
               busca y es donde está el simulador. Una línea lo dice sin repartir el mensaje,
               y de paso llena el vacío que quedaba bajo la promesa. -->
          <ul class="heroe__conjunto">
            @for (instrumento of instrumentos; track instrumento; let primero = $first) {
              <li class="heroe__instrumento" [class.heroe__instrumento--principal]="primero">
                {{ instrumento }}
              </li>
            }
          </ul>
        </div>

        <adr-panel-cristal variante="oscuro" class="heroe__panel">
          <p class="adr-kicker heroe__panel-titulo">Tu ruta</p>
          <adr-ruta-niveles [estaciones]="estaciones" [compacta]="true" [sobreOscuro]="true" />
          <p class="heroe__panel-pie">{{ texto.resumenRuta }}</p>
        </adr-panel-cristal>
      </div>
    </section>
  `,
  styleUrl: './seccion-heroe.scss',
})
export class SeccionHeroe {
  protected readonly destinoRegistro = DESTINO_REGISTRO;
  protected readonly texto = HEROE;
  protected readonly instrumentos = INSTRUMENTOS;
  protected readonly estaciones = ESTACIONES;
  protected readonly activos = ACTIVOS;
}
