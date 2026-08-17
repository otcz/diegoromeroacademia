import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icono } from '../../../compartido/componentes/icono/icono';
import { CAMINO } from '../landing.contenido';

/**
 * El recorrido completo: de registrarse a tener el certificado.
 *
 * <p>Es la primera sección explicativa de la página, antes del mapa de niveles y antes del
 * detalle de lo que pasa dentro de uno. El orden importa: quien llega de YouTube pregunta
 * «¿cómo entro y qué pasa después?» antes que «¿qué trae el nivel 3?».
 *
 * <p>Numerales grandes unidos por un riel, igual que la ruta de niveles pero con la cifra a la
 * vista: aquí el número ES el paso, mientras que en la ruta el número es el nivel. Reutilizar
 * el mismo gesto visual en los dos sitios los ataría, y son dos ejes distintos — uno es el
 * tiempo del alumno y el otro el temario.
 *
 * <p>El paso que se repite lleva un distintivo propio. Es la pieza que hace encajar el modelo:
 * sin ella el recorrido se lee como cuatro pasos y no como cuatro niveles.
 */
@Component({
  selector: 'adr-seccion-camino',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <section id="como-funciona" class="adr-seccion camino">
      <div class="adr-contenedor">
        <div class="camino__encabezado">
          <p class="adr-kicker adr-kicker--azul">{{ texto.kicker }}</p>
          <!-- La clase propia es lo que activa el centrado del SCSS. Sin ella el H2 se
               centraba DENTRO de una caja de 620 px anclada a la izquierda, y colgaba
               242 px del centro mientras su kicker sí quedaba centrado. -->
          <h2 class="adr-titulo-seccion camino__titulo-seccion">{{ texto.titulo }}</h2>
        </div>

        <ol class="camino__pasos">
          @for (paso of texto.pasos; track paso.clave; let i = $index) {
            <li class="camino__paso" [class.camino__paso--repite]="paso.seRepite">
              <span class="camino__numero" aria-hidden="true">{{ i + 1 }}</span>

              <div class="camino__cuerpo">
                <h3 class="camino__titulo">{{ paso.titulo }}</h3>
                <p class="adr-texto-secundario">{{ paso.detalle }}</p>

                @if (paso.seRepite) {
                  <p class="camino__repeticion">
                    <adr-icono nombre="arrow-left" [tamanio]="20" />
                    {{ texto.repeticion }}
                  </p>
                }
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './seccion-camino.scss',
})
export class SeccionCamino {
  protected readonly texto = CAMINO;
}
