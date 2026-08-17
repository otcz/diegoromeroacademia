/**
 * Genera el registro de iconos a partir de los SVG de Material Symbols Rounded.
 *
 * Regla 12 y ADR 0014: Material Symbols Rounded, peso 400, es la unica fuente de iconos.
 * Copiar SVG a mano termina siempre en iconos de otras librerias colandose sin que nadie lo
 * note; este script hace que agregar un icono sea editar una lista y ejecutar un comando.
 *
 *   npm run iconos:generar
 *
 * PARA AGREGAR UNO: buscarlo en https://fonts.google.com/icons (estilo Rounded), anadir la
 * pareja `nombre-del-proyecto: 'nombre_material'` al mapa y volver a ejecutar. Si el nombre de
 * Material no existe, el script falla en vez de generar un hueco.
 *
 * POR QUE EL MAPA. La izquierda es el vocabulario del proyecto —lo que escriben las plantillas
 * en `<adr-icono nombre="...">`— y la derecha, el nombre que le da Google. Mantenerlos
 * separados es lo que permitio cambiar de Phosphor a Material tocando ESTE archivo y no las
 * cien plantillas que consumen iconos. Ese desacople se conserva a proposito.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'node_modules', '@material-symbols', 'svg-400', 'rounded');
const DESTINO = join(RAIZ, 'src', 'app', 'disenio', 'iconos', 'registro-iconos.ts');

/**
 * Iconos efectivamente usados: nombre del proyecto → nombre en Material Symbols.
 *
 * Mantener ordenado y sin sobrantes: cada uno pesa en el paquete que descarga el visitante.
 *
 * Los logotipos de terceros NO estan aqui. Material Symbols no incluye marcas —Google las
 * retiro de su catalogo— y ademas una marca no es un icono: identifica a su dueno y lleva sus
 * colores. Viven en `disenio/iconos/marcas.ts` y se consumen con `<adr-marca>` (ADR 0010).
 */
const ICONOS_USADOS = {
  // Navegacion y estructura
  list: 'menu',
  x: 'close',
  'caret-right': 'chevron_right',
  'caret-left': 'chevron_left',
  'caret-down': 'keyboard_arrow_down',
  'arrow-left': 'arrow_back',
  'magnifying-glass': 'search',

  // Aprendizaje
  lock: 'lock',
  'lock-open': 'lock_open',
  'check-circle': 'check_circle',
  'play-circle': 'play_circle',
  star: 'star',
  certificate: 'workspace_premium',
  clock: 'schedule',
  'download-simple': 'download',

  // Formularios: mostrar u ocultar la contrasena al escribirla
  eye: 'visibility',
  'eye-slash': 'visibility_off',

  // Estado y avisos
  info: 'info',
  'warning-circle': 'error',
  'x-circle': 'cancel',
  'seal-check': 'verified',

  // Cuenta y comercio
  user: 'person',
  'user-circle': 'account_circle',
  'shopping-cart': 'shopping_cart',
  'credit-card': 'credit_card',
  package: 'inventory_2',

  // ------------------------------------------------------------------------
  // Aplicacion del estudiante (handoff docs/handoff-disenio/app-estudiante).
  // La tabla de equivalencias completa esta en docs/04 §2.
  // ------------------------------------------------------------------------

  // Navegacion principal y barra superior
  house: 'home',
  'graduation-cap': 'school',
  barbell: 'fitness_center',
  storefront: 'storefront',
  gear: 'settings',
  bell: 'notifications',
  sun: 'light_mode',
  moon: 'dark_mode',
  'sign-out': 'logout',

  // Reproductor
  play: 'play_arrow',
  pause: 'pause',
  rewind: 'fast_rewind',
  'fast-forward': 'fast_forward',
  'speaker-high': 'volume_up',
  'closed-captioning': 'closed_caption',
  'corners-out': 'fullscreen',
  'corners-in': 'fullscreen_exit',
  'sliders-horizontal': 'tune',
  repeat: 'repeat',

  // Aprendizaje y practica
  fire: 'local_fire_department',
  target: 'target',
  'music-notes': 'music_note',
  'file-pdf': 'picture_as_pdf',
  'image-square': 'image',
  'video-camera': 'videocam',

  // Comunidad
  'users-three': 'group',
  'thumbs-up': 'thumb_up',

  // Comercio, cuenta y regalos
  gift: 'redeem',
  wallet: 'account_balance_wallet',
  ticket: 'confirmation_number',
  plus: 'add',
  minus: 'remove',
  camera: 'photo_camera',
  'shield-check': 'verified_user',
  'calendar-blank': 'calendar_month',
  'crown-simple': 'military_tech',
  check: 'check',
  // «Consejo de Diego»: la bombilla dice «esto es una idea util» sin adornos. El destello de
  // Phosphor era decoracion; en Material su equivalente literal ni siquiera existe.
  sparkle: 'lightbulb',
};

const parejas = Object.entries(ICONOS_USADOS);

const faltantes = parejas.filter(([, material]) => !existsSync(join(ORIGEN, `${material}.svg`)));
if (faltantes.length > 0) {
  const detalle = faltantes.map(([nuestro, material]) => `${nuestro} → ${material}`).join(', ');
  console.error(`No existen en Material Symbols Rounded: ${detalle}`);
  process.exit(1);
}

const entradas = parejas
  .map(([nuestro, material]) => {
    const svg = readFileSync(join(ORIGEN, `${material}.svg`), 'utf8');
    // Solo el contenido interno: el componente adr-icono aporta el <svg> con su viewBox,
    // para que todos los iconos compartan tamanio y alineacion sin excepciones.
    const contenido = svg
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .trim();
    return `  '${nuestro}': '${contenido.replace(/'/g, "\\'")}',`;
  })
  .join('\n');

const salida = `// ARCHIVO GENERADO — no editar a mano.
// Regenerar con: npm run iconos:generar   (ver scripts/generar-iconos.mjs)
//
// Fuente: Material Symbols Rounded, peso 400, licencia Apache-2.0
// (https://fonts.google.com/icons). El contenido va sin el envoltorio <svg>: lo aporta el
// componente adr-icono, para que todos compartan viewBox 0 -960 960 960 y se tinan con
// currentColor.

export const ICONOS = {
${entradas}
} as const;

/** Nombres validos de icono. Un nombre fuera de esta lista no compila. */
export type NombreIcono = keyof typeof ICONOS;

export const NOMBRES_ICONO = Object.keys(ICONOS) as NombreIcono[];
`;

writeFileSync(DESTINO, salida, 'utf8');
console.warn(`Generados ${parejas.length} iconos en ${DESTINO}`);
