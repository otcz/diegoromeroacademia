import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Icono } from '../../compartido/componentes/icono/icono';
import { PesosPipe } from '../../compartido/formato/pesos-pipe';
import { CicloPlan, EstadoSuscripcion } from '../../nucleo/modelos/comercio';
import { ComercioServicio } from '../../nucleo/servicios/comercio-servicio';

/**
 * Mi suscripcion: estado, cambio de plan y historial de pagos.
 *
 * <p>El interruptor mensual/anual recalcula los tres precios a la vez. El anual equivale a
 * diez mensualidades y ese dato sale del propio plan, no de una multiplicacion en la vista:
 * un descuento calculado en el front y otro cobrado en la pasarela es la peor discrepancia
 * posible de todas las que puede tener una pantalla de pago.
 */
@Component({
  selector: 'adr-suscripcion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Chip, Icono, PesosPipe, RouterLink],
  templateUrl: './suscripcion.html',
  styleUrl: './suscripcion.scss',
})
export class SuscripcionPantalla {
  private readonly comercio = inject(ComercioServicio);

  protected readonly suscripcion = toSignal(this.comercio.suscripcion(), { initialValue: null });
  protected readonly planes = toSignal(this.comercio.planes(), { initialValue: [] });
  protected readonly pagos = toSignal(this.comercio.pagos(), { initialValue: [] });

  protected readonly ciclo = signal<CicloPlan>('mensual');

  protected readonly ciclos: readonly { clave: CicloPlan; etiqueta: string }[] = [
    { clave: 'mensual', etiqueta: 'Mensual' },
    { clave: 'anual', etiqueta: 'Anual · 2 meses gratis' },
  ];

  protected readonly rotuloEstado: Record<EstadoSuscripcion, string> = {
    activa: 'Activa',
    porVencer: 'Vence pronto',
    vencida: 'Vencida',
  };

  /**
   * Llamada a la accion principal, que depende del estado.
   *
   * <p>Con la suscripcion activa no hay nada que pagar y ofrecer «Pagar ahora» invita a un
   * cobro doble; con la vencida, renovar es lo unico que importa en la pantalla.
   */
  protected readonly accionPrincipal = computed(() => {
    switch (this.suscripcion()?.estado) {
      case 'vencida':
        return 'Renovar ahora';
      case 'porVencer':
        return 'Pagar ahora';
      default:
        return 'Cambiar medio de pago';
    }
  });

  /** Precio del plan segun el ciclo elegido. */
  protected precioDe(plan: { mensualCentavos: number; anualCentavos: number }): number {
    return this.ciclo() === 'mensual' ? plan.mensualCentavos : plan.anualCentavos;
  }

  protected periodo(): string {
    return this.ciclo() === 'mensual' ? '/ mes' : '/ año';
  }
}
