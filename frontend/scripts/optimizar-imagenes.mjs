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
import { readdir, stat, unlink } from 'node:fs/promises';
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

const archivos = (await readdir(CARPETA)).filter((f) => CONVERTIBLES.has(extname(f).toLowerCase()));

if (archivos.length === 0) {
  console.warn('No hay JPEG ni PNG que convertir. Nada que hacer.');
}

const avisos = [];

for (const archivo of archivos) {
  const origen = join(CARPETA, archivo);
  const destino = origen.replace(/\.(jpe?g|png)$/i, '.webp');

  const { width, height } = await sharp(origen).metadata();
  const pesoAntes = (await stat(origen)).size;

  await sharp(origen).webp({ quality: CALIDAD }).toFile(destino);
  const pesoDespues = (await stat(destino)).size;

  if (pesoDespues < pesoAntes) {
    await unlink(origen);
    const ahorro = (100 - (pesoDespues / pesoAntes) * 100).toFixed(0);
    console.warn(
      `${archivo} → ${archivo.replace(/\.(jpe?g|png)$/i, '.webp')}  ` +
        `${(pesoAntes / 1024).toFixed(0)} kB → ${(pesoDespues / 1024).toFixed(0)} kB  (−${ahorro}%)`,
    );
  } else {
    await unlink(destino);
    console.warn(`${archivo}: el WebP no pesaba menos. Se conserva el original.`);
  }

  const minimo = minimoPara(archivo);
  if (minimo > 0 && width < minimo) {
    avisos.push(`  ${archivo}: ${width}×${height} — hace falta ${minimo} px de ancho`);
  }
}

if (avisos.length > 0) {
  console.warn('\nImágenes por debajo del ancho necesario para su uso:');
  console.warn(avisos.join('\n'));
  console.warn('\nSe verán borrosas. No se amplían a propósito: escalar no añade detalle.');
}
