import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { EstadoVacio } from '../../compartido/componentes/estado-vacio/estado-vacio';
import { Icono } from '../../compartido/componentes/icono/icono';
import { TarjetaProducto } from '../../compartido/componentes/tarjeta-producto/tarjeta-producto';
import { DisposicionServicio } from '../../compartido/disposicion/disposicion-servicio';
import { PesosPipe } from '../../compartido/formato/pesos-pipe';
import { CategoriaProducto } from '../../nucleo/modelos/comercio';
import { CarritoServicio } from '../../nucleo/servicios/carrito-servicio';
import {
  CATEGORIAS,
  ComercioServicio,
  ENVIO_GRATIS_DESDE_CENTAVOS,
} from '../../nucleo/servicios/comercio-servicio';

/** «Todo» mas las cuatro categorias del handoff. */
type FiltroCategoria = 'Todo' | CategoriaProducto;

/**
 * Tienda: filtros por categoria, rejilla de productos y llamada al flujo de regalo.
 *
 * <p>El carrito NO se dibuja aqui como columna fija. El handoff lo pinta al lado en
 * escritorio y como hoja inferior en movil, y las dos formas ya las resuelve el panel
 * lateral del shell: una segunda copia del carrito en esta pantalla seria una segunda
 * implementacion de las cantidades, el subtotal y el envio.
 */
@Component({
  selector: 'adr-tienda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Chip, EstadoVacio, Icono, PesosPipe, TarjetaProducto],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
})
export class Tienda {
  private readonly comercio = inject(ComercioServicio);
  private readonly router = inject(Router);

  protected readonly carrito = inject(CarritoServicio);
  protected readonly disposicion = inject(DisposicionServicio);

  private readonly productos = toSignal(this.comercio.productos(), { initialValue: [] });

  protected readonly categoria = signal<FiltroCategoria>('Todo');
  protected readonly categorias: readonly FiltroCategoria[] = ['Todo', ...CATEGORIAS];
  protected readonly envioGratisDesde = ENVIO_GRATIS_DESDE_CENTAVOS;

  protected readonly visibles = computed(() => {
    const elegida = this.categoria();
    return elegida === 'Todo'
      ? this.productos()
      : this.productos().filter((p) => p.categoria === elegida);
  });

  /**
   * Anade al carrito y ABRE el panel la primera vez.
   *
   * <p>Solo la primera: a partir de ahi la burbuja del icono ya da la respuesta, y abrir el
   * panel en cada toque taparia la rejilla justo cuando el alumno esta anadiendo varias
   * cosas seguidas.
   */
  protected anadir(productoId: string): void {
    const eraElPrimero = this.carrito.vacio();
    this.carrito.anadir(productoId);
    if (eraElPrimero) {
      this.disposicion.abrirCarrito();
    }
  }

  /** Lleva al flujo de regalo con el producto ya elegido. */
  protected regalar(productoId: string): void {
    void this.router.navigate(['/regalar'], { queryParams: { producto: productoId } });
  }
}
