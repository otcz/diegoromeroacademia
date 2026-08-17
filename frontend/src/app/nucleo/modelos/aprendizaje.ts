/**
 * Modelos de aprendizaje: cursos, clases, tutoriales y ejercicios.
 *
 * <p>Los nombres son los del lenguaje ubicuo de `docs/00-contexto.md §3`. Si un concepto
 * esta en esa tabla se llama asi aqui, en el JSON de la API y en la base de datos. Sin
 * sinonimos: «alumno», «estudiante» y «cliente» son la misma persona y solo una de las
 * tres es un nombre valido.
 */

/** Estado de una unidad secuencial. El desbloqueo real lo decide el backend (no negociable 4). */
export type EstadoAvance = 'completado' | 'enCurso' | 'bloqueado';

/** Curso: programa completo de un instrumento. Tiene `slug` para SEO. */
export interface Curso {
  readonly id: string;
  readonly slug: string;
  readonly nivel: number;
  readonly titulo: string;
  readonly resumen: string;
  readonly portada: string | null;
  readonly totalModulos: number;
  readonly totalClases: number;
  readonly estado: EstadoAvance;
  /** Porcentaje 0–100. Es de la INSCRIPCION, no del usuario (no negociable 6). */
  readonly avance: number;
  /** Que hacer si el curso esta bloqueado. Nulo cuando el plan ya lo incluye. */
  readonly motivoBloqueo: string | null;
}

/** Modulo: bloque tematico dentro de un nivel. Navegacion libre dentro del nivel. */
export interface Modulo {
  readonly id: string;
  readonly numero: number;
  readonly titulo: string;
  readonly detalle: string;
  readonly estado: EstadoAvance;
  readonly avance: number;
}

/** Recurso: adjunto de una clase. Distinto de `AccesoRecurso`, que decide quien lo ve. */
export interface Recurso {
  readonly id: string;
  readonly titulo: string;
  readonly detalle: string;
  readonly tipo: 'partitura' | 'pista' | 'diagrama' | 'ejercicio';
}

/** Marca de tiempo con nombre dentro del video. Permite saltar sin arrastrar la barra. */
export interface Capitulo {
  readonly segundo: number;
  readonly titulo: string;
}

export interface Comentario {
  readonly id: string;
  readonly autor: string;
  readonly iniciales: string;
  readonly esProfesor: boolean;
  readonly cuando: string;
  readonly segundo: number | null;
  readonly texto: string;
  readonly votos: number;
}

/** Entrada de la lista lateral del reproductor. */
export interface ItemLista {
  readonly id: string;
  readonly numero: number | null;
  readonly titulo: string;
  readonly detalle: string;
  readonly estado: EstadoAvance | 'viendo';
}

/**
 * Un evento de la pista de digitacion.
 *
 * <p>Es `SecuenciaPisada` del lenguaje ubicuo. **La direccion del fuelle es obligatoria**:
 * el mismo boton suena distinto abriendo que cerrando, asi que un paso sin direccion no
 * describe nada. Por eso no es opcional ni tiene valor por defecto.
 */
export interface PasoPisada {
  /** Segundo del video en que empieza el paso. */
  readonly segundo: number;
  /** Fila de pitos, 0 a 2. La numeracion humana (F1, F2, F3) la pone la vista. */
  readonly fila: number;
  /** Boton dentro de la fila, empezando en 0. */
  readonly boton: number;
  readonly direccion: 'abriendo' | 'cerrando';
  /** Bajo que acompana. Los tres del vallenato en afinacion Sol/Do. */
  readonly bajo: 'Sol' | 'Do' | 'Re';
}

/** Clase: unidad de video de un curso. */
export interface Clase {
  readonly id: string;
  readonly numero: number;
  readonly titulo: string;
  readonly cursoId: string;
  readonly cursoTitulo: string;
  readonly moduloTitulo: string;
  readonly duracionSegundos: number;
  readonly poster: string | null;
  readonly resumen: string;
  readonly tono: string;
  readonly bpm: number;
  readonly capitulos: readonly Capitulo[];
  readonly recursos: readonly Recurso[];
  readonly comentarios: readonly Comentario[];
  readonly lista: readonly ItemLista[];
  readonly avanceCurso: number;
  readonly totalClases: number;
  readonly pisadas: readonly PasoPisada[];
}

/** Tutorial: se compra una vez y es permanente (no negociable 5). */
export interface Tutorial {
  readonly id: string;
  readonly titulo: string;
  readonly resumen: string;
  readonly portada: string | null;
  readonly duracionSegundos: number;
  readonly totalPartes: number;
  readonly comprado: boolean;
  readonly nuevo: boolean;
  readonly avance: number;
  readonly precioCentavos: number;
  readonly partes: readonly ItemLista[];
  readonly recursos: readonly Recurso[];
  readonly pisadas: readonly PasoPisada[];
}

export type TipoEjercicio = 'Escalas' | 'Bajos' | 'Ritmos' | 'Velocidad';

/** Ejercicio: pieza practicable en el simulador. Tiene BPM original y afinacion. */
export interface Ejercicio {
  readonly id: string;
  readonly titulo: string;
  readonly tipo: TipoEjercicio;
  readonly nivel: number;
  readonly duracionSegundos: number;
  readonly bpmOriginal: number;
  readonly portada: string | null;
  readonly vecesPracticado: number;
  readonly pasos: readonly string[];
  readonly repeticionesObjetivo: number;
  readonly consejo: string;
  readonly pisadas: readonly PasoPisada[];
}

/** Reto semanal de la zona de ejercicios. */
export interface Reto {
  readonly titulo: string;
  readonly detalle: string;
  readonly avance: number;
  readonly ejercicioId: string;
}

/** Progreso por escala, para la columna lateral del ejercicio guiado. */
export interface AvanceEscala {
  readonly nombre: string;
  readonly etiqueta: string;
  readonly avance: number;
}
