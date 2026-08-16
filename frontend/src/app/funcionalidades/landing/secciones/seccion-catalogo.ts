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
          <!-- Aquí había un «Ver todo», cuyo destino apuntaba DENTRO de esta misma sección:
               no movía nada al pulsarlo, que es la señal de confianza inversa a la que busca
               el catálogo. Vuelve como enlace el día que exista la pantalla de cursos. -->
          <p class="catalogo__dato">{{ tutorialesDisponibles }} tutoriales disponibles hoy</p>
        </div>

        <div class="catalogo__rejilla">
          @for (curso of catalogo; track curso.clave) {
            <adr-tarjeta-curso
              [class.catalogo__destacada]="curso.destacado"
              [destacado]="curso.destacado"
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

  /** Se cuenta, no se escribe: un número a mano se desincroniza en la primera alta. */
  protected readonly tutorialesDisponibles = CATALOGO.filter((c) => c.precio !== null).length;
}
