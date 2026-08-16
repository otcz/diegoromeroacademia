/**
 * Genera el favicon y el icono de pantalla de inicio a partir del logotipo real.
 *
 *   npm run iconos:favicon
 *
 * <p><b>Por qué existe este script.</b> El favicon que servía producción era el logotipo de
 * Angular del andamiaje, sin tocar — magenta y morado, en cada pestaña, marcador e historial
 * de una marca cuya tinta es el azul. Es la señal más barata y más visible de «proyecto
 * personal», y aparece antes que cualquier otra cosa de la página.
 *
 * <p><b>Por qué se genera y no se dibuja a mano.</b> La primera versión de este script
 * dibujaba un monograma «DR» con una fuente genérica, porque no había logotipo. Ya lo hay:
 * `activos/originales/logo-dr.svg`, vectorial. Ahora las letras salen de ahí, así que son
 * LAS DE LA MARCA y no una imitación con Arial. Si el logotipo se rehace, se vuelve a
 * ejecutar esto y el icono se actualiza solo.
 *
 * <p><b>Por qué solo las letras y no la marca completa.</b> Medido a los tres tamaños del
 * ICO: la marca entera —anillo azul, disco negro, «DR» y debajo «DIEGO ROMERO»— es legible a
 * 48 px, aguanta a 32 y a 16 se empasta hasta ser una mancha gris dentro de un aro. A 16 px
 * no cabe esa cantidad de detalle, y 16 px es lo que pinta la pestaña. Se queda lo que
 * identifica: las dos letras, grandes, sobre el azul de la marca.
 */
import { createHash } from 'node:crypto';
import { readdir, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const PUBLICO = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

/**
 * El logotipo REEXPORTADO, no el que se entregó.
 *
 * <p>El entregado traía su propio azul —#0170BB— distinto del azul rey del sistema. Dos
 * azules parecidos pero no iguales en la misma pantalla se leen como descuido. El propietario
 * decidió que ceda el logotipo, y `npm run marca:logotipo` produce esta versión. Este script
 * depende de ella: si no se ha generado, falla al leer y lo dice.
 */
const VECTOR = new URL('../../activos/marca/logo-dr.svg', import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  '$1',
);

/**
 * Espejo de `--adr-color-azul-rey` en disenio/_tokens.scss. Si allí cambia, aquí también.
 *
 * <p>Un archivo binario no puede leer una variable CSS, así que el hexadecimal aparece
 * escrito. Es la misma excepción ya documentada para `theme-color` en `index.html`, y por eso
 * vive en UNA constante con su origen anotado.
 *
 * <p>Blanco sobre azul rey da 4,72:1, muy por encima del 3:1 que pide un elemento gráfico.
 * La combinación inversa solo llega a 3,66:1 y a 16 px se empasta hasta ser una mancha.
 */
const AZUL_MARCA = '#1d6bf3';

/** Lado del render intermedio del que se recortan las letras. */
const LADO_MAESTRO = 1024;

/** Umbral por canal para considerar un pixel «blanco» al buscar las letras. */
const UMBRAL_BLANCO = 200;

/** Cuánto del lado del icono ocupan las letras. El resto es aire. */
const OCUPACION_LETRAS = 0.74;

/** Radio de la esquina, en fracción del lado. */
const RADIO = 0.18;

/** Tamaños que exige un ICO bien formado para verse nítido en pestaña, marcador y escritorio. */
const TAMANIOS_ICO = [16, 32, 48];
const TAMANIO_APPLE = 180;

/**
 * Recorta del logotipo la caja de las letras «DR», dejando fuera el rótulo «DIEGO ROMERO».
 *
 * <p>Se BUSCA en vez de escribir las coordenadas a mano: unos números medidos hoy dejarían de
 * valer en silencio si el logotipo se reexporta con otro encuadre, y el fallo se vería como
 * un icono descentrado que nadie relaciona con este archivo.
 *
 * <p>El método aprovecha que el logotipo tiene dos bloques blancos separados por una franja
 * sin un solo pixel claro: arriba las letras, abajo el rótulo. Se toma el PRIMER bloque.
 */
async function cajaDeLasLetras(maestro) {
  const { data, info } = await sharp(maestro).raw().toBuffer({ resolveWithObject: true });
  const esBlanco = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return (
      data[i] > UMBRAL_BLANCO && data[i + 1] > UMBRAL_BLANCO && data[i + 2] > UMBRAL_BLANCO
    );
  };

  const filasConBlanco = [];
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (esBlanco(x, y)) {
        filasConBlanco.push(y);
        break;
      }
    }
  }

  if (filasConBlanco.length === 0) {
    throw new Error('El logotipo no tiene pixeles blancos: cambio de colores o de formato.');
  }

  // Primer bloque contiguo de filas: las letras. El corte es la primera fila que salta.
  let arriba = filasConBlanco[0];
  let abajo = arriba;
  for (const fila of filasConBlanco) {
    if (fila > abajo + 1) {
      break;
    }
    abajo = fila;
  }

  let izquierda = info.width;
  let derecha = 0;
  for (let y = arriba; y <= abajo; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (esBlanco(x, y)) {
        izquierda = Math.min(izquierda, x);
        derecha = Math.max(derecha, x);
      }
    }
  }

  return {
    left: izquierda,
    top: arriba,
    width: derecha - izquierda + 1,
    height: abajo - arriba + 1,
  };
}

