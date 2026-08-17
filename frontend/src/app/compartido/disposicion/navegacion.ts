import { NombreIcono } from '../../disenio/iconos/registro-iconos';

/**
 * Las cinco secciones de la aplicacion del estudiante.
 *
 * <p><b>Una sola lista para los tres menus.</b> La barra lateral, el riel de tableta y la
 * barra inferior de movil dibujan lo mismo con distinta forma. Con tres listas separadas, la
 * seccion que se anada manana entra en dos de las tres y nadie lo nota hasta que alguien
 * navega en celular.
 *
 * <p>Por eso cada entrada trae DOS rotulos: «Zona Ejercicios» cabe en 246 px de barra lateral
 * y no en una pestania de 78 px. El corto no es una abreviatura automatica del largo —
 * «Mis cursos» se acorta a «Cursos», no a «Mis cur…».
 */
export interface EntradaNavegacion {
  readonly ruta: string;
  readonly etiqueta: string;
  /** Rotulo para la barra inferior y el riel, donde el ancho lo decide todo. */
  readonly etiquetaCorta: string;
  readonly icono: NombreIcono;
  /** Cierto si la entrada solo aparece en la barra inferior de movil. */
  readonly soloMovil?: boolean;
  /** Cierto si la entrada solo aparece en la barra lateral y el riel. */
  readonly soloEscritorio?: boolean;
}

export const NAVEGACION: readonly EntradaNavegacion[] = [
  { ruta: '/inicio', etiqueta: 'Inicio', etiquetaCorta: 'Inicio', icono: 'house' },
  { ruta: '/mis-cursos', etiqueta: 'Mis cursos', etiquetaCorta: 'Cursos', icono: 'graduation-cap' },
  { ruta: '/practica', etiqueta: 'Zona Ejercicios', etiquetaCorta: 'Ejercicios', icono: 'barbell' },
  {
    ruta: '/tutoriales',
    etiqueta: 'Tutoriales',
    etiquetaCorta: 'Tutoriales',
    icono: 'play-circle',
    // Fuera de la barra inferior: cinco pestanias es el maximo que cabe en 390 px sin que el
    // rotulo se parta, y el handoff eligio dejar «Cuenta» en su lugar. Los tutoriales siguen
    // a un toque desde Inicio.
    soloEscritorio: true,
  },
  { ruta: '/tienda', etiqueta: 'Tienda', etiquetaCorta: 'Tienda', icono: 'storefront' },
  {
    ruta: '/suscripcion',
    etiqueta: 'Mi suscripción',
    etiquetaCorta: 'Cuenta',
    icono: 'user-circle',
    // En escritorio la suscripcion vive en el bloque de plan del pie de la barra lateral y en
    // el menu de usuario, asi que repetirla arriba solo alarga el menu.
    soloMovil: true,
  },
];

/** Entradas de la barra lateral y del riel de tableta. */
export const NAVEGACION_ESCRITORIO = NAVEGACION.filter((e) => !e.soloMovil);

/** Las cinco pestanias de la barra inferior de movil. */
export const NAVEGACION_MOVIL = NAVEGACION.filter((e) => !e.soloEscritorio);

/**
 * Opciones del menu de usuario de la barra superior.
 *
 * <p>«Cerrar sesion» no esta aqui: no es una navegacion sino una accion con efecto, y
 * meterla en la misma lista termina en un `if` dentro del bucle que la dibuja.
 */
export interface OpcionUsuario {
  readonly ruta: string;
  readonly etiqueta: string;
  readonly detalle: string;
  readonly icono: NombreIcono;
}

export const OPCIONES_USUARIO: readonly OpcionUsuario[] = [
  {
    ruta: '/suscripcion',
    etiqueta: 'Gestionar mi suscripción',
    detalle: 'Plan, vencimiento y pagos',
    icono: 'crown-simple',
  },
  {
    ruta: '/regalar',
    etiqueta: 'Regalar clases o productos',
    detalle: 'Suscripciones, bonos y tienda',
    icono: 'gift',
  },
  { ruta: '/perfil', etiqueta: 'Mi perfil', detalle: 'Datos y foto', icono: 'user' },
  { ruta: '/ajustes', etiqueta: 'Ajustes', detalle: 'Notificaciones e idioma', icono: 'gear' },
];
