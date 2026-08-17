import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Cifra,
  ClaveNotificacion,
  ClaveReproduccion,
  FilaPreferencia,
  Idioma,
  Preferencias,
  PerfilEstudiante,
} from '../modelos/cuenta';
import { AlmacenLocal } from './almacen-local';

/** Clave de persistencia de las preferencias. */
export const CLAVE_PREFERENCIAS = 'adr-preferencias';

/**
 * Perfil del estudiante y sus preferencias.
 *
 * <p>El perfil sale de un adaptador simulado (`GET /yo` cuando exista). Las preferencias se
 * persisten en el navegador: son de la interfaz, se consultan en cada pantalla y esperar una
 * ida y vuelta al servidor para saber si el simulador arranca abierto haria parpadear el
 * reproductor en cada carga. Cuando exista el endpoint, el servidor manda y esto pasa a ser
 * la copia local que se sincroniza al entrar.
 */

const PERFIL: PerfilEstudiante = {
  nombre: 'Andrés',
  apellidos: 'Villa Restrepo',
  iniciales: 'AV',
  correo: 'andres.villa@correo.com',
  whatsapp: '+57 310 555 4218',
  ciudad: 'Valledupar, Cesar',
  instrumento: 'Hohner Corona III · Sol/Do',
  nivel: 'Intermedio',
  plan: 'Plan Intermedio',
  estadoPlan: 'activa',
  foto: null,
  estudianteDesde: 'mar 2026',
  racha: 5,
  certificados: 1,
  ingresoExterno: true,
};

const CIFRAS: readonly Cifra[] = [
  {
    rotulo: 'Lecciones vistas',
    valor: '31',
    complemento: '/ 74',
    icono: 'play-circle',
    tono: 'azul',
  },
  { rotulo: 'Racha', valor: '5', complemento: 'días', icono: 'fire', tono: 'dorado' },
  { rotulo: 'Práctica', valor: '14', complemento: 'h este mes', icono: 'clock', tono: 'morado' },
  {
    rotulo: 'Certificados',
    valor: '1',
    complemento: 'obtenido',
    icono: 'certificate',
    tono: 'verde',
  },
];

/** Niveles que el alumno puede declararse a si mismo en el perfil. */
export const NIVELES: readonly string[] = ['Principiante', 'Intermedio', 'Avanzado'];

export const IDIOMAS: readonly Idioma[] = ['Español', 'English', 'Português'];

/** Las cinco notificaciones del handoff, con su explicacion. */
export const FILAS_NOTIFICACION: readonly FilaPreferencia<ClaveNotificacion>[] = [
  {
    clave: 'clases',
    etiqueta: 'Clases nuevas',
    detalle: 'Cuando Diego publica una lección de tu nivel',
  },
  {
    clave: 'practica',
    etiqueta: 'Recordatorio de práctica',
    detalle: 'Un aviso al día si no has practicado',
  },
  {
    clave: 'vivo',
    etiqueta: 'Talleres en vivo',
    detalle: 'Antes de cada taller que incluye tu plan',
  },
  {
    clave: 'respuestas',
    etiqueta: 'Respuestas a mis comentarios',
    detalle: 'Cuando alguien contesta lo que preguntaste',
  },
  {
    clave: 'promociones',
    etiqueta: 'Promociones de la tienda',
    detalle: 'Descuentos en instrumentos y material',
  },
];

export const FILAS_REPRODUCCION: readonly FilaPreferencia<ClaveReproduccion>[] = [
  {
    clave: 'autoplay',
    etiqueta: 'Reproducir la siguiente clase',
    detalle: 'Al terminar una lección, sigue con la que va',
  },
  {
    clave: 'simulador',
    etiqueta: 'Simulador abierto por defecto',
    detalle: 'El diagrama de pisadas aparece al abrir el video',
  },
  {
    clave: 'altaCalidad',
    etiqueta: 'Máxima calidad siempre',
    detalle: 'Consume más datos. Desactívalo con red móvil',
  },
];

const PREFERENCIAS_POR_DEFECTO: Preferencias = {
  notificaciones: {
    clases: true,
    practica: true,
    vivo: true,
    respuestas: false,
    promociones: false,
  },
  idioma: 'Español',
  zonaHoraria: 'Bogotá (GMT−5)',
  subtitulos: 'Español (automáticos)',
  reproduccion: { autoplay: true, simulador: true, altaCalidad: false },
};

@Injectable({ providedIn: 'root' })
export class CuentaServicio {
  private readonly almacen = inject(AlmacenLocal);

  private readonly perfilActual = signal<PerfilEstudiante>(PERFIL);
  private readonly preferenciasActuales = signal<Preferencias>(this.leerPreferencias());

  readonly perfil = this.perfilActual.asReadonly();
  readonly preferencias = this.preferenciasActuales.asReadonly();

  /** Nombre completo, armado en un solo sitio para que nadie lo concatene a su manera. */
  readonly nombreCompleto = computed(() => `${this.perfil().nombre} ${this.perfil().apellidos}`);

  /** Cifras del panel de inicio. */
  cifras(): Observable<readonly Cifra[]> {
    return of(CIFRAS);
  }

  /** Cambia una notificacion y lo recuerda. */
  alternarNotificacion(clave: ClaveNotificacion): void {
    this.preferenciasActuales.update((p) => ({
      ...p,
      notificaciones: { ...p.notificaciones, [clave]: !p.notificaciones[clave] },
    }));
    this.persistir();
  }

  /** Cambia una preferencia de reproduccion y lo recuerda. */
  alternarReproduccion(clave: ClaveReproduccion): void {
    this.preferenciasActuales.update((p) => ({
      ...p,
      reproduccion: { ...p.reproduccion, [clave]: !p.reproduccion[clave] },
    }));
    this.persistir();
  }

  establecerIdioma(idioma: Idioma): void {
    this.preferenciasActuales.update((p) => ({ ...p, idioma }));
    this.persistir();
  }

  /** Nivel declarado por el alumno en su perfil. */
  establecerNivel(nivel: string): void {
    this.perfilActual.update((p) => ({ ...p, nivel }));
  }

  private persistir(): void {
    this.almacen.escribirObjeto(CLAVE_PREFERENCIAS, this.preferenciasActuales());
  }

  /**
   * Lee las preferencias guardadas mezcladas con las de por defecto.
   *
   * <p>La mezcla es obligatoria y no un detalle: el dia que se anada una preferencia nueva,
   * el objeto guardado de todos los alumnos existentes no la tendra. Sin mezcla llegaria
   * `undefined` a un interruptor, que se dibuja apagado y ademas no es lo que el alumno
   * eligio. Con mezcla, lo nuevo entra con su valor por defecto y lo viejo se respeta.
   */
  private leerPreferencias(): Preferencias {
    const guardadas = this.almacen.leerObjeto<Partial<Preferencias>>(CLAVE_PREFERENCIAS, {});
    return {
      ...PREFERENCIAS_POR_DEFECTO,
      ...guardadas,
      notificaciones: { ...PREFERENCIAS_POR_DEFECTO.notificaciones, ...guardadas.notificaciones },
      reproduccion: { ...PREFERENCIAS_POR_DEFECTO.reproduccion, ...guardadas.reproduccion },
    };
  }
}
