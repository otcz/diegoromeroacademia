import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MarcoImagen } from '../../../compartido/componentes/marco-imagen/marco-imagen';
import { ACTIVOS } from '../../../disenio/activos';
import { SIMULADOR } from '../landing.contenido';

/**
 * Botones del diagrama.
 *
 * <p>Cuatro hileras de ocho, no tres de cinco: el acordeón diatónico tiene tres hileras de
 * pitos en la mano derecha y una de bajos. Es más fiel al instrumento Y llena el marco, que
 * con quince botones se veía medio vacío y hacía parecer inacabado el único diferenciador
 * de la plataforma.
 *
 * <p>Tres encendidos: un acorde, no una fila decorativa.
 */
const BOTONES = [
  [false, true, false, false, false, false, false, false],
  [false, false, true, false, false, false, false, false],
  [false, false, false, true, false, false, false, false],
  [false, false, false, false, false, false, false, false],
];

/**
 * El simulador: lo único que no tiene ningún competidor.
 *
 * <p>Es el único sitio de la página donde aparece el marco de ventana. Repetido en cuatro
 * secciones dejaría de ser un recurso y se volvería el idioma visual de la página.
 *
 * <p>Sin captura real, el marco pinta el diagrama de botones del acordeón con CSS y tokens:
 * geometría de la propia marca, no ilustración de banco. Cuando exista la captura, se cambia
 * un valor nulo en el manifiesto.
 */
@Component({
  selector: 'adr-seccion-simulador',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarcoImagen],
  template: `
    <section id="simulador" class="adr-seccion adr-seccion-oscura simulador">
      <div class="adr-contenedor simulador__rejilla">
        <adr-marco-imagen
          [fuente]="activos.simulador"
          variante="ventana"
          relacion="16/10"
          tono="claro"
        >
          <div marcador class="simulador__diagrama" aria-hidden="true">
            @for (hilera of botones; track $index) {
              <div class="simulador__hilera">
                @for (encendido of hilera; track $index) {
                  <span class="simulador__boton" [class.simulador__boton--activo]="encendido">
                  </span>
                }
              </div>
            }
          </div>
        </adr-marco-imagen>

        <div>
          <p class="adr-kicker adr-kicker--mango">{{ texto.kicker }}</p>
          <h2 class="adr-titulo-seccion adr-titulo-seccion--claro">{{ texto.titulo }}</h2>
          <p class="adr-texto-claro">{{ texto.detalle }}</p>

          <ul class="simulador__chips">
            @for (ventaja of texto.ventajas; track ventaja) {
              <li class="simulador__chip">{{ ventaja }}</li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styleUrl: './seccion-simulador.scss',
})
export class SeccionSimulador {
  protected readonly texto = SIMULADOR;
  protected readonly activos = ACTIVOS;
  protected readonly botones = BOTONES;
}
