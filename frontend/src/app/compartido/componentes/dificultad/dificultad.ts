import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icono } from '../icono/icono';

const NIVEL_MINIMO = 1;
const NIVEL_MAXIMO = 5;

/**
 * Dificultad de un ejercicio o tutorial, en estrellas sobre cinco (docs/04 §3).
 *
 * <p>Las estrellas van en mango, uno de los pocos usos permitidos de ese color. Nunca
 * comunica progreso: para eso esta la barra verde, y mezclarlos ensenia al alumno a
 * leerlos mal.
 *
 * <p>El valor se recorta al rango valido en vez de confiar en quien lo envia.
 */
@Component({
  selector: 'adr-dificultad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <!-- El rol no es adorno: ARIA no permite nombrar un elemento de rol generico, y sin el
         la etiqueta accesible puede ignorarse. Aqui importa mas que en otros sitios porque
         las cinco estrellas comparten el MISMO trazado y solo cambia el color — el rotulo es
         el unico portador de la cifra, y docs/04 §5 prohibe que el color lo sea. Es ademas
         la convencion de la casa: el avatar ya lo hace asi, con su test. -->
    <span class="adr-dificultad" role="img" [attr.aria-label]="descripcion()">
      @for (posicion of posiciones; track posicion) {
        <adr-icono
          nombre="star"
          [tamanio]="20"
          class="adr-dificultad__estrella"
          [class.adr-dificultad__estrella--llena]="posicion <= nivelSeguro()"
        />
      }
    </span>
  `,
  styleUrl: './dificultad.scss',
})
export class Dificultad {
  protected readonly posiciones = [1, 2, 3, 4, 5];

  /** Nivel de 1 a 5. */
  readonly nivel = input.required<number>();

  protected readonly nivelSeguro = computed(() => {
    const nivel = this.nivel();
    if (!Number.isFinite(nivel)) {
      return NIVEL_MINIMO;
    }
    return Math.min(NIVEL_MAXIMO, Math.max(NIVEL_MINIMO, Math.round(nivel)));
  });

  /** Texto para lectores de pantalla: el color por si solo no comunica nada (docs/04 §5). */
  protected readonly descripcion = computed(
    () => `Dificultad ${this.nivelSeguro()} de ${NIVEL_MAXIMO}`,
  );
}
