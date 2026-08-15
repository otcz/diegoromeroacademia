import { EstacionRuta } from '../../compartido/componentes/ruta-niveles/ruta-niveles';
import { ACTIVOS } from '../../disenio/activos';
import { NombreIcono } from '../../disenio/iconos/registro-iconos';
import { RutaActivo } from '../../disenio/activos';

/**
 * Contenido de la landing pública.
 *
 * <p>Vive aparte de las plantillas para que el texto se pueda revisar sin tocar maquetación,
 * y para que quede en un solo sitio cuando llegue el momento de servirlo desde la API.
 *
 * <p>Cada constante lleva su <b>condición de salida</b>: qué endpoint la sustituye y cuándo
 * desaparece de aquí. Un dato de negocio escrito en el código es lo que prohíbe la regla 4,
 * y solo se tolera mientras no haya de dónde leerlo.
 */

// ---------------------------------------------------------------------- héroe

export const HEROE = {
  kicker: 'Acordeón vallenato · Nivel 1 abierto',
  tituloAntes: 'Aprende acordeón',
  tituloSubrayado: 'desde cero.',
  bajada: 'Cuatro niveles. Un solo camino.',
  accion: 'Empezar ahora',
  enlaceSecundario: 'Planes desde $34.900 →',
  nota: 'Precios visibles, sin registrarte · Cancela cuando quieras',
  resumenRuta: '96 clases en 4 niveles',
} as const;

// ----------------------------------------------------------------------- ruta

/**
 * CONDICIÓN DE SALIDA: desaparece cuando exista `GET /api/cursos/{slug}/niveles`.
 *
 * <p>Los nombres son «Nivel 1» a «Nivel 4» a propósito, y `resumen` va en `null`: inventar
 * un temario que Diego no ha confirmado sería poner en su boca algo que no dijo. En cuanto
 * confirme los contenidos, se rellenan los resúmenes.
 */
export const ESTACIONES: readonly EstacionRuta[] = [
  { numero: 1, titulo: 'Nivel 1', resumen: null, estado: 'actual' },
  { numero: 2, titulo: 'Nivel 2', resumen: null, estado: 'bloqueado' },
  { numero: 3, titulo: 'Nivel 3', resumen: null, estado: 'bloqueado' },
  { numero: 4, titulo: 'Nivel 4', resumen: null, estado: 'bloqueado' },
  { numero: 5, titulo: 'Certificado', resumen: null, estado: 'meta' },
];

// --------------------------------------------------------------------- cifras

export interface Cifra {
  readonly valor: string;
  readonly rotulo: string;
}

/**
 * CONDICIÓN DE SALIDA: `GET /api/catalogo/resumen` para niveles y clases; las de YouTube
 * seguirán siendo manuales hasta que se integre su API.
 *
 * <p>Se quitó «362 videos publicados» del diseño anterior: anunciar el catálogo gratuito
 * justo antes del muro de pago es señalarle al visitante una alternativa que no cuesta nada.
 */
export const CIFRAS: readonly Cifra[] = [
  { valor: '26.000', rotulo: 'Suscriptores' },
  { valor: '4', rotulo: 'Niveles' },
  { valor: '96', rotulo: 'Clases' },
  { valor: '100%', rotulo: 'Exámenes que revisa Diego' },
];

export const PROCEDENCIA_CIFRAS = 'Cifras públicas del canal @DiegoRomeroAcordeon.';

// ------------------------------------------------------------ dentro de un nivel

export interface PasoNivel {
  readonly icono: NombreIcono;
  readonly titulo: string;
  readonly detalle: string;
}

export const PASOS_NIVEL: readonly PasoNivel[] = [
  { icono: 'play-circle', titulo: 'Ves la clase', detalle: 'Video, partitura y pista.' },
  { icono: 'download-simple', titulo: 'Practicas', detalle: 'Con la pista de la clase.' },
  { icono: 'seal-check', titulo: 'Apruebas', detalle: 'Diego revisa tu video, uno por uno.' },
];

// ------------------------------------------------------------------ simulador

export const SIMULADOR = {
  kicker: 'Solo aquí',
  titulo: 'El simulador de pisadas.',
  detalle: 'Marca el botón y la dirección del fuelle, al ritmo del video.',
  ventajas: ['BPM ajustable', 'Loop A–B', 'Afinaciones FBE y GCF'],
} as const;

// ------------------------------------------------------------------- catálogo

