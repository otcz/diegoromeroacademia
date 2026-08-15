import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { Icono } from '../icono/icono';

/** Anchos permitidos (docs/04 §4). Nada intermedio: es lo que mantiene los modales alineados. */
export type AnchoModal = 'sm' | 'md' | 'lg';

let contadorModales = 0;

/**
 * Modal con anatomia fija: encabezado, cuerpo y pie (docs/04 §4).
 *
 * <p>Esta anatomia es el corazon de la regla 11. Los modales desalineados son el sintoma
 * mas visible de una interfaz construida por partes, y aparecen rapidisimo cuando cada
 * pantalla arma el suyo. Aqui la estructura no es negociable: la pantalla solo aporta
 * contenido y acciones.
 *
 * <p>Uso:
 * <pre>
 *   &lt;adr-modal [(abierto)]="confirmando" titulo="Cancelar suscripcion"&gt;
 *     &lt;p&gt;Perderas el acceso a los cursos incluidos en el plan.&lt;/p&gt;
 *     &lt;div pie&gt;...&lt;/div&gt;
 *   &lt;/adr-modal&gt;
 * </pre>
 *
 * <p>No cierra al hacer clic en el velo, de forma deliberada: un clic accidental fuera no
 * puede descartar un formulario a medio llenar. Se cierra con Esc o con el boton de cerrar.
 *
 * <p>Un modal nunca abre otro modal.
 */
@Component({
  selector: 'adr-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus, Icono],
  host: {
    '(document:keydown.escape)': 'cerrarPorTeclado()',
  },
  template: `
    @if (abierto()) {
      <div class="adr-modal__velo">
        <div
          [class]="clasesCaja()"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="idTitulo"
        >
          <header class="adr-modal__encabezado">
            <h2 class="adr-modal__titulo" [id]="idTitulo">{{ titulo() }}</h2>
            <button
              type="button"
              class="adr-modal__cerrar"
              aria-label="Cerrar"
              (click)="cerrar()"
            >
              <adr-icono nombre="x" [tamanio]="20" />
            </button>
          </header>

          <div class="adr-modal__cuerpo">
            <ng-content />
          </div>

          <footer class="adr-modal__pie">
            <ng-content select="[pie]" />
          </footer>
        </div>
      </div>
    }
  `,
  styleUrl: './modal.scss',
})
export class Modal {
  protected readonly idTitulo = `adr-modal-titulo-${contadorModales++}`;

  readonly abierto = model(false);
  readonly titulo = input.required<string>();
  readonly ancho = input<AnchoModal>('md');

  readonly cerrado = output<void>();

  protected readonly clasesCaja = computed(
    () => `adr-modal__caja adr-modal__caja--${this.ancho()}`,
  );

  /** Cierra el modal y avisa a quien lo abrio, para que pueda limpiar su estado. */
  cerrar(): void {
    this.abierto.set(false);
    this.cerrado.emit();
  }

  /**
   * Esc cierra el modal.
   *
   * <p>El escucha esta en `document` porque el foco puede estar en cualquier control de
   * dentro; se comprueba que este abierto para no emitir eventos cuando no hay nada que
   * cerrar.
   */
  protected cerrarPorTeclado(): void {
    if (this.abierto()) {
      this.cerrar();
    }
  }
}
