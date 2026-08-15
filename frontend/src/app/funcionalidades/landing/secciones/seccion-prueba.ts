import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CitaVerificada } from '../../../compartido/componentes/cita-verificada/cita-verificada';
import { COMENTARIOS } from '../landing.contenido';

/**
 * Prueba pública, con guarda.
 *
 * <p>Si no hay comentarios reales capturados del canal, <b>la sección no se dibuja</b>.
 * Mejor ausente que fabricada: publicar una cita de alumno inventada sobre la marca personal
 * de una persona real es un problema legal y reputacional, y además el visitante descuenta
 * la prueba social que huele a escrita por la casa.
 */
@Component({
  selector: 'adr-seccion-prueba',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CitaVerificada],
  template: `
    @if (comentarios.length > 0) {
      <section class="adr-seccion">
        <div class="adr-contenedor">
          <p class="adr-kicker adr-kicker--azul">En el canal</p>
          <h2 class="adr-titulo-seccion">Lo que dicen sus alumnos.</h2>

          <div class="prueba__rejilla">
            @for (comentario of comentarios; track comentario.clave) {
              <adr-cita-verificada
                [cita]="comentario.cita"
                [autor]="comentario.autor"
                [enlaceFuente]="comentario.enlace"
              />
            }
          </div>

          <p class="adr-nota">Comentarios públicos del canal, sin editar.</p>
        </div>
      </section>
    }
  `,
  styleUrl: './seccion-prueba.scss',
})
export class SeccionPrueba {
  protected readonly comentarios = COMENTARIOS;
}
