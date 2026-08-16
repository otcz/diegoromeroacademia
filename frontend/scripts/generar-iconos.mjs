/**
 * Genera el registro de iconos a partir de los SVG duotone de Phosphor.
 *
 * Regla 12: Phosphor duotone es la unica fuente de iconos. Copiar SVG a mano termina
 * siempre en iconos de otras librerias colandose sin que nadie lo note; este script hace
 * que agregar un icono sea editar una lista y ejecutar un comando.
 *
 *   npm run iconos:generar
 *
 * Para agregar uno: buscarlo en https://phosphoricons.com, anadir su nombre a ICONOS_USADOS
 * y volver a ejecutar. Si el nombre no existe, el script falla en vez de generar un hueco.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'node_modules', '@phosphor-icons', 'core', 'assets', 'duotone');
const DESTINO = join(RAIZ, 'src', 'app', 'disenio', 'iconos', 'registro-iconos.ts');

/** Iconos efectivamente usados. Mantener ordenado y sin sobrantes: cada uno pesa en el bundle. */
const ICONOS_USADOS = [
  // Navegacion y estructura
  'list',
  'x',
  'caret-right',
  'caret-down',
  'arrow-right',
  'arrow-left',
  'magnifying-glass',
  // Aprendizaje
  'lock',
  'lock-open',
  // Formularios: mostrar u ocultar la contrasena al escribirla
  'eye',
  'eye-slash',
  'check-circle',
  'play-circle',
  'star',
  'certificate',
  'clock',
  'download-simple',
  // Estado y avisos
  'info',
  'warning-circle',
  'x-circle',
  'seal-check',
  // Cuenta y comercio
  'user',
  'user-circle',
  'shopping-cart',
  'credit-card',
  'package',
  // Marcas
  'whatsapp-logo',
  'google-logo',
  'facebook-logo',
];

const faltantes = ICONOS_USADOS.filter(
  (nombre) => !existsSync(join(ORIGEN, `${nombre}-duotone.svg`)),
);
if (faltantes.length > 0) {
  console.error(`No existen en Phosphor duotone: ${faltantes.join(', ')}`);
  process.exit(1);
}

const entradas = ICONOS_USADOS.map((nombre) => {
  const svg = readFileSync(join(ORIGEN, `${nombre}-duotone.svg`), 'utf8');
  // Solo el contenido interno: el componente adr-icono aporta el <svg> con su viewBox,
  // para que todos los iconos compartan tamanio y alineacion sin excepciones.
  const contenido = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  return `  '${nombre}': '${contenido.replace(/'/g, "\\'")}',`;
}).join('\n');

const salida = `// ARCHIVO GENERADO — no editar a mano.
// Regenerar con: npm run iconos:generar   (ver scripts/generar-iconos.mjs)
//
// Fuente: Phosphor Icons, peso duotone, licencia MIT (https://phosphoricons.com).
// El contenido va sin el envoltorio <svg>: lo aporta el componente adr-icono, para que
// todos compartan viewBox 0 0 256 256 y se tinan con currentColor.

export const ICONOS = {
${entradas}
} as const;

/** Nombres validos de icono. Un nombre fuera de esta lista no compila. */
export type NombreIcono = keyof typeof ICONOS;

export const NOMBRES_ICONO = Object.keys(ICONOS) as NombreIcono[];
`;

writeFileSync(DESTINO, salida, 'utf8');
console.warn(`Generados ${ICONOS_USADOS.length} iconos en ${DESTINO}`);
