import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icono } from '../componentes/icono/icono';
import { NAVEGACION_MOVIL } from './navegacion';

/**
 * Barra inferior de movil: cinco pestanias fijas.
 *
 * <p>Abajo y no arriba porque el pulgar llega. La mayoria del trafico entra desde YouTube en
 * celular (especificacion §14.1), y en un telefono grande la esquina superior izquierda
 * exige recolocar la mano.
 *
 * <p>El indicador de la pestania activa es una barra de 3 px ARRIBA, no el color del icono:
 * sobre la anchura de una pestania de 78 px un cambio de tinte se pierde, y ademas el color
 * no puede ser el unico portador de significado (docs/04 §5).
 */
@Component({
  selector: 'adr-nav-inferior',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono, RouterLink, RouterLinkActive],
  template: `
    <nav class="inferior" aria-label="Secciones de la academia">
      @for (entrada of entradas; track entrada.ruta) {
        <a
          class="inferior__pestania"
          [routerLink]="entrada.ruta"
          routerLinkActive="inferior__pestania--activa"
          #activo="routerLinkActive"
          [attr.aria-current]="activo.isActive ? 'page' : null"
        >
          <span class="inferior__indicador" aria-hidden="true"></span>
          <adr-icono [nombre]="entrada.icono" [tamanio]="20" />
          <span class="inferior__rotulo">{{ entrada.etiquetaCorta }}</span>
        </a>
      }
    </nav>
  `,
  styleUrl: './nav-inferior.scss',
})
export class NavInferior {
  protected readonly entradas = NAVEGACION_MOVIL;
}
