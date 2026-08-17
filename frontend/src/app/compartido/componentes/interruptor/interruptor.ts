import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Interruptor de encendido y apagado.
 *
 * <p>Lo usan Ajustes (cinco notificaciones y tres de reproduccion) y el perfil (verificacion
 * en dos pasos). Es un `<button>` con `role="switch"`: `role` y `aria-checked` son lo que
 * hace que un lector de pantalla lo anuncie como «activado» o «desactivado» en vez de como
 * un boton cualquiera, y son obligatorios — sin ellos el control existe pero no se entiende.
 *
 * <p>La etiqueta la pone quien lo usa, porque siempre esta al lado y repetirla dentro haria
 * que se leyera dos veces. Por eso `etiqueta` es obligatoria: sirve de `aria-label` y no hay
 * forma de dibujar este control sin nombre.
 */
@Component({
  selector: 'adr-interruptor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      class="interruptor"
      [class.interruptor--activo]="activo()"
      [attr.aria-checked]="activo()"
      [attr.aria-label]="etiqueta()"
      (click)="alternado.emit()"
    >
      <span class="interruptor__perilla"></span>
    </button>
  `,
  styleUrl: './interruptor.scss',
})
export class Interruptor {
  readonly activo = input(false);
  readonly etiqueta = input.required<string>();
  readonly alternado = output<void>();
}