export interface CursoLanding {
  readonly clave: string;
  readonly kicker: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly portada: RutaActivo;
  readonly precio: string | null;
  readonly dificultad: number | null;
  readonly alumnos: number | null;
  readonly etiqueta: string | null;
  readonly textoAccion: string;
  readonly enlace: string;
}

/** CONDICIÓN DE SALIDA: `GET /api/cursos`. Los precios los servirá el módulo `pagos`. */
export const CATALOGO: readonly CursoLanding[] = [
  {
    clave: 'curso-completo',
    kicker: 'Incluido en el plan',
    titulo: 'Curso completo de acordeón',
    descripcion: '4 niveles · 96 clases',
    portada: ACTIVOS.cursoCompleto,
    precio: null,
    dificultad: null,
    alumnos: null,
    etiqueta: null,
    textoAccion: 'Empezar con el plan',
    enlace: '/registro',
  },
  {
    clave: 'la-gota-fria',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'La gota fría',
    descripcion: 'Frase por frase, con pitos y bajos por separado.',
    portada: ACTIVOS.laGotaFria,
    precio: '$34.900',
    dificultad: 3,
    alumnos: 184,
    etiqueta: 'Nuevo',
    textoAccion: 'Comprar',
    enlace: '/registro',
  },
  {
    clave: 'los-caminos-de-la-vida',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'Los caminos de la vida',
    descripcion: 'Independencia de manos. Incluye pista.',
    portada: ACTIVOS.losCaminosDeLaVida,
    precio: '$34.900',
    dificultad: 2,
    alumnos: 281,
    etiqueta: null,
    textoAccion: 'Comprar',
    enlace: '/registro',
  },
];

export const NOTA_CATALOGO = 'Lo que compras es tuyo para siempre.';

// --------------------------------------------------------------------- planes

export interface PlanLanding {
  readonly clave: string;
  readonly nombre: string;
  readonly precio: string;
  readonly periodicidad: string;
  readonly descripcion: string;
  readonly textoAccion: string;
  readonly recomendado: boolean;
  readonly enlace: string;
}

/**
 * CONDICIÓN DE SALIDA: `GET /api/planes`, en cuanto exista el módulo `pagos`.
 *
 * <p>Los importes son PROVISIONALES — decisión pendiente #2, y es de Diego. Están escritos
 * aquí, lo que incumple la regla 4, y solo se tolera porque todavía no hay de dónde leerlos.
 */
export const PLANES: readonly PlanLanding[] = [
  {
    clave: 'mensual',
    nombre: 'Mensual',
    precio: '$39.900',
    periodicidad: '/mes',
    descripcion: 'Toda la ruta mientras el plan esté activo.',
    textoAccion: 'Elegir mensual',
    recomendado: false,
    enlace: '/registro',
  },
  {
    clave: 'anual',
    nombre: 'Anual',
    precio: '$349.900',
    periodicidad: '/año',
    descripcion: 'Dos meses gratis.',
    textoAccion: 'Elegir anual',
    recomendado: true,
    enlace: '/registro',
  },
  {
    clave: 'suelto',
    nombre: 'Curso suelto',
    precio: 'desde $34.900',
    periodicidad: '',
    descripcion: 'Pago único, acceso permanente.',
    textoAccion: 'Ver catálogo',
    recomendado: false,
    enlace: '#catalogo',
  },
];

export const GARANTIAS: readonly string[] = [
  'PSE, Nequi y tarjeta',
  'Cancela cuando quieras',
  'Pasarela certificada',
  'Acceso inmediato',
];

export const NOTA_PRECIOS = 'Precios provisionales en COP.';

// ------------------------------------------------------------- prueba pública

export interface ComentarioCanal {
  readonly clave: string;
  readonly cita: string;
  readonly autor: string;
  readonly enlace: string;
}

/**
 * VACÍO A PROPÓSITO. La sección de testimonios lleva guarda: si no hay comentarios reales
 * capturados del canal, no se dibuja.
 *
 * <p>Mejor ausente que fabricada. Publicar una cita inventada sobre la marca personal de una
 * persona real es un problema legal y reputacional — y además el visitante descuenta la
 * prueba social que huele a escrita por la casa.
 */
export const COMENTARIOS: readonly ComentarioCanal[] = [];

// --------------------------------------------------------------------- cierre

export const CIERRE = {
  titulo: 'Empieza hoy por el nivel 1.',
  accion: 'Registrarme',
  accionWhatsapp: 'Hablar por WhatsApp',
  nota: 'Sin permanencia · Cancela cuando quieras',
} as const;
