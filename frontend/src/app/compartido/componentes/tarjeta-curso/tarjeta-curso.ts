import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Boton } from '../boton/boton';
import { Dificultad } from '../dificultad/dificultad';
import { Etiqueta } from '../etiqueta/etiqueta';
import { MarcoImagen } from '../marco-imagen/marco-imagen';
import { RutaActivo } from '../../../disenio/activos';

/**
 * Tarjeta de curso o tutorial (docs/04 §3).
 *
 * <p>Estaba declarada en el catálogo desde el primer día y la landing la maquetaba a mano,
 * que es exactamente lo que prohíbe la regla 11. Sacarla aquí es lo que garantiza que la
 * tarjeta del catálogo, la de «mis cursos» y la de la tienda se vean iguales.
 *
 * <p>La portada pasa por `<adr-marco-imagen>` con velo inferior: sin él, la etiqueta mango
 * «Nuevo» quedaría ilegible sobre una foto clara. El velo se aplica aunque todavía no haya
 * foto, para que el día que llegue no haya que revisar el contraste otra vez.
 *
 * <p>Sin precio, la acción ocupa todo el ancho: es el curso incluido en el plan y no compite
 * con nada. Con precio, el importe manda a la izquierda y la acción acompaña.
 */
@Component({
  selector: 'adr-tarjeta-curso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Dificultad, Etiqueta, MarcoImagen],
  template: `
    <article class="adr-curso">
      <div class="adr-curso__portada">
        <adr-marco-imagen [fuente]="portada()" relacion="3/2" velo="inferior" tono="claro" />
        @if (etiqueta(); as texto) {
          <adr-etiqueta tinte="mango">{{ texto }}</adr-etiqueta>
        }
      </div>

      <div class="adr-curso__cuerpo">
        <p class="adr-kicker adr-kicker--atenuado">{{ kicker() }}</p>
        <h3 class="adr-curso__titulo">{{ titulo() }}</h3>

        @if (dificultad(); as nivel) {
          <p class="adr-curso__meta">
            <adr-dificultad [nivel]="nivel" />
            @if (alumnos(); as cuantos) {
              <span>· {{ cuantos }} alumnos</span>
            }
          </p>
        }

        <p class="adr-texto-secundario">{{ descripcion() }}</p>

        <div class="adr-curso__pie">
          @if (precio(); as importe) {
            <p class="adr-curso__precio">{{ importe }}</p>
            <adr-boton variante="secundario" [enlace]="enlace()">{{ textoAccion() }}</adr-boton>
          } @else {
            <adr-boton variante="primario" [anchoCompleto]="true" [enlace]="enlace()">
              {{ textoAccion() }}
            </adr-boton>
          }
        </div>
      </div>
    </article>
  `,
  styleUrl: './tarjeta-curso.scss',
})
export class TarjetaCurso {
  readonly titulo = input.required<string>();
  readonly kicker = input.required<string>();
  readonly descripcion = input.required<string>();
  readonly textoAccion = input.required<string>();
  readonly enlace = input.required<string>();

  readonly portada = input<RutaActivo>(null);

  /** Importe ya formateado. Nulo cuando el curso va incluido en el plan. */
  readonly precio = input<string | null>(null);

  readonly dificultad = input<number | null>(null);
  readonly alumnos = input<number | null>(null);

  /** Texto de la etiqueta mango: «Nuevo». Nulo para no dibujarla. */
  readonly etiqueta = input<string | null>(null);
}
