import { DESTINO_REGISTRO } from '../../app.routes';
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

/**
 * El importe con el que empieza la suscripción.
 *
 * <p>Se declara ANTES de `HEROE` a propósito: el héroe lo cita, y citar `PLANES` desde aquí
 * reventaría por zona muerta temporal — `PLANES` se declara mucho más abajo en este archivo.
 *
 * <p>La periodicidad viaja con el precio y no se omite: sin el «/mes» el visitante ancla
 * $39.900 como el precio total y el cobro recurrente se convierte en la sorpresa.
 */
export const PLAN_DE_ENTRADA = { precio: '$39.900', periodicidad: '/mes' } as const;

// ---------------------------------------------------------------------- héroe

export const HEROE = {
  kicker: 'Acordeón vallenato · Nivel 1 abierto',
  tituloAntes: 'Aprende acordeón',
  tituloSubrayado: 'vallenato.',
  bajada: 'Desde cero, con la caja y la guacharaca que lo acompañan. Cuatro niveles, un camino.',
  accion: 'Empezar ahora',
  // Antes decía «desde $34.900», que es el precio de un tutorial suelto y no de ningún plan:
  // era el primer número de la página y anclaba mal todo lo que venía después.
  enlaceSecundario: `Planes desde ${PLAN_DE_ENTRADA.precio}${PLAN_DE_ENTRADA.periodicidad} →`,
  nota: 'Precios visibles, sin registrarte · Cancela cuando quieras',
  resumenRuta: 'Cada nivel se abre al aprobar el examen del anterior.',
} as const;

/**
 * Los instrumentos del conjunto vallenato, con el acordeón SIEMPRE primero.
 *
 * <p>La academia también enseña caja, guacharaca y guitarra, pero la página se enfoca en el
 * acordeón a propósito: es lo que la gente busca y es donde está el simulador. Nombrar los
 * otros aquí, en una línea, dice que el conjunto completo existe sin repartir el mensaje.
 *
 * <p>CONDICIÓN DE SALIDA: `GET /api/instrumentos` cuando el catálogo sirva más de uno.
 */
export const INSTRUMENTOS: readonly string[] = [
  'Acordeón vallenato',
  'Caja',
  'Guacharaca',
  'Guitarra',
];

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
  // «Seguidores» y no «Suscriptores»: mientras esa raíz signifique los de YouTube, la única
  // vez que el visitante la lee no habla de pagar, y la página necesita la palabra libre para
  // nombrar el producto. La procedencia se cita una línea más abajo, así que no hace falta
  // calificarlo aquí — no cabría en 12 px sin partirse en dos líneas.
  { valor: '26.000', rotulo: 'Seguidores' },
  { valor: '4', rotulo: 'Niveles' },
  { valor: '96', rotulo: 'Clases' },
  { valor: '100%', rotulo: 'Exámenes revisados' },
];

export const PROCEDENCIA_CIFRAS =
  'Seguidores, del canal @DiegoRomeroAcordeon. Niveles y clases, del temario de la academia.';

// ------------------------------------------------------------------ cómo funciona

export interface PasoCamino {
  readonly clave: string;
  readonly titulo: string;
  readonly detalle: string;
  /** Marca el tramo que se repite una vez por nivel, en vez de ocurrir una sola vez. */
  readonly seRepite: boolean;
}

/**
 * El recorrido completo del alumno, de registrarse a tener el certificado.
 *
 * <p><b>Por qué existe.</b> La página explicaba bien cada pieza por separado — la ruta, lo
 * que pasa dentro de un nivel, las dos formas de pagar — pero en ningún sitio decía el arco
 * entero de principio a fin. Quien llegaba nuevo tenía que armarlo juntando cuatro secciones
 * separadas por dos pantallazos, y la pregunta que se hace de verdad es más simple: «¿cómo
 * entro y qué pasa después?».
 *
 * <p>El paso 3 lleva `seRepite`: que el ciclo nivel→examen ocurra CUATRO veces es lo que hace
 * que el modelo encaje. Sin esa marca, el recorrido parece de cuatro pasos y no de cuatro
 * niveles, y el certificado del final pierde su peso.
 *
 * <p>NO repite «ves, practicas, apruebas»: eso es el detalle de dentro de un nivel y lo cuenta
 * la sección siguiente. Aquí va el arco, allí el bucle.
 *
 * <p>CONDICIÓN DE SALIDA: ninguna. Es la mecánica del producto, no un dato servido.
 */
