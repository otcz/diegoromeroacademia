import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CategoriaProducto,
  Certificado,
  OpcionRegalo,
  Pago,
  Pedido,
  Plan,
  Producto,
  Suscripcion,
} from '../modelos/comercio';

/**
 * Tienda, planes, pagos y regalos.
 *
 * <p>Adaptador con datos simulados. Endpoints previstos: `GET /productos`, `POST /pedidos`,
 * `GET /suscripcion`, `POST /suscripcion/cambio`, `GET /facturas`, `POST /regalos`.
 *
 * <p><b>Lo que este servicio NO hace y no hara: cobrar.</b> El webhook de la pasarela es la
 * unica fuente de verdad del pago (no negociable 3), y el stock se valida antes de cobrar
 * (no negociable 7). Los dos son del backend. Aqui solo se lee el catalogo.
 */

/** Categorias de la tienda, en el orden en que salen los filtros. «Todo» es el estado inicial. */
export const CATEGORIAS: readonly CategoriaProducto[] = [
  'Acordeones',
  'Accesorios',
  'Material PDF',
  'Merch',
];

/**
 * Umbral de envio gratis y costo del envio, en centavos.
 *
 * <p>Regla 4: ningun valor de negocio escrito dentro de un componente. Estan aqui, exportados
 * y con nombre, para que la tarjeta del producto, el panel del carrito y la pantalla de la
 * tienda muestren los tres el mismo numero.
 *
 * <p>CONDICION DE SALIDA: pasan a configuracion del backend cuando exista el modulo
 * `comercio`. El alcance geografico del envio es la decision pendiente 8 de `docs/00 §5`.
 */
export const ENVIO_GRATIS_DESDE_CENTAVOS = 30_000_000;
export const COSTO_ENVIO_CENTAVOS = 1_800_000;

const PRODUCTOS: readonly Producto[] = [
  {
    id: 'ac1',
    categoria: 'Acordeones',
    nombre: 'Hohner Corona III 31 botones',
    precioCentavos: 485_000_000,
    calificacion: 4.9,
    resenias: 32,
    distintivo: 'Recomendado',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'ac2',
    categoria: 'Acordeones',
    nombre: 'Hohner Panther Sol/Do',
    precioCentavos: 239_000_000,
    calificacion: 4.7,
    resenias: 18,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'ax1',
    categoria: 'Accesorios',
    nombre: 'Correas de cuero DR',
    precioCentavos: 12_000_000,
    calificacion: 4.8,
    resenias: 15,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'ax2',
    categoria: 'Accesorios',
    nombre: 'Estuche rígido acolchado',
    precioCentavos: 28_000_000,
    calificacion: 4.6,
    resenias: 9,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'ax3',
    categoria: 'Accesorios',
    nombre: 'Kit de afinación y limpieza',
    precioCentavos: 9_500_000,
    calificacion: 4.5,
    resenias: 22,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'pd1',
    categoria: 'Material PDF',
    nombre: 'Pack de partituras vallenatas',
    precioCentavos: 3_200_000,
    calificacion: 4.7,
    resenias: 58,
    distintivo: 'Descarga inmediata',
    clase: 'digital',
    foto: null,
  },
  {
    id: 'pd2',
    categoria: 'Material PDF',
    nombre: 'Método DR — libro digital',
    precioCentavos: 5_800_000,
    calificacion: 5,
    resenias: 41,
    distintivo: 'Descarga inmediata',
    clase: 'digital',
    foto: null,
  },
  {
    id: 'mr1',
    categoria: 'Merch',
    nombre: 'Camiseta Estudio DR',
    precioCentavos: 7_500_000,
    calificacion: 4.8,
    resenias: 27,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
  {
    id: 'mr2',
    categoria: 'Merch',
    nombre: 'Gorra vallenata bordada',
    precioCentavos: 5_500_000,
    calificacion: 4.6,
    resenias: 12,
    distintivo: '',
    clase: 'fisico',
    foto: null,
  },
];

/**
 * Planes de suscripcion.
 *
 * <p>El precio anual equivale a **diez** mensualidades: es la promesa que hace el interruptor
 * mensual/anual del handoff. No se calcula en la vista para que no puedan discrepar.
 *
 * <p>Los precios son PROVISIONALES — decision pendiente 2 de `docs/00 §5`, la toma Diego.
 */
const PLANES: readonly Plan[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    mensualCentavos: 3_490_000,
    anualCentavos: 34_900_000,
    incluye: 'Nivel 1 completo y zona de ejercicios',
    destacado: false,
  },
  {
    id: 'intermedio',
    nombre: 'Intermedio',
    mensualCentavos: 5_990_000,
    anualCentavos: 59_900_000,
    incluye: 'Niveles 1 y 2, talleres en vivo y certificados',
    destacado: true,
  },
  {
    id: 'avanzado',
    nombre: 'Avanzado',
    mensualCentavos: 8_990_000,
    anualCentavos: 89_900_000,
    incluye: 'Los tres niveles, clase 1 a 1 al mes y 10 % en tienda',
    destacado: false,
  },
];

