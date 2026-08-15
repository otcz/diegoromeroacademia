import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Dato } from '../../../compartido/componentes/dato/dato';
import { CIFRAS, PROCEDENCIA_CIFRAS } from '../landing.contenido';

/**
 * Cinta de cifras, solapada sobre el héroe.
 *
 * <p>Superficie <b>opaca</b>, nunca cristal: un panel translúcido no puede llevar el mismo
 * color de texto sobre el azul oscuro del héroe y sobre la niebla de abajo a la vez.
 *
 * <p>La línea de procedencia es lo que separa un dato de una consigna publicitaria. Sin ella,
 * «26.000» es una afirmación; con ella, es comprobable en el canal.
 */
@Component({
  selector: 'adr-seccion-cifras',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dato],
  template: `
    <section class="cifras">
      <div class="adr-contenedor">
        <div class="cifras__tarjeta">
          @for (cifra of cifras; track cifra.rotulo) {
            <adr-dato [valor]="cifra.valor" [rotulo]="cifra.rotulo" />
          }
        </div>
        <p class="cifras__procedencia">{{ procedencia }}</p>
      </div>
    </section>
  `,
  styleUrl: './seccion-cifras.scss',
})
export class SeccionCifras {
  protected readonly cifras = CIFRAS;
  protected readonly procedencia = PROCEDENCIA_CIFRAS;
}
