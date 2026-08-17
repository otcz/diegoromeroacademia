import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Ejercicio } from '../../../nucleo/modelos/aprendizaje';
import { DuracionPipe } from '../../formato/pesos-pipe';
import { Boton } from '../boton/boton';
import { Etiqueta } from '../etiqueta/etiqueta';
import { MarcoImagen } from '../marco-imagen/marco-imagen';

/**
 * Tarjeta de ejercicio de la zona de practica.
 *
 * <p>Los metadatos van en el orden en que se deciden: BPM primero —es lo que dice si el
 * ejercicio esta a tu alcance hoy—, luego el nivel y por ultimo cuantas veces lo has hecho.
 * Ese ultimo dato es el que convierte una lista de ejercicios en un registro de practica.
 */
@Component({
  selector: 'adr-tarjeta-ejercicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, DuracionPipe, Etiqueta, MarcoImagen],
  template: `
    <article class="ejercicio">
      <div class="ejercicio__portada">
        <adr-marco-imagen
          [fuente]="ejercicio().portada"
          relacion="16/9"
          velo="inferior"
          alternativo=""
        />
        <adr-etiqueta class="ejercicio__tipo" tinte="azul">{{ ejercicio().tipo }}</adr-etiqueta>
        <span class="ejercicio__duracion">{{ ejercicio().duracionSegundos | duracion }}</span>
      </div>

      <div class="ejercicio__cuerpo">
        <h3 class="ejercicio__titulo">{{ ejercicio().titulo }}</h3>
        <p class="ejercicio__meta">
          <span>{{ ejercicio().bpmOriginal }} BPM</span>
          <span aria-hidden="true">·</span>
          <span>Nivel {{ ejercicio().nivel }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ resumenPractica() }}</span>
        </p>
        <adr-boton
          variante="primario"
          icono="play"
          [anchoCompleto]="true"
          [enlace]="'/practica/' + ejercicio().id"
        >
          Practicar
        </adr-boton>
      </div>
    </article>
  `,
  styleUrl: './tarjeta-ejercicio.scss',
})
export class TarjetaEjercicio {
  readonly ejercicio = input.required<Ejercicio>();

  /** «Nuevo», «Hecho 1 vez» o «Hecho N veces». La concordancia importa: se lee en cada tarjeta. */
  protected resumenPractica(): string {
    const veces = this.ejercicio().vecesPracticado;
    if (veces === 0) {
      return 'Nuevo';
    }
    return veces === 1 ? 'Hecho 1 vez' : `Hecho ${veces} veces`;
  }
}
