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
 * <p><b>Va la marca ENTERA, no solo las letras.</b> Antes iba un recorte de las dos letras
 * sobre un cuadro azul, porque a 16 px la marca completa se empasta. Se legía mejor, pero la
 * pestaña mostraba «DR blanco sobre azul» y la aplicación «anillo azul sobre negro»: dos
 * marcas distintas para la misma academia, y eso confunde más de lo que aclara un icono
 * nítido. La pestaña y la aplicación tienen que enseñar lo MISMO.
 *
 * <p>Se acepta el coste: a 16 px el rótulo interior se empasta. Se compensa recortando al
 * anillo —el cuadro negro del original deja un margen que solo resta tamaño— para que la
 * marca llene la baldosa. A 32 px, que es lo que pide un navegador en pantalla de alta
 * densidad, se lee bien.
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

/** Fondo de la baldosa: el mismo negro que el logotipo lleva detras en su propio archivo. */
const FONDO = '#000000';

/** Lado del render intermedio del que se recorta la marca. */
const LADO_MAESTRO = 1024;

/** Por encima de esto, un canal ya no es «el fondo negro». Sirve para hallar la marca. */
const UMBRAL_FONDO = 40;

/**
 * Cuanto del lado ocupa la marca.
 *
 * <p>Casi todo en el ICO: el anillo ya trae su propio aire dentro. En el de iOS se deja mas
 * margen porque el sistema recorta las esquinas con su propia mascara, y sin margen el
 * anillo se queda sin sus cuatro extremos.
 */
const OCUPACION_ICO = 0.94;
const OCUPACION_APPLE = 0.82;

/** Radio de la esquina, en fracción del lado. */
const RADIO = 0.18;

/** Tamaños que exige un ICO bien formado para verse nítido en pestaña, marcador y escritorio. */
const TAMANIOS_ICO = [16, 32, 48];
const TAMANIO_APPLE = 180;

/**
 * Recorta del logotipo la caja de LA MARCA: el anillo azul con todo lo que lleva dentro.
 *
 * <p>Se BUSCA en vez de escribir las coordenadas a mano: unos numeros medidos hoy dejarian de
 * valer en silencio si el logotipo se reexporta con otro encuadre, y el fallo se veria como
 * un icono descentrado que nadie relaciona con este archivo.
 *
 * <p>El metodo aprovecha que el original es la marca sobre un cuadro NEGRO: todo lo que no es
 * ese negro pertenece al dibujo. Ese cuadro solo aporta margen, y en una baldosa de 16 px el
 * margen es tamanio que se pierde.
 */
async function cajaDeLaMarca(maestro) {
  const { data, info } = await sharp(maestro).raw().toBuffer({ resolveWithObject: true });
  const esDibujo = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return data[i] > UMBRAL_FONDO || data[i + 1] > UMBRAL_FONDO || data[i + 2] > UMBRAL_FONDO;
  };

  let izquierda = info.width;
  let derecha = -1;
  let arriba = info.height;
  let abajo = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (esDibujo(x, y)) {
        if (x < izquierda) izquierda = x;
        if (x > derecha) derecha = x;
        if (y < arriba) arriba = y;
        if (y > abajo) abajo = y;
      }
    }
  }

  if (derecha < 0) {
    throw new Error('El logotipo salio todo negro: cambio de colores o de formato.');
  }

  // Cuadrada y centrada en el dibujo: la marca es un circulo y un recorte rectangular la
  // dejaria descentrada dentro de la baldosa.
  const lado = Math.max(derecha - izquierda + 1, abajo - arriba + 1);
  const centroX = (izquierda + derecha) / 2;
  const centroY = (arriba + abajo) / 2;

  return {
    left: Math.max(0, Math.round(centroX - lado / 2)),
    top: Math.max(0, Math.round(centroY - lado / 2)),
    width: Math.min(lado, info.width),
    height: Math.min(lado, info.height),
  };
}

/** Baldosa negra con la marca centrada. `redondear` a false para el icono de iOS. */
async function icono(recorte, lado, redondear) {
  const ocupacion = redondear ? OCUPACION_ICO : OCUPACION_APPLE;
  const ladoMarca = Math.round(lado * ocupacion);
  const marca = await sharp(recorte).resize(ladoMarca, ladoMarca).png().toBuffer();

  const radio = redondear ? Math.round(lado * RADIO) : 0;
  const fondo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
       <rect width="${lado}" height="${lado}" rx="${radio}" fill="${FONDO}"/>
     </svg>`,
  );

  const centrado = Math.round((lado - ladoMarca) / 2);
  return sharp(fondo)
    .composite([{ input: marca, left: centrado, top: centrado }])
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

const caja = await cajaDeLaMarca(maestro);
const recorte = await sharp(maestro).extract(caja).png().toBuffer();

const imagenes = await Promise.all(
  TAMANIOS_ICO.map(async (lado) => ({
    lado,
    datos: await icono(recorte, lado, true),
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
  await icono(recorte, TAMANIO_APPLE, false),
);

// Descarta huellas anteriores para que no se acumulen huérfanas en la imagen publicada.
for (const viejo of await readdir(PUBLICO)) {
  if (/^favicon\.[0-9a-f]{8}\.ico$/.test(viejo) && viejo !== `favicon.${huella}.ico`) {
    await unlink(`${PUBLICO}${viejo}`);
    console.warn(`  huella anterior descartada: ${viejo}`);
  }
}

console.warn(`marca detectada       ${caja.width}x${caja.height} px en ${caja.left},${caja.top}`);
console.warn(`favicon.ico            ${TAMANIOS_ICO.join('/')} px`);
console.warn(`favicon.${huella}.ico   ← esta es la que enlaza index.html`);
console.warn(`apple-touch-icon.png   ${TAMANIO_APPLE}x${TAMANIO_APPLE} px`);
