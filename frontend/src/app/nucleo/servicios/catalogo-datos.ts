import { ACTIVOS } from '../../disenio/activos';
import { Clase, Curso, ItemLista, Modulo, PasoPisada, Tutorial } from '../modelos/aprendizaje';

/**
 * Datos simulados del catalogo de aprendizaje.
 *
 * <p><b>Este archivo entero desaparece cuando exista el backend.</b> Vive aparte del adaptador
 * a proposito: el servicio es la pieza que se queda —su firma es el puerto que consumen las
 * pantallas— y esto es relleno de prototipo. Mezclados en un archivo, el dia del cambio habria
 * que separar a mano lo que se borra de lo que se conserva, con el riesgo de llevarse por
 * delante un metodo. Separados, se borra el archivo y se cambian los cuerpos.
 *
 * <p>Se separaron el 2026-08-16, cuando el archivo unico paso de 400 lineas al anadir
 * tutoriales comprados a la coleccion del alumno.
 */

/**
 * Pista de digitacion de ejemplo.
 *
 * <p>Es el patron del prototipo: ocho pasos que se repiten en bucle. En produccion cada
 * leccion trae la suya, generada por el profesor con el editor interno — que es alcance de
 * la fase 3 y no un extra, porque cargarlas a mano no escala (riesgo vivo de `docs/00 §7`).
 *
 * <p>Los segundos van cada dos tercios: el prototipo avanza ~1,5 pasos por segundo a 1x.
 */
export const PISADAS_EJEMPLO: readonly PasoPisada[] = [
  { segundo: 0, fila: 1, boton: 5, direccion: 'abriendo', bajo: 'Sol' },
  { segundo: 0.67, fila: 1, boton: 6, direccion: 'cerrando', bajo: 'Sol' },
  { segundo: 1.33, fila: 2, boton: 4, direccion: 'abriendo', bajo: 'Do' },
  { segundo: 2, fila: 1, boton: 7, direccion: 'cerrando', bajo: 'Do' },
  { segundo: 2.67, fila: 0, boton: 3, direccion: 'abriendo', bajo: 'Re' },
  { segundo: 3.33, fila: 1, boton: 8, direccion: 'cerrando', bajo: 'Re' },
  { segundo: 4, fila: 2, boton: 5, direccion: 'abriendo', bajo: 'Sol' },
  { segundo: 4.67, fila: 1, boton: 4, direccion: 'cerrando', bajo: 'Sol' },
];

export const CURSOS: readonly Curso[] = [
  {
    id: 'c1',
    slug: 'fundamentos-del-acordeon',
    nivel: 1,
    titulo: 'Fundamentos del acordeón',
    resumen: 'Postura, fuelle, primeras escalas y el ritmo de paseo.',
    portada: ACTIVOS.cursoCompleto,
    totalModulos: 12,
    totalClases: 38,
    estado: 'completado',
    avance: 100,
    motivoBloqueo: null,
  },
  {
    id: 'c2',
    slug: 'nivel-intermedio',
    nivel: 2,
    titulo: 'Nivel Intermedio',
    resumen: 'Bajos, acordes mayores y acompañamiento completo.',
    portada: ACTIVOS.diegoTocando,
    totalModulos: 12,
    totalClases: 74,
    estado: 'enCurso',
    avance: 42,
    motivoBloqueo: null,
  },
  {
    id: 'c3',
    slug: 'nivel-avanzado',
    nivel: 3,
    titulo: 'Nivel Avanzado',
    resumen: 'Punteo, adornos y repertorio en vivo.',
    portada: ACTIVOS.practicaBotonadura,
    totalModulos: 14,
    totalClases: 86,
    estado: 'bloqueado',
    avance: 0,
    motivoBloqueo: 'Disponible en el Plan Avanzado',
  },
];