const SUSCRIPCION: Suscripcion = {
  planId: 'intermedio',
  plan: 'Intermedio',
  estado: 'activa',
  ciclo: 'mensual',
  precioCentavos: 5_990_000,
  proximoCobro: '12 sep 2026',
  diasRestantes: 27,
  medioPago: 'Visa ···· 4218',
  incluye: 'Niveles 1 y 2 · 74 clases · 2 talleres al mes',
};

const PEDIDOS: readonly Pedido[] = [
  {
    id: 'o1',
    referencia: '#1042',
    producto: 'Correas de cuero DR',
    estado: 'entregado',
    totalCentavos: 12_000_000,
  },
  {
    id: 'o2',
    referencia: '#1051',
    producto: 'Método DR — libro físico',
    estado: 'enviado',
    totalCentavos: 8_500_000,
  },
  {
    id: 'o3',
    referencia: '#1063',
    producto: 'Pack de partituras (PDF)',
    estado: 'descargable',
    totalCentavos: 3_200_000,
  },
];

const PAGOS: readonly Pago[] = [
  { fecha: '12 ago 2026', concepto: 'Intermedio', estado: 'pagado', montoCentavos: 5_990_000 },
  { fecha: '12 jul 2026', concepto: 'Intermedio', estado: 'pagado', montoCentavos: 5_990_000 },
  { fecha: '12 jun 2026', concepto: 'Básico · PSE', estado: 'pagado', montoCentavos: 3_490_000 },
];

const REGALOS_SUSCRIPCION: readonly OpcionRegalo[] = [
  { etiqueta: '1 mes de Intermedio', precioCentavos: 5_990_000 },
  { etiqueta: '3 meses de Intermedio', precioCentavos: 16_990_000 },
  { etiqueta: '6 meses de Intermedio', precioCentavos: 31_990_000 },
  { etiqueta: '1 año de Intermedio', precioCentavos: 59_900_000 },
];

const REGALOS_BONO: readonly OpcionRegalo[] = [
  { etiqueta: 'Bono $50.000', precioCentavos: 5_000_000 },
  { etiqueta: 'Bono $100.000', precioCentavos: 10_000_000 },
  { etiqueta: 'Bono $200.000', precioCentavos: 20_000_000 },
];

const CERTIFICADO: Certificado = {
  id: 'cert1',
  codigo: 'DR-2026-00418',
  curso: 'Nivel 1 · Fundamentos del acordeón vallenato',
  estudiante: 'Andrés Villa Restrepo',
  fechaEmision: '2 de agosto de 2026',
  totalClases: 38,
  horasPractica: 24,
};

@Injectable({ providedIn: 'root' })
export class ComercioServicio {
  productos(): Observable<readonly Producto[]> {
    return of(PRODUCTOS);
  }

  planes(): Observable<readonly Plan[]> {
    return of(PLANES);
  }

  suscripcion(): Observable<Suscripcion> {
    return of(SUSCRIPCION);
  }

  pedidos(): Observable<readonly Pedido[]> {
    return of(PEDIDOS);
  }

  pagos(): Observable<readonly Pago[]> {
    return of(PAGOS);
  }

  /**
   * Opciones de regalo segun el tipo elegido.
   *
   * <p>Los productos de la tienda entran como opcion de regalo con su mismo precio: regalar
   * un acordeon y comprarlo cuestan lo mismo, y descubrir lo contrario al llegar al pago es
   * de las cosas que hacen abandonar un carrito.
   */
  opcionesDeRegalo(
    tipo: 'Suscripción' | 'Bono de valor' | 'Producto de la tienda',
  ): readonly OpcionRegalo[] {
    if (tipo === 'Suscripción') {
      return REGALOS_SUSCRIPCION;
    }
    if (tipo === 'Bono de valor') {
      return REGALOS_BONO;
    }
    return PRODUCTOS.map((p) => ({ etiqueta: p.nombre, precioCentavos: p.precioCentavos }));
  }

  certificado(_id: string): Observable<Certificado> {
    return of(CERTIFICADO);
  }
}
