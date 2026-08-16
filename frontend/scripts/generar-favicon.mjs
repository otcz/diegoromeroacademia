/**
 * Genera el favicon y el icono de pantalla de inicio a partir de la marca.
 *
 *   npm run iconos:favicon
 *
 * <p><b>Por qué existe este script.</b> El favicon que servía producción era el logotipo de
 * Angular del andamiaje, sin tocar — magenta y morado, en cada pestaña, marcador e historial
 * de una marca cuya tinta es el azul rey. Es la señal más barata y más visible de «proyecto
 * personal», y aparece antes que cualquier otra cosa de la página.
 *
 * <p>Se genera en vez de dibujarse a mano para que salga del token: el día que el azul rey
 * cambie, se vuelve a ejecutar y no hay que abrir un editor de imágenes.
 *
 * <p><b>Sobre el color literal.</b> Un archivo binario no puede leer una variable CSS, así
 * que el hexadecimal aparece aquí escrito. Es la misma excepción ya documentada para
 * `theme-color` en `index.html`, y por eso vive en UNA constante con su origen anotado.
 */
import { createHash } from 'node:crypto';
import { readdir, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const PUBLICO = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

/** Espejo de `--adr-color-azul-rey` en disenio/_tokens.scss. Si allí cambia, aquí también. */
const AZUL_REY = '#1d6bf3';
const BLANCO = '#ffffff';

/** Tamaños que exige un ICO bien formado para verse nítido en pestaña, marcador y escritorio. */
const TAMANIOS_ICO = [16, 32, 48];
const TAMANIO_APPLE = 180;

/**
 * Monograma «DR» en blanco sobre azul rey.
 *
 * <p>Blanco sobre azul rey da 4,72:1, muy por encima del 3:1 que pide un elemento gráfico.
 * La combinación inversa solo llega a 3,66:1 y a 16 px se empasta hasta ser una mancha.
 *
 * <p>La tipografía va por familia genérica a propósito: la fuente de marca no está instalada
 * en la máquina que ejecuta esto, y pedirla produciría un sustituto distinto en cada equipo.
 * A 16 px la diferencia no se percibe; la reproducibilidad sí importa.
 */
function monograma(lado) {
  const radio = Math.round(lado * 0.22);
  const tamanioTexto = Math.round(lado * 0.46);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
       <rect width="${lado}" height="${lado}" rx="${radio}" fill="${AZUL_REY}"/>
       <text x="50%" y="50%" dy="0.35em" text-anchor="middle"
             font-family="Helvetica, Arial, sans-serif" font-weight="700"
             font-size="${tamanioTexto}" fill="${BLANCO}" letter-spacing="${lado * 0.01}">DR</text>
     </svg>`,
  );
}

const png = (lado) => sharp(monograma(lado)).png({ compressionLevel: 9 }).toBuffer();

/**
 * Ensambla un .ico con varias resoluciones dentro.
 *
 * <p>`sharp` no escribe ICO, pero el formato admite PNG incrustado desde Windows Vista y es
 * lo que usan hoy todos los navegadores: cabecera de 6 bytes, una entrada de directorio de
 * 16 bytes por tamaño, y los PNG concatenados detrás.
 */
async function ensamblarIco(imagenes) {
  const CABECERA = 6;
  const ENTRADA = 16;
  const cabecera = Buffer.alloc(CABECERA);
  cabecera.writeUInt16LE(0, 0); // reservado
  cabecera.writeUInt16LE(1, 2); // tipo 1 = icono
  cabecera.writeUInt16LE(imagenes.length, 4);

  let desplazamiento = CABECERA + ENTRADA * imagenes.length;
  const entradas = imagenes.map(({ lado, datos }) => {
    const e = Buffer.alloc(ENTRADA);
    e.writeUInt8(lado >= 256 ? 0 : lado, 0); // 0 significa 256
    e.writeUInt8(lado >= 256 ? 0 : lado, 1);
    e.writeUInt8(0, 2); // paleta
    e.writeUInt8(0, 3); // reservado
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por pixel
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += datos.length;
    return e;
  });

  return Buffer.concat([cabecera, ...entradas, ...imagenes.map((i) => i.datos)]);
}

const imagenes = await Promise.all(
  TAMANIOS_ICO.map(async (lado) => ({ lado, datos: await png(lado) })),
);

const ico = await ensamblarIco(imagenes);
const huella = createHash('sha256').update(ico).digest('hex').slice(0, 8);

// Dos copias del MISMO icono, a propósito.
//
// `favicon.ico` a secas se conserva porque algunos rastreadores lo piden por convención, sin
// mirar el <link>. Pero esa ruta ya vivió un año como el logotipo de Angular con
// `Cache-Control: immutable`, así que las cachés intermedias la retienen: medido, Cloudflare
// devolvía la vieja con `cf-cache-status: HIT` y `Age: 18275` mucho después de corregir el
// origen. Contra eso ninguna cabecera sirve — solo un nombre que la caché no haya visto.
//
// Por eso el que enlaza `index.html` lleva huella de contenido. Es el mismo mecanismo que
// usan las imágenes desde que un acordeón cambiado conservando el nombre se quedó servido
// durante horas.
await writeFile(`${PUBLICO}favicon.ico`, ico);
await writeFile(`${PUBLICO}favicon.${huella}.ico`, ico);
await writeFile(`${PUBLICO}apple-touch-icon.png`, await png(TAMANIO_APPLE));

// Descarta huellas anteriores para que no se acumulen huérfanas en la imagen publicada.
for (const viejo of await readdir(PUBLICO)) {
  if (/^favicon\.[0-9a-f]{8}\.ico$/.test(viejo) && viejo !== `favicon.${huella}.ico`) {
    await unlink(`${PUBLICO}${viejo}`);
    console.warn(`  huella anterior descartada: ${viejo}`);
  }
}

console.warn(`favicon.ico            ${TAMANIOS_ICO.join('/')} px`);
console.warn(`favicon.${huella}.ico   ← esta es la que enlaza index.html`);
console.warn(`apple-touch-icon.png   ${TAMANIO_APPLE}x${TAMANIO_APPLE} px`);
