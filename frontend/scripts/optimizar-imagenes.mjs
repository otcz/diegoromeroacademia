/**
 * Convierte a WebP las imágenes de public/imagenes/ y avisa de las que se quedan cortas.
 *
 *   npm run imagenes:optimizar
 *
 * <p>WebP pesa entre un 25% y un 70% menos que JPEG o PNG a la misma calidad visual. En un
 * público que llega desde YouTube en celular, cada 100 kB son segundos de espera antes de
 * ver la promesa de la página.
 *
 * <p>El script NO amplía: una imagen pequeña se queda pequeña, y lo dice. Escalar hacia
 * arriba solo cambia el número de píxeles, no el detalle — y encima pesa más.
 *
 * <p>Es idempotente: convierte a un archivo nuevo y no toca el original hasta comprobar que
 * el resultado pesa menos. Una conversión que engorda el archivo se descarta.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir, rename, stat, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const CARPETA = new URL('../public/imagenes/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

/** Ancho mínimo por destino, según dónde se usa la imagen (ver disenio/activos.ts). */
const ANCHO_MINIMO = {
  heroe: 2400,
  curso: 800,
  simulador: 1600,
};

const CALIDAD = 82;
const CONVERTIBLES = new Set(['.jpg', '.jpeg', '.png']);

function minimoPara(nombre) {
  const clave = Object.keys(ANCHO_MINIMO).find((k) => nombre.startsWith(k));
  return clave ? ANCHO_MINIMO[clave] : 0;
}

/**
 * Huella de 8 caracteres derivada del CONTENIDO del archivo.
 *
 * <p><b>Por qué el nombre lleva huella.</b> Estas imágenes las pone una persona y conservan
 * el nombre cuando cambia el contenido. `practica-botonadura.webp` pasó de un acordeón
 * alpino a un Hohner Corona sin cambiar de ruta — y Cloudflare siguió sirviendo la vieja
 * desde el borde durante horas, porque para una caché dos archivos con la misma URL son el
 * mismo archivo. Ninguna cabecera arregla eso de forma fiable: la de origen la reescribe el
 * TTL de navegador del proveedor. Un nombre distinto sí, siempre y en cualquier caché.
 *
 * <p>Es el mismo mecanismo que Angular aplica a su propia salida (`main-P6LFKYE3.js`), y lo
 * que hace seguro cachear estos archivos un año.
 */
async function huella(ruta) {
  return createHash('sha256')
    .update(await readFile(ruta))
    .digest('hex')
    .slice(0, 8);
}

/** Nombre base sin la huella anterior, para no encadenar huellas al reconvertir. */
function sinHuella(nombre) {
  return nombre.replace(/\.[0-9a-f]{8}(\.[a-z0-9]+)$/i, '$1');
}

/**
 * Archivos que NO se convierten ni se renombran.
 *
 * <p>La vista previa social (`og-*`) queda fuera por dos razones: los rastreadores de
 * WhatsApp y Facebook no aceptan WebP de forma fiable, y su URL tiene que ser ESTABLE —
 * cada enlace ya compartido apunta a ella para siempre, así que ponerle huella rompería
 * todas las vistas previas que ya circulan.
 */
const INTOCABLES = /^og-/;

const archivos = (await readdir(CARPETA)).filter(
  (f) => CONVERTIBLES.has(extname(f).toLowerCase()) && !INTOCABLES.test(f),
);

if (archivos.length === 0) {
  console.warn('No hay JPEG ni PNG que convertir. Nada que hacer.');
}

const avisos = [];

const rutas = [];

for (const archivo of archivos) {
  const origen = join(CARPETA, archivo);
  const temporal = origen.replace(/\.(jpe?g|png)$/i, '.webp');

  const { width, height } = await sharp(origen).metadata();
  const pesoAntes = (await stat(origen)).size;

  await sharp(origen).webp({ quality: CALIDAD }).toFile(temporal);
  const pesoDespues = (await stat(temporal)).size;

  if (pesoDespues < pesoAntes) {
    await unlink(origen);
    // El nombre definitivo lleva la huella del contenido ya convertido.
    const base = sinHuella(archivo).replace(/\.(jpe?g|png)$/i, '');
    const destino = join(CARPETA, `${base}.${await huella(temporal)}.webp`);

    // Borra las huellas anteriores del MISMO motivo antes de escribir la nueva. Sin esto,
    // cada pasada deja un huerfano en la carpeta: se publican, pesan en la imagen de Docker
    // y nadie sabe cual esta en uso.
    const patron = new RegExp(`^${base}\\.[0-9a-f]{8}\\.webp$`);
    for (const viejo of await readdir(CARPETA)) {
      if (patron.test(viejo) && join(CARPETA, viejo) !== destino) {
        await unlink(join(CARPETA, viejo));
        console.warn(`  huella anterior descartada: ${viejo}`);
      }
    }

    await rename(temporal, destino);

    const ahorro = (100 - (pesoDespues / pesoAntes) * 100).toFixed(0);
    const nombreFinal = destino.slice(CARPETA.length);
    rutas.push(nombreFinal);
    console.warn(
      `${archivo} → ${nombreFinal}  ` +
        `${(pesoAntes / 1024).toFixed(0)} kB → ${(pesoDespues / 1024).toFixed(0)} kB  (−${ahorro}%)`,
    );
  } else {
    await unlink(temporal);
    console.warn(`${archivo}: el WebP no pesaba menos. Se conserva el original.`);
  }

  const minimo = minimoPara(archivo);
  if (minimo > 0 && width < minimo) {
    avisos.push(`  ${archivo}: ${width}×${height} — hace falta ${minimo} px de ancho`);
  }
}

if (rutas.length > 0) {
  console.warn('\nRutas para disenio/activos.ts:');
  for (const r of rutas) {
    console.warn(`  /imagenes/${r}`);
  }
}

if (avisos.length > 0) {
  console.warn('\nImágenes por debajo del ancho necesario para su uso:');
  console.warn(avisos.join('\n'));
  console.warn('\nSe verán borrosas. No se amplían a propósito: escalar no añade detalle.');
}
