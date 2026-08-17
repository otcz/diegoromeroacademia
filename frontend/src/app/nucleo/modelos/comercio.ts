/**
 * Modelos de comercio: tienda, carrito, pedidos, planes, pagos y regalos.
 *
 * <p><b>El dinero se guarda en centavos y en entero.</b> Nunca en `number` con decimales:
 * 0,1 + 0,2 no da 0,3 en coma flotante, y un total de carrito que se desvia un peso es un
 * reclamo de soporte que nadie sabe reproducir. El formato con separadores lo pone la vista.
 */

export type CategoriaProducto = 'Acordeones' | 'Accesorios' | 'Material PDF' | 'Merch';

/** Producto de tienda. `digital` y `fisico` se comportan distinto pero viven en la misma tienda. */
export interface Producto {
  readonly id: string;
  readonly categoria: CategoriaProducto;
  readonly nombre: string;
  readonly precioCentavos: number;
  readonly calificacion: number;
  readonly resenias: number;
  /** Etiqueta flotante sobre la foto. Vacia cuando no hay nada que destacar. */
  readonly distintivo: string;
  readonly clase: 'digital' | 'fisico';
  readonly foto: string | null;
}

/** Linea del carrito ya resuelta contra el catalogo. La vista no vuelve a buscar el producto. */
export interface LineaCarrito {
  readonly producto: Producto;
  readonly cantidad: number;
  readonly subtotalCentavos: number;
}

/** Cuentas del carrito. Se calculan en un solo sitio para que no discrepen entre pantallas. */
export interface ResumenCarrito {
  readonly lineas: readonly LineaCarrito[];
  readonly articulos: number;
  readonly subtotalCentavos: number;
  readonly envioCentavos: number;
  readonly totalCentavos: number;
  readonly envioGratis: boolean;
}

export type EstadoPedido = 'preparando' | 'enviado' | 'entregado' | 'descargable';

export interface Pedido {
  readonly id: string;
  readonly referencia: string;
  readonly producto: string;
  readonly estado: EstadoPedido;
  readonly totalCentavos: number;
}

export type CicloPlan = 'mensual' | 'anual';

/** Plan de suscripcion. No confundir con `Producto` de tienda. */
export interface Plan {
  readonly id: string;
  readonly nombre: string;
  readonly mensualCentavos: number;
  readonly anualCentavos: number;
  readonly incluye: string;
  readonly destacado: boolean;
}

export type EstadoSuscripcion = 'activa' | 'porVencer' | 'vencida';

export interface Suscripcion {
  readonly planId: string;
  readonly plan: string;
  readonly estado: EstadoSuscripcion;
  readonly ciclo: CicloPlan;
  readonly precioCentavos: number;
  readonly proximoCobro: string;
  readonly diasRestantes: number;
  readonly medioPago: string;
  readonly incluye: string;
}

export interface Pago {
  readonly fecha: string;
  readonly concepto: string;
  readonly estado: 'pagado' | 'pendiente' | 'fallido';
  readonly montoCentavos: number;
}

export type TipoRegalo = 'Suscripción' | 'Bono de valor' | 'Producto de la tienda';
export type EntregaRegalo = 'Ahora mismo' | 'En una fecha' | 'La entrego yo';

export interface OpcionRegalo {
  readonly etiqueta: string;
  readonly precioCentavos: number;
}

/** Certificado emitido. No se pierde al vencer la suscripcion (no negociable 5). */
export interface Certificado {
  readonly id: string;
  readonly codigo: string;
  readonly curso: string;
  readonly estudiante: string;
  readonly fechaEmision: string;
  readonly totalClases: number;
  readonly horasPractica: number;
}
