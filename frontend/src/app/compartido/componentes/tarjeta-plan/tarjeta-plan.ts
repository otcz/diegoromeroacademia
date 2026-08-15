import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Boton } from '../boton/boton';
import { Etiqueta } from '../etiqueta/etiqueta';

/**
 * Tarjeta de plan de suscripción (docs/04 §3).
 *
 * <p>La variante destacada reproduce el handoff al detalle: borde azul de 2 px, sombra azul
 * y etiqueta mango flotando a −13 px del borde superior. Es el plan que se quiere promover,
 * y la jerarquía visual tiene que decirlo sin que haga falta leer.
 *
 * <p>La etiqueta va en mango porque es un acento, no una acción. El botón del plan destacado
 * sí es azul rey: en toda la página, lo que se puede pulsar es azul (regla de color 1).
 */
@Component({
  selector: 'adr-tarjeta-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Etiqueta],
  template: `
    <article [class]="clases()">
      @if (recomendado()) {
        <div class="adr-plan__distintivo">
          <adr-etiqueta tinte="mango">{{ textoDistintivo() }}</adr-etiqueta>
        </div>
      }

      <h3 class="adr-plan__nombre">{{ nombre() }}</h3>

      <p class="adr-plan__precio">
        {{ precio() }}<span class="adr-plan__periodo">{{ periodicidad() }}</span>
      </p>

      <p class="adr-texto-secundario">{{ descripcion() }}</p>

      <adr-boton
        [variante]="recomendado() ? 'primario' : 'secundario'"
        [anchoCompleto]="true"
        [enlace]="enlace()"
      >
        {{ textoAccion() }}
      </adr-boton>
    </article>
  `,
  styleUrl: './tarjeta-plan.scss',
})
export class TarjetaPlan {
  readonly nombre = input.required<string>();
  readonly precio = input.required<string>();
  readonly descripcion = input.required<string>();
  readonly textoAccion = input.required<string>();
  readonly enlace = input.required<string>();

  /** Sufijo del importe: «/mes», «/año». Vacío en un pago único. */
  readonly periodicidad = input('');

  readonly recomendado = input(false);
  readonly textoDistintivo = input('Recomendado');

  protected readonly clases = computed(() =>
    this.recomendado() ? 'adr-plan adr-plan--recomendado' : 'adr-plan',
  );
}
