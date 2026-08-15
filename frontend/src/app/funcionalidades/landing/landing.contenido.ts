/**
 * Contenido de la landing publica.
 *
 * <p>Vive aparte de la plantilla para que el texto se pueda revisar y traducir sin tocar
 * la maquetacion, y para que quede en un solo sitio cuando llegue el momento de servirlo
 * desde la API.
 *
 * <p>ATENCION — los precios de aqui son PROVISIONALES. La decision pendiente #2
 * (docs/00-contexto.md §5) es de Diego, y el diseno aprobado ya lo advierte en pantalla.
 * Cuando el modulo `pagos` exista, los planes se leen de `GET /api/planes` y estas
 * constantes desaparecen: un precio escrito en el codigo es exactamente lo que la regla 4
 * prohibe, y aqui solo se tolera porque todavia no hay de donde leerlo.
 */

export interface Cifra {
  readonly valor: string;
  readonly etiqueta: string;
}

export interface PasoMetodo {
  readonly numero: string;
  readonly titulo: string;
  readonly descripcion: string;
}

export interface TarjetaCatalogo {
  readonly clave: string;
  readonly kicker: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly precio: string | null;
  readonly textoAccion: string;
  readonly destacada: boolean;
  readonly etiquetaNueva: boolean;
  readonly dificultad: number | null;
  readonly alumnos: number | null;
}

export interface PlanLanding {
  readonly clave: string;
  readonly nombre: string;
  readonly precio: string;
  readonly periodicidad: string;
  readonly descripcion: string;
  readonly textoAccion: string;
  readonly recomendado: boolean;
}

export const CIFRAS: readonly Cifra[] = [
  { valor: '26.000', etiqueta: 'Suscriptores en YouTube' },
  { valor: '362', etiqueta: 'Videos publicados' },
  { valor: '4 niveles', etiqueta: 'Del cero al escenario' },
  { valor: '100%', etiqueta: 'Exámenes revisados por Diego' },
];

export const PASOS_METODO: readonly PasoMetodo[] = [
  {
    numero: '1',
    titulo: 'Niveles que se desbloquean',
    descripcion:
      'Avanzas por una ruta clara. Cada nivel se abre al aprobar el examen del anterior; ' +
      'los aprobados quedan para repaso.',
  },
  {
    numero: '2',
    titulo: 'Exámenes con revisión personal',
    descripcion:
      'Teoría automática más un video tuyo tocando, que Diego revisa y comenta. ' +
      'Retroalimentación real, no un quiz.',
  },
  {
    numero: '3',
    titulo: 'Certificado verificable',
    descripcion:
      'Cada nivel aprobado te da un certificado PDF con código público de verificación. ' +
      'Tuyo para siempre.',
  },
];

export const VENTAJAS_SIMULADOR: readonly string[] = [
  'Velocidad ajustable (BPM) para practicar lento',
  'Repetición de fragmento (loop A–B)',
  'Diagramas por afinación: FBE, GCF y más',
];

export const CATALOGO: readonly TarjetaCatalogo[] = [
  {
    clave: 'curso-completo',
    kicker: 'Curso por niveles · Incluido en el plan',
    titulo: 'Curso completo de acordeón vallenato',
    descripcion:
      '4 niveles · 96 clases · partituras y pistas. Del primer fuelle a tocar en la parranda.',
    precio: null,
    textoAccion: 'Empezar con el plan',
    destacada: true,
    etiquetaNueva: false,
    dificultad: null,
    alumnos: null,
  },
  {
    clave: 'la-gota-fria',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'La gota fría — paso a paso',
    descripcion:
      'El clásico de Emiliano Zuleta frase por frase, con pitos y bajos por separado.',
    precio: '$34.900',
    textoAccion: 'Comprar',
    destacada: false,
    etiquetaNueva: true,
    dificultad: 3,
    alumnos: 184,
  },
  {
    clave: 'los-caminos-de-la-vida',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'Los caminos de la vida — pitos y bajos',
    descripcion:
      'Independencia de manos con uno de los vallenatos más queridos. Incluye pista.',
    precio: '$34.900',
    textoAccion: 'Comprar',
    destacada: false,
    etiquetaNueva: false,
    dificultad: 2,
    alumnos: 281,
  },
];

export const PLANES: readonly PlanLanding[] = [
  {
    clave: 'mensual',
    nombre: 'Mensual',
    precio: '$39.900',
    periodicidad: '/mes',
    descripcion: 'Todo el catálogo, exámenes y simulador mientras tu plan esté activo.',
    textoAccion: 'Elegir mensual',
    recomendado: false,
  },
  {
    clave: 'anual',
    nombre: 'Anual',
    precio: '$349.900',
    periodicidad: '/año',
    descripcion: 'Lo mismo que el mensual pagando el año completo: ahorras más de dos meses.',
    textoAccion: 'Elegir anual',
    recomendado: true,
  },
  {
    clave: 'suelto',
    nombre: 'Curso suelto',
    precio: 'desde $34.900',
    periodicidad: '',
    descripcion: 'Un tutorial específico, pago único y acceso permanente. Sin suscripción.',
    textoAccion: 'Ver catálogo',
    recomendado: false,
  },
];
