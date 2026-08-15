import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TarjetaCurso } from '../../../compartido/componentes/tarjeta-curso/tarjeta-curso';
import { CATALOGO, NOTA_CATALOGO } from '../landing.contenido';

/**
 * Catálogo: la ruta completa o una canción suelta.
 *
 * <p>Rejilla <b>asimétrica</b>. Tres tarjetas iguales comunicarían que la suscripción y un
 * tutorial suelto valen lo mismo, y no es cierto: el plan es el producto y el tutorial es la
 * puerta de entrada.
 */
@Component({
  selector: 'adr-seccion-catalogo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TarjetaCurso],
  template: `
    <section id="catalogo" class="adr-seccion">
      <div class="adr-contenedor">
        <div class="catalogo__encabezado">
          <div>
            <p class="adr-kicker adr-kicker--azul">Catálogo</p>
            <h2 class="adr-titulo-seccion">La ruta completa o una canción.</h2>
          </div>
          <a class="catalogo__enlace" href="#catalogo">Ver todo →</a>
        </div>

        <div class="catalogo__rejilla">
          @for (curso of catalogo; track curso.clave) {
            <adr-tarjeta-curso
              [titulo]="curso.titulo"
              [kicker]="curso.kicker"
              [descripcion]="curso.descripcion"
              [portada]="curso.portada"
              [precio]="curso.precio"
              [dificultad]="curso.dificultad"
              [alumnos]="curso.alumnos"
              [etiqueta]="curso.etiqueta"
              [textoAccion]="curso.textoAccion"
              [enlace]="curso.enlace"
            />
          }
        </div>

        <p class="adr-nota">{{ nota }}</p>
      </div>
    </section>
  `,
  styleUrl: './seccion-catalogo.scss',
})
export class SeccionCatalogo {
  protected readonly catalogo = CATALOGO;
  protected readonly nota = NOTA_CATALOGO;
}