export const CAMINO = {
  kicker: 'Cómo funciona',
  titulo: 'De cero a certificado.',
  pasos: [
    {
      clave: 'registro',
      titulo: 'Te registras',
      detalle: 'Gratis y sin tarjeta. Tu cuenta guarda tu progreso desde la primera clase.',
      seRepite: false,
    },
    {
      clave: 'eleccion',
      titulo: 'Eliges cómo pagarlo',
      detalle: 'La suscripción a toda la ruta, o un tutorial suelto de pago único.',
      seRepite: false,
    },
    {
      clave: 'nivel',
      titulo: 'Haces el nivel y su examen',
      detalle: 'Al aprobarlo se abre el siguiente. Un instructor revisa cada examen, uno por uno.',
      seRepite: true,
    },
    {
      clave: 'certificado',
      titulo: 'Recibes tu certificado',
      detalle: 'Un certificado por cada nivel aprobado. Tuyos para siempre, aunque canceles.',
      seRepite: false,
    },
  ] as readonly PasoCamino[],
  repeticion: 'Una vez por cada uno de los 4 niveles',
} as const;

// ------------------------------------------------------------ dentro de un nivel

export interface PasoNivel {
  readonly icono: NombreIcono;
  readonly titulo: string;
  readonly detalle: string;
}

export const PASOS_NIVEL: readonly PasoNivel[] = [
  { icono: 'play-circle', titulo: 'Ves la clase', detalle: 'Video, partitura y pista.' },
  { icono: 'download-simple', titulo: 'Practicas', detalle: 'Con la pista de la clase.' },
  {
    icono: 'seal-check',
    titulo: 'Apruebas',
    detalle: 'Grabas tu examen y un instructor te dice qué ajustar.',
  },
];

/**
 * La foto de la sección aporta información, no decora: enseña el instrumento real y la
 * postura de la mano. Por eso lleva descripción y no `alt` vacío.
 */
export const PRACTICA_NIVEL = {
  alternativo:
    'Mano derecha pulsando la botonadura de un acordeón diatónico de fuelle rojo, ' +
    'el instrumento del vallenato.',
  pie: 'El mismo instrumento con el que grabamos cada clase: acordeón diatónico de botones.',
};

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
  /**
   * Marca la pieza principal del catálogo. Es un DATO, nunca la posición en la rejilla:
   * apoyar la jerarquía en `:first-child` la pierde en cuanto la rejilla cae a una columna.
   */
  readonly destacado: boolean;
}

/**
 * CONDICIÓN DE SALIDA: `GET /api/cursos`. Los precios los servirá el módulo `pagos`.
 *
 * <p><b>`alumnos` va en `null` y se queda así hasta que la API sirva el conteo real.</b>
 * Aquí decía 184 y 281. Esos dos números venían del HTML de la maqueta de diseño, no del
 * negocio, y eran falsos por construcción: no existe ningún controlador en el backend, así
 * que no puede haber ni un solo inscrito.
 *
 * <p>Era la única afirmación de la página que contradecía su propia disciplina. A 700 px de
 * distancia se aplicaban dos varas incompatibles: cita verificable con enlace para los
 * testimonios («mejor ausente que fabricada»), cifra inventada para los inscritos. Y es la
 * única que no puede volverse cierta con el tiempo sin haber sido falsa antes.
 */
export const CATALOGO: readonly CursoLanding[] = [
  {
    clave: 'curso-completo',
    kicker: 'Incluido en la suscripción',
    titulo: 'Curso completo de acordeón',
    descripcion: '4 niveles · 96 clases',
    portada: ACTIVOS.cursoCompleto,
    precio: null,
    dificultad: null,
    alumnos: null,
    etiqueta: null,
    textoAccion: 'Empezar con la suscripción',
    enlace: DESTINO_REGISTRO,
    destacado: true,
  },
  {
    clave: 'la-gota-fria',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'La gota fría',
    descripcion: 'Frase por frase, con pitos y bajos por separado.',
    portada: ACTIVOS.laGotaFria,
    precio: '$34.900',
    dificultad: 3,
    alumnos: null,
    etiqueta: 'Nuevo',
    textoAccion: 'Empezar',
    enlace: DESTINO_REGISTRO,
    destacado: false,
  },
  {
    clave: 'los-caminos-de-la-vida',
    kicker: 'Tutorial suelto · Acceso permanente',
    titulo: 'Los caminos de la vida',
    descripcion: 'Independencia de manos. Incluye pista.',
    portada: ACTIVOS.losCaminosDeLaVida,
    precio: '$34.900',
    dificultad: 2,
    alumnos: null,
    etiqueta: null,
    textoAccion: 'Empezar',
    enlace: DESTINO_REGISTRO,
    destacado: false,
  },
];