/**
 * Convierte el recorte —letras blancas sobre negro— en letras blancas con transparencia.
 *
 * <p>Componer el recorte tal cual dejaría su fondo negro encima del azul. Usar su luminancia
 * como canal alfa conserva el suavizado de los bordes, que es lo que hace que las letras no
 * se vean dentadas a tamaños pequeños.
 */
async function letrasTransparentes(recorte, ancho, alto) {
  const escalado = await sharp(recorte).resize(ancho, alto, { fit: 'fill' }).toBuffer();
  const alfa = await sharp(escalado).greyscale().toColourspace('b-w').raw().toBuffer();
  const blanco = await sharp({
    create: { width: ancho, height: alto, channels: 3, background: '#ffffff' },
  })
    .raw()
    .toBuffer();

  return sharp(blanco, { raw: { width: ancho, height: alto, channels: 3 } })
    .joinChannel(alfa, { raw: { width: ancho, height: alto, channels: 1 } })
    .png()
    .toBuffer();
}

/** Baldosa azul con las letras centradas. `redondear` a false para el icono de iOS. */
async function icono(recorte, proporcion, lado, redondear) {
  const anchoLetras = Math.round(lado * OCUPACION_LETRAS);
  const altoLetras = Math.max(1, Math.round(anchoLetras / proporcion));
  const letras = await letrasTransparentes(recorte, anchoLetras, altoLetras);

  const radio = redondear ? Math.round(lado * RADIO) : 0;
  const fondo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
       <rect width="${lado}" height="${lado}" rx="${radio}" fill="${AZUL_MARCA}"/>
     </svg>`,
  );

  return sharp(fondo)
    .composite([
      {
        input: letras,
        left: Math.round((lado - anchoLetras) / 2),
        top: Math.round((lado - altoLetras) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

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

// El maestro se aplana sobre negro a proposito: el SVG trae fondo negro y aplanarlo deja el
// blanco de las letras como el unico claro de la imagen, que es lo que busca la deteccion.
const maestro = await sharp(VECTOR, { density: 96 })
  .resize(LADO_MAESTRO, LADO_MAESTRO)
  .flatten({ background: '#000000' })
  .png()
  .toBuffer();

const caja = await cajaDeLasLetras(maestro);
const recorte = await sharp(maestro).extract(caja).png().toBuffer();
const proporcion = caja.width / caja.height;

const imagenes = await Promise.all(
  TAMANIOS_ICO.map(async (lado) => ({
    lado,
    datos: await icono(recorte, proporcion, lado, true),
  })),
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

// El de iOS va sin esquinas redondeadas: el sistema aplica su propia máscara encima, y
// redondear dos veces deja una orla del color de fondo asomando en las esquinas.
await writeFile(
  `${PUBLICO}apple-touch-icon.png`,
  await icono(recorte, proporcion, TAMANIO_APPLE, false),
);

// Descarta huellas anteriores para que no se acumulen huérfanas en la imagen publicada.
for (const viejo of await readdir(PUBLICO)) {
  if (/^favicon\.[0-9a-f]{8}\.ico$/.test(viejo) && viejo !== `favicon.${huella}.ico`) {
    await unlink(`${PUBLICO}${viejo}`);
    console.warn(`  huella anterior descartada: ${viejo}`);
  }
}

console.warn(`letras detectadas      ${caja.width}x${caja.height} px en ${caja.left},${caja.top}`);
console.warn(`favicon.ico            ${TAMANIOS_ICO.join('/')} px`);
console.warn(`favicon.${huella}.ico   ← esta es la que enlaza index.html`);
console.warn(`apple-touch-icon.png   ${TAMANIO_APPLE}x${TAMANIO_APPLE} px`);
