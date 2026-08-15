import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import { Icono } from '../icono/icono';

/**
 * Testimonio con procedencia comprobable (docs/04 §3).
 *
 * <p>Un testimonio sin fuente es publicidad; con enlace a un comentario público, es prueba.
 * Por eso `enlaceFuente` es obligatorio: si no hay dónde comprobarlo, el testimonio no se
 * publica. Es la diferencia entre la sección de alumnos y una consigna.
 *
 * <p>El avatar degrada a iniciales, así que un comentario de YouTube no obliga a conseguir
 * el retrato de nadie ni a usarlo sin permiso.
 */
@Component({
  selector: 'adr-cita-verificada',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Icono],
  template: `
    <figure class="adr-cita">
      <blockquote class="adr-cita__texto">{{ cita() }}</blockquote>

      <figcaption class="adr-cita__pie">
        <adr-avatar [nombre]="autor()" [tamanio]="40" />

        <div class="adr-cita__identidad">
          <p class="adr-cita__autor">{{ autor() }}</p>
          <a
            class="adr-cita__fuente"
            [href]="enlaceFuente()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <adr-icono nombre="seal-check" [tamanio]="16" />
            <span>{{ textoSello() }}</span>
          </a>
        </div>
      </figcaption>
    </figure>
  `,
  styleUrl: './cita-verificada.scss',
})
export class CitaVerificada {
  readonly cita = input.required<string>();
  readonly autor = input.required<string>();

  /** Dónde se comprueba. Obligatorio: sin fuente, el testimonio no se publica. */
  readonly enlaceFuente = input.required<string>();

  readonly textoSello = input('Comentario público en YouTube');
}