export const NOTA_CATALOGO = 'Lo que compras es tuyo para siempre.';

// --------------------------------------------------------------------- acceso

/**
 * Cómo funciona el acceso: las DOS mitades de la regla, no solo la amable.
 *
 * <p>CONDICIÓN DE SALIDA: `GET /api/planes` describe las modalidades; este texto se queda
 * mientras la regla sea de negocio y no un dato servido.
 *
 * <p><b>Por qué existe esta sección.</b> La página decía tres veces «cancela cuando quieras» y
 * ninguna que al cancelar se pierden los cursos del catálogo. El visitante salía creyendo que
 * cancelar no tiene consecuencia, o sea que la landing fabricaba el reclamo de soporte más
 * caro de las plataformas de suscripción en vez de prevenirlo. La especificación §3.2 exige
 * que esto se entienda ANTES de pagar, no en el correo de cancelación.
 *
 * <p>El texto va en 16 px y en tinta secundaria, nunca en `.adr-nota`: una regla que gobierna
 * lo que estás a punto de comprar va arriba, no colgando como letra pequeña.
 */
export interface ModalidadAcceso {
  readonly clave: string;
  readonly icono: NombreIcono;
  readonly nombre: string;
  readonly queIncluye: string;
  readonly quePasaDespues: string;
}

export const ACCESO = {
  kicker: 'Cómo funciona el acceso',
  titulo: 'Dos formas de entrar.',
  modalidades: [
    {
      clave: 'suscripcion',
      icono: 'clock',
      nombre: 'Suscripción',
      queIncluye: 'Toda la ruta, mientras esté activa.',
      quePasaDespues: 'Si la cancelas, pierdes los cursos de la ruta.',
    },
    {
      clave: 'tutorial',
      icono: 'lock-open',
      nombre: 'Tutorial suelto',
      queIncluye: 'Pago único.',
      quePasaDespues: 'Ese tutorial es tuyo para siempre.',
    },
  ] as readonly ModalidadAcceso[],
  iconoGarantia: 'seal-check' as NombreIcono,
  garantia: 'Pase lo que pase, conservas tus tutoriales comprados, tus certificados y tu progreso.',
} as const;

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
    precio: PLAN_DE_ENTRADA.precio,
    periodicidad: PLAN_DE_ENTRADA.periodicidad,
    descripcion: 'Toda la ruta mientras la suscripción esté activa.',
    textoAccion: 'Empezar con el mensual',
    recomendado: false,
    enlace: DESTINO_REGISTRO,
  },
  {
    clave: 'anual',
    nombre: 'Anual',
    precio: '$349.900',
    periodicidad: '/año',
    descripcion: 'Ahorras más de dos meses.',
    textoAccion: 'Empezar con el anual',
    recomendado: true,
    enlace: DESTINO_REGISTRO,
  },
  // Aquí había una tercera tarjeta, «Curso suelto — desde $34.900», que NO es un plan: es el
  // pago único del catálogo. Se quitó por tres motivos a la vez. Su botón empujaba HACIA
  // ARRIBA («Ver catálogo», ancla `#catalogo`) justo en el momento de máxima intención de
  // compra. El «desde» metido en el hueco tipográfico de 36 px hacía su bloque de precio 39 px
  // más alto que los otros dos y torcía la comparación. Y tres tarjetas idénticas en fila se
  // leen universalmente como tres escalones del mismo producto, así que la más barata pasaba
  // por «el plan económico» en vez de por otro modelo de compra — exactamente la confusión que
  // la página tiene que deshacer. La sección de acceso, justo encima, lo explica bien.
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

// Aquí vivía la constante CIERRE, exportada y muerta: ningún archivo la importaba. El texto
// del cierre sale de los valores por defecto de `PiePublico`, que fusiona cierre y pie en una
// sola sección para no gastar dos pantallazos justo antes de la última llamada a la acción.
// Mantenerla era garantizar que algún día alguien editara el texto equivocado.
