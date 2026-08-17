import { EstadoSuscripcion } from './comercio';

/** Modelos de la cuenta del estudiante: perfil, cifras del panel y preferencias. */

/** Lo que la barra superior y el panel necesitan saber del estudiante en cada pantalla. */
export interface PerfilEstudiante {
  readonly nombre: string;
  readonly apellidos: string;
  readonly iniciales: string;
  readonly correo: string;
  readonly whatsapp: string;
  readonly ciudad: string;
  readonly instrumento: string;
  readonly nivel: string;
  readonly plan: string;
  readonly estadoPlan: EstadoSuscripcion;
  readonly foto: string | null;
  readonly estudianteDesde: string;
  readonly racha: number;
  readonly certificados: number;
  /** Cierto cuando la sesion se abrio con un proveedor externo. Cambia lo que ofrece Seguridad. */
  readonly ingresoExterno: boolean;
}

/** Mosaico de cifra del panel de inicio. */
export interface Cifra {
  readonly rotulo: string;
  readonly valor: string;
  readonly complemento: string;
  readonly icono: string;
  readonly tono: 'azul' | 'dorado' | 'morado' | 'verde';
}

/**
 * Preferencias del alumno.
 *
 * <p>Se guardan como un objeto plano y no como campos sueltos porque se persisten juntas y
 * el dia que haya endpoint viajan juntas: separarlas obligaria a cinco llamadas donde basta
 * una, y a cinco formas distintas de fallar a medias.
 */
export interface Preferencias {
  readonly notificaciones: Record<ClaveNotificacion, boolean>;
  readonly idioma: Idioma;
  readonly zonaHoraria: string;
  readonly subtitulos: string;
  readonly reproduccion: Record<ClaveReproduccion, boolean>;
}

export type ClaveNotificacion = 'clases' | 'practica' | 'vivo' | 'respuestas' | 'promociones';
export type ClaveReproduccion = 'autoplay' | 'simulador' | 'altaCalidad';
export type Idioma = 'Español' | 'English' | 'Português';

/** Fila de interruptor. La etiqueta vive con el dato para que Ajustes no la escriba a mano. */
export interface FilaPreferencia<C extends string> {
  readonly clave: C;
  readonly etiqueta: string;
  readonly detalle: string;
}
