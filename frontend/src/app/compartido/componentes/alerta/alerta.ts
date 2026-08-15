import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icono } from '../icono/icono';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';

export type TonoAlerta = 'informacion' | 'exito' | 'advertencia' | 'error';

const ICONOS: Record<TonoAlerta, NombreIcono> = {
  informacion: 'info',
  exito: 'check-circle',
  advertencia: 'warning-circle',
  error: 'x-circle',
};

/**
 * Aviso en linea dentro de una pantalla (docs/04 §3).
 *
 * <p>Siempre lleva icono ademas de color: el color por si solo no comunica nada a quien no
 * lo distingue, y en un movil a pleno sol tampoco al resto (docs/04 §5).
 *
 * <p>Las de error y advertencia se anuncian como `role="alert"` para que un lector de
 * pantalla las lea en cuanto aparecen, sin esperar a que el usuario navegue hasta ellas.
 */
@Component({
  selector: 'adr-alerta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <div [class]="clases()" [attr.role]="esUrgente() ? 'alert' : 'status'">
      <adr-icono [nombre]="icono()" [tamanio]="20" />
      <div class="adr-alerta__texto">
        @if (titulo()) {
          <p class="adr-alerta__titulo">{{ titulo() }}</p>
        }
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './alerta.scss',
})
export class Alerta {
  readonly tono = input<TonoAlerta>('informacion');
  readonly titulo = input('');

  protected readonly icono = computed(() => ICONOS[this.tono()]);
  protected readonly esUrgente = computed(
    () => this.tono() === 'error' || this.tono() === 'advertencia',
  );
  protected readonly clases = computed(() => `adr-alerta adr-alerta--${this.tono()}`);
}