export const MODULOS: readonly Modulo[] = [
  {
    id: 'm3',
    numero: 3,
    titulo: 'Ritmo de paseo',
    detalle: '8 lecciones completadas',
    estado: 'completado',
    avance: 100,
  },
  {
    id: 'm4',
    numero: 4,
    titulo: 'Bajos y acordes',
    detalle: 'Lección 7 de 9 — en curso',
    estado: 'enCurso',
    avance: 72,
  },
  {
    id: 'm5',
    numero: 5,
    titulo: 'Punteo melódico',
    detalle: 'Se abre al terminar el módulo 4',
    estado: 'bloqueado',
    avance: 0,
  },
];

export const LISTA_CLASE: readonly ItemLista[] = [
  {
    id: 'l6',
    numero: 6,
    titulo: 'Fuelle y respiración',
    detalle: 'Completada',
    estado: 'completado',
  },
  {
    id: 'l7',
    numero: 7,
    titulo: 'Bajos y acordes mayores',
    detalle: 'Viendo ahora',
    estado: 'viendo',
  },
  {
    id: 'l8',
    numero: 8,
    titulo: 'Cambios de acorde en paseo',
    detalle: '14:05 · sigue',
    estado: 'enCurso',
  },
  {
    id: 'l9',
    numero: 9,
    titulo: 'Práctica guiada del módulo',
    detalle: '21:30',
    estado: 'enCurso',
  },
  {
    id: 'm5',
    numero: null,
    titulo: 'Módulo 5 · Punteo melódico',
    detalle: 'Se abre al terminar',
    estado: 'bloqueado',
  },
];

export const CLASE: Clase = {
  id: 'l7',
  numero: 7,
  titulo: 'Bajos y acordes mayores',
  cursoId: 'c2',
  cursoTitulo: 'Nivel Intermedio',
  moduloTitulo: 'Módulo 4',
  duracionSegundos: 1122,
  poster: ACTIVOS.diegoTocando,
  resumen:
    'En esta lección armamos el acompañamiento completo de un paseo en tono de Sol: primero el bajo marcando el tiempo fuerte, luego el acorde en la fila 2 y por último el enlace hacia Do. Practica lento hasta que el cambio suene parejo.',
  tono: 'Sol',
  bpm: 90,
  capitulos: [
    { segundo: 0, titulo: 'Repaso del ritmo de paseo' },
    { segundo: 250, titulo: 'Bajo de Sol con el pie marcando' },
    { segundo: 575, titulo: 'Acorde mayor en la fila 2' },
    { segundo: 860, titulo: 'Enlace Sol → Do y cierre' },
  ],
  recursos: [
    { id: 'r1', titulo: 'Partitura de la lección', detalle: 'PDF · 2 páginas', tipo: 'partitura' },
    { id: 'r2', titulo: 'Pista de acompañamiento', detalle: 'MP3 · 90 BPM', tipo: 'pista' },
    { id: 'r3', titulo: 'Diagrama de pisadas', detalle: 'PNG · filas 1 a 3', tipo: 'diagrama' },
    {
      id: 'r4',
      titulo: 'Ejercicio guiado',
      detalle: 'Practica esta lección con metrónomo',
      tipo: 'ejercicio',
    },
  ],
  comentarios: [
    {
      id: 'k1',
      autor: 'María Camila R.',
      iniciales: 'MC',
      esProfesor: false,
      cuando: 'Hace 2 días',
      segundo: 372,
      texto:
        'El truco de marcar el bajo con el pie me ayudó muchísimo. Al bajar la velocidad a 0.75x por fin me salió el acorde de Sol.',
      votos: 24,
    },
    {
      id: 'k2',
      autor: 'Jorge Daniel P.',
      iniciales: 'JD',
      esProfesor: false,
      cuando: 'Hace 4 días',
      segundo: 700,
      texto:
        'Con el simulador de pisadas entendí que estaba usando la fila 3 cuando iba la 2. Gran herramienta.',
      votos: 17,
    },
    {
      id: 'k3',
      autor: 'Diego Romero',
      iniciales: 'DR',
      esProfesor: true,
      cuando: 'Hace 4 días',
      segundo: null,
      texto: 'Muy bien, Jorge. Repite el ejercicio a 0.5x tres veces antes de subir a 1x.',
      votos: 41,
    },
  ],
  lista: LISTA_CLASE,
  avanceCurso: 42,
  totalClases: 74,
  pisadas: PISADAS_EJEMPLO,
};

