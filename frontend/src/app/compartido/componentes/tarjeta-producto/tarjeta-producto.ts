import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Producto } from '../../../nucleo/modelos/comercio';
import { PesosPipe } from '../../formato/pesos-pipe';
import { Boton } from '../boton/boton';
import { Etiqueta } from '../etiqueta/etiqueta';
import { Icono } from '../icono/icono';
import { MarcoImagen } from '../marco-imagen/marco-imagen';

/**
 * Tarjeta de producto de la tienda.
 *
 * <p>Dos acciones: anadir al carrito y regalar. La de regalo es un boton flotante sobre la
 * foto y no una tercera fila de texto — el handoff pide que cada producto se pueda regalar,
 * y en una rejilla de nueve tarjetas una accion secundaria con su propio boton grande deja
 * la pantalla sin jerarquia.
 *
 * <p>El boton principal cambia de rotulo cuando el producto ya esta en el carrito y muestra
 * cuantos hay. Sin eso, pulsar dos veces parece que no funciono y el alumno acaba con seis
 * acordeones en el carrito.
 */
@Component({
  selector: 'adr-tarjeta-producto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Etiqueta, Icono, MarcoImagen, PesosPipe],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.scss',
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();

  /** Cuantas unidades hay ya en el carrito. Cero cuando no esta. */
  readonly enCarrito = input(0);

  readonly anadido = output<void>();
  readonly regalado = output<void>();

  protected readonly rotuloAccion = computed(() =>
    this.enCarrito() > 0 ? `En el carrito · ${this.enCarrito()}` : 'Añadir al carrito',
  );

  /** La calificacion con coma decimal, que es como se escribe en Colombia. */
  protected readonly calificacion = computed(() =>
    this.producto().calificacion.toFixed(1).replace('.', ','),
  );
}
