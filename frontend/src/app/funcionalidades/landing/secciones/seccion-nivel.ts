import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icono } from '../../../compartido/componentes/icono/icono';
import { MarcoImagen } from '../../../compartido/componentes/marco-imagen/marco-imagen';
import { ACTIVOS } from '../../../disenio/activos';
import { PASOS_NIVEL, PRACTICA_NIVEL } from '../landing.contenido';

/**
 * Qué pasa dentro de un nivel: ves, practicas, apruebas.
 *
 * <p>Interludio deliberadamente <b>sin marco de tarjeta</b>. La ausencia de caja es lo que
 * hace que se lea como un paso del recorrido y no como una cuarta tanda de tarjetas. Es la
 * única sección centrada de la página, y ese contraste también ayuda a leerla como pausa.
 */
@Component({
  selector: 'adr-seccion-nivel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono, MarcoImagen],
  template: `
    <section class="adr-seccion nivel">
      <div class="adr-contenedor">
        <div class="nivel__encabezado">
          <p class="adr-kicker adr-kicker--azul">Dentro de un nivel</p>
          <h2 class="adr-titulo-seccion nivel__titulo">Ves, practicas, apruebas.</h2>
        </div>

        <div class="nivel__pasos">
          @for (paso of pasos; track paso.titulo) {
            <div class="nivel__paso">
              <span class="nivel__marca" aria-hidden="true">
                <adr-icono [nombre]="paso.icono" [tamanio]="24" />
              </span>
              <div>
                <h3 class="nivel__paso-titulo">{{ paso.titulo }}</h3>
                <p class="adr-texto-secundario">{{ paso.detalle }}</p>
              </div>
            </div>
          }
        </div>

        <figure class="nivel__prueba">
          <adr-marco-imagen
            [fuente]="activos.practicaBotonadura"
            relacion="3/2"
            velo="inferior"
            [alternativo]="foto.alternativo"
          />
          <figcaption class="nivel__pie">{{ foto.pie }}</figcaption>
        </figure>
      </div>
    </section>
  `,
  styleUrl: './seccion-nivel.scss',
})
export class SeccionNivel {
  protected readonly pasos = PASOS_NIVEL;
  protected readonly foto = PRACTICA_NIVEL;
  protected readonly activos = ACTIVOS;
}