export const TUTORIALES: readonly Tutorial[] = [
  {
    id: 't1',
    titulo: 'La gota fría — nota a nota',
    resumen:
      'Desarmamos «La gota fría» compás por compás: intro, primera y segunda parte, y el punteo final. Cada parte trae la digitación exacta y el bajo que la acompaña.',
    portada: ACTIVOS.laGotaFria,
    duracionSegundos: 2520,
    totalPartes: 4,
    comprado: true,
    nuevo: false,
    avance: 65,
    precioCentavos: 3_490_000,
    partes: [
      {
        id: 'p1',
        numero: 1,
        titulo: 'Intro y afinación',
        detalle: '08:10 · vista',
        estado: 'completado',
      },
      {
        id: 'p2',
        numero: 2,
        titulo: 'Primera parte',
        detalle: '11:25 · vista',
        estado: 'completado',
      },
      {
        id: 'p3',
        numero: 3,
        titulo: 'Segunda parte y bajos',
        detalle: 'Viendo ahora',
        estado: 'viendo',
      },
      { id: 'p4', numero: 4, titulo: 'Punteo final', detalle: '09:40', estado: 'enCurso' },
    ],
    recursos: [
      {
        id: 'tr1',
        titulo: 'Partitura completa (PDF)',
        detalle: 'PDF · 6 páginas',
        tipo: 'partitura',
      },
      { id: 'tr2', titulo: 'Pista sin acordeón', detalle: 'MP3 · 100 BPM', tipo: 'pista' },
    ],
    pisadas: PISADAS_EJEMPLO,
  },
  {
    id: 't2',
    titulo: 'Afinación y mantenimiento',
    resumen: 'Cómo revisar lengüetas, limpiar el fuelle y afinar sin dañar el instrumento.',
    portada: ACTIVOS.practicaBotonadura,
    duracionSegundos: 1680,
    totalPartes: 1,
    comprado: true,
    nuevo: false,
    avance: 100,
    precioCentavos: 2_800_000,
    partes: [
      {
        id: 'p1',
        numero: 1,
        titulo: 'Sesión completa',
        detalle: '28:00 · vista',
        estado: 'completado',
      },
    ],
    recursos: [
      { id: 'tr3', titulo: 'Guía de mantenimiento', detalle: 'PDF · 4 páginas', tipo: 'partitura' },
    ],
    pisadas: PISADAS_EJEMPLO,
  },
  {
    id: 't3',
    titulo: 'Puntéos vallenatos clásicos',
    resumen: 'Seis punteos que aparecen en casi todo el repertorio, con su digitación.',
    portada: ACTIVOS.losCaminosDeLaVida,
    duracionSegundos: 3300,
    totalPartes: 6,
    comprado: false,
    nuevo: true,
    avance: 0,
    precioCentavos: 5_200_000,
    partes: [],
    recursos: [],
    pisadas: PISADAS_EJEMPLO,
  },
  // Los tres siguientes son colección del alumno y existen para que el carrusel de Inicio se
  // vea DESPLAZÁNDOSE en la demostración: con dos tarjetas cabía todo y el comportamiento
  // —que es justo lo que hay que revisar— no se podía enseñar. Salen con el resto de datos
  // simulados el día que responda `GET /tutoriales`.
  {
    id: 't7',
    titulo: 'Bajos del paseo',
    resumen: 'El acompañamiento de bajos del paseo, tempo a tempo, hasta soltarlo sin pensar.',
    portada: ACTIVOS.cursoCompleto,
    duracionSegundos: 2040,
    totalPartes: 3,
    comprado: true,
    nuevo: false,
    avance: 40,
    precioCentavos: 3_200_000,
    partes: [
      {
        id: 'p1',
        numero: 1,
        titulo: 'Bajo y contrabajo',
        detalle: '11:20 · vista',
        estado: 'completado',
      },
      {
        id: 'p2',
        numero: 2,
        titulo: 'Cambio de acorde',
        detalle: 'Viendo ahora',
        estado: 'viendo',
      },
      { id: 'p3', numero: 3, titulo: 'A tempo real', detalle: '10:40', estado: 'enCurso' },
    ],
    recursos: [{ id: 'tr4', titulo: 'Pista sin acordeón', detalle: 'MP3 · 92 BPM', tipo: 'pista' }],
    pisadas: PISADAS_EJEMPLO,
  },
  {
    id: 't8',
    titulo: 'El aire de la puya',
    resumen: 'Por qué la puya no es un paseo rápido: qué cambia de verdad en la mano izquierda.',
    portada: ACTIVOS.heroe,
    duracionSegundos: 1920,
    totalPartes: 2,
    comprado: true,
    nuevo: false,
    avance: 100,
    precioCentavos: 3_600_000,
    partes: [
      {
        id: 'p1',
        numero: 1,
        titulo: 'El aire y su acento',
        detalle: '16:00 · vista',
        estado: 'completado',
      },
      {
        id: 'p2',
        numero: 2,
        titulo: 'Subir el tempo',
        detalle: '16:00 · vista',
        estado: 'completado',
      },
    ],
    recursos: [
      {
        id: 'tr5',
        titulo: 'Partitura del ejercicio',
        detalle: 'PDF · 3 páginas',
        tipo: 'partitura',
      },
    ],
    pisadas: PISADAS_EJEMPLO,
  },
  {
    id: 't9',
    titulo: 'Cumbia en acordeón',
    resumen: 'La cumbia con acordeón diatónico: el patrón, los adornos y los errores típicos.',
    portada: ACTIVOS.diegoTocando,
    duracionSegundos: 2760,
    totalPartes: 4,
    comprado: true,
    nuevo: false,
    avance: 0,
    precioCentavos: 4_100_000,
    partes: [
      { id: 'p1', numero: 1, titulo: 'El patrón base', detalle: '12:30', estado: 'enCurso' },
      {
        id: 'p2',
        numero: 2,
        titulo: 'Adornos de la melodía',
        detalle: '14:00',
        estado: 'bloqueado',
      },
      { id: 'p3', numero: 3, titulo: 'Cambios de acorde', detalle: '09:30', estado: 'bloqueado' },
      { id: 'p4', numero: 4, titulo: 'Pieza completa', detalle: '10:00', estado: 'bloqueado' },
    ],
    recursos: [],
    pisadas: PISADAS_EJEMPLO,
  },
];

/** Tutoriales del catalogo que el alumno todavia no tiene. Se compran una vez. */
export const RECOMENDADOS: readonly Tutorial[] = [
  {
    ...TUTORIALES[2],
    id: 't4',
    titulo: 'Adornos y bajeos',
    precioCentavos: 4_500_000,
    nuevo: false,
    portada: ACTIVOS.diegoTocando,
  },
  {
    ...TUTORIALES[2],
    id: 't5',
    titulo: 'Merengue paso a paso',
    precioCentavos: 3_900_000,
    nuevo: false,
    portada: ACTIVOS.cursoCompleto,
  },
  {
    ...TUTORIALES[2],
    id: 't6',
    titulo: 'Acompañar cantantes',
    precioCentavos: 5_200_000,
    nuevo: false,
    portada: ACTIVOS.heroe,
  },
];
