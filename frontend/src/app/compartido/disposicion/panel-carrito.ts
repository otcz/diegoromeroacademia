import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoServicio } from '../../nucleo/servicios/carrito-servicio';
import { Boton } from '../componentes/boton/boton';
import { EstadoVacio } from '../componentes/estado-vacio/estado-vacio';
import { Icono } from '../componentes/icono/icono';
import { LineaCarritoComponente } from '../componentes/linea-carrito/linea-carrito';
import { PesosPipe } from '../formato/pesos-pipe';
import { DisposicionServicio } from './disposicion-servicio';

/**
 * Panel lateral del carrito (384 px, con velo).
 *
 * <p>Anatomia de tres zonas de `docs/04 §4`: cabecera, cuerpo con desplazamiento y pie
 * pegado abajo con las cuentas. El pie NO se desplaza con la lista: el total es la
 * informacion que decide la compra y tiene que estar visible con el carrito lleno.
 *
 * <p>Cierra con `Esc` y con clic en el velo. El velo es un `<button>` de verdad y no un
 * `<div>` con `click`: asi entra en el orden de tabulacion y se puede cerrar sin raton.
 */
@Component({
  selector: 'adr-panel-carrito',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, EstadoVacio, Icono, LineaCarritoComponente, PesosPipe],
  templateUrl: './panel-carrito.html',
  styleUrl: './panel-carrito.scss',
  host: { '(document:keydown.escape)': 'cerrar()' },
})
export class PanelCarrito {
  private readonly router = inject(Router);

  protected readonly disposicion = inject(DisposicionServicio);
  protected readonly carrito = inject(CarritoServicio);

  protected cerrar(): void {
    this.disposicion.cerrarCarrito();
  }

  /** Cierra el panel y lleva a la tienda. Las dos cosas: dejarlo abierto taparia el catalogo. */
  protected irATienda(): void {
    this.cerrar();
    void this.router.navigate(['/tienda']);
  }
}
