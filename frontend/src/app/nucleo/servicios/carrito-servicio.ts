import { Injectable, computed, inject, signal } from '@angular/core';
import { LineaCarrito, Producto, ResumenCarrito } from '../modelos/comercio';
import { AlmacenLocal } from './almacen-local';
import {
  COSTO_ENVIO_CENTAVOS,
  ComercioServicio,
  ENVIO_GRATIS_DESDE_CENTAVOS,
} from './comercio-servicio';

/** Clave de persistencia del carrito. */
export const CLAVE_CARRITO = 'adr-carrito';

/** Lo unico que se guarda: identificador de producto y cantidad. */
type Contenido = Record<string, number>;

/**
 * Carrito de la tienda.
 *
 * <p><b>Se persiste, y esa es su razon de ser.</b> El trafico llega de YouTube en celular:
 * el alumno abre la tienda, se le cruza una llamada y vuelve media hora despues. Un carrito
 * que se vacia al recargar convierte cada interrupcion en una venta perdida.
 *
 * <p><b>Se guardan identificadores y cantidades, nunca precios.</b> Un precio guardado en el
 * navegador se queda congelado: el alumno volveria semanas despues viendo el importe viejo,
 * y ademas seria un valor que el cliente controla. Las lineas se resuelven contra el catalogo
 * en cada lectura, asi que el precio es siempre el vigente. El definitivo, de todas formas,
 * lo pone el backend al cobrar.
 *
 * <p>Los identificadores que ya no existen en el catalogo se descartan al resolver: un
 * producto retirado no puede dejar el carrito en un estado que la pantalla no sepa dibujar.
 */
@Injectable({ providedIn: 'root' })
export class CarritoServicio {
  private readonly almacen = inject(AlmacenLocal);
  private readonly comercio = inject(ComercioServicio);

  private readonly contenido = signal<Contenido>(
    this.almacen.leerObjeto<Contenido>(CLAVE_CARRITO, {}),
  );

  private readonly catalogo = signal<readonly Producto[]>([]);

  /** Cuentas del carrito, listas para dibujar. Se recalculan solas al cambiar el contenido. */
  readonly resumen = computed<ResumenCarrito>(() =>
    this.calcular(this.contenido(), this.catalogo()),
  );

  /** Numero de articulos, para la burbuja del icono de la barra superior. */
  readonly articulos = computed(() => this.resumen().articulos);

  readonly vacio = computed(() => this.articulos() === 0);

  constructor() {
    // El catalogo llega por el mismo puerto que usa la tienda. Sin el no se pueden resolver
    // las lineas, y con datos simulados responde en el acto.
    this.comercio.productos().subscribe((productos) => this.catalogo.set(productos));
  }

  /** Cuantas unidades de un producto hay. Cero si no esta. Lo pregunta la tarjeta. */
  cantidadDe(productoId: string): number {
    return this.contenido()[productoId] ?? 0;
  }

  /** Anade una unidad. */
  anadir(productoId: string): void {
    this.cambiar(productoId, 1);
  }

  /**
   * Suma o resta unidades.
   *
   * <p>Al llegar a cero la linea se BORRA en vez de quedarse en cero: una entrada con
   * cantidad cero es una linea fantasma que hay que filtrar en cada sitio que lea el carrito,
   * y basta olvidarlo una vez para que aparezca un producto vacio en el panel.
   */
  cambiar(productoId: string, delta: number): void {
    this.contenido.update((actual) => {
      const siguiente = { ...actual };
      const cantidad = (siguiente[productoId] ?? 0) + delta;
      if (cantidad <= 0) {
        delete siguiente[productoId];
      } else {
        siguiente[productoId] = cantidad;
      }
      return siguiente;
    });
    this.persistir();
  }

  /** Vacia el carrito. */
  vaciar(): void {
    this.contenido.set({});
    this.persistir();
  }

  private persistir(): void {
    this.almacen.escribirObjeto(CLAVE_CARRITO, this.contenido());
  }

  private calcular(contenido: Contenido, catalogo: readonly Producto[]): ResumenCarrito {
    const lineas: LineaCarrito[] = [];
    for (const producto of catalogo) {
      const cantidad = contenido[producto.id] ?? 0;
      if (cantidad > 0) {
        lineas.push({ producto, cantidad, subtotalCentavos: producto.precioCentavos * cantidad });
      }
    }

    const subtotalCentavos = lineas.reduce((suma, l) => suma + l.subtotalCentavos, 0);
    const articulos = lineas.reduce((suma, l) => suma + l.cantidad, 0);

    // Un carrito vacio no cobra envio. Sin esta condicion el panel vacio anunciaba $18.000
    // de envio sobre un total de cero, que es la clase de detalle que hace desconfiar.
    const envioGratis = subtotalCentavos === 0 || subtotalCentavos >= ENVIO_GRATIS_DESDE_CENTAVOS;
    const envioCentavos = envioGratis ? 0 : COSTO_ENVIO_CENTAVOS;

    return {
      lineas,
      articulos,
      subtotalCentavos,
      envioCentavos,
      totalCentavos: subtotalCentavos + envioCentavos,
      envioGratis,
    };
  }
}
