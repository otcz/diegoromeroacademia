import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACTIVOS } from './activos';

/**
 * Guarda del manifiesto de imágenes.
 *
 * <p><b>El fallo que previene.</b> Estas imágenes las pone una persona y, a diferencia de la
 * salida de Angular, conservan el nombre cuando cambia el contenido. Al sustituir un acordeón
 * alpino por el Hohner Corona correcto, el archivo mantuvo su ruta: Cloudflare siguió
 * sirviendo la foto vieja desde el borde y la página parecía no haber cambiado en absoluto.
 *
 * <p>Ninguna cabecera de origen lo resuelve de forma fiable — el proveedor reescribe el
 * `max-age` con su propio TTL de navegador. Lo único que manda en TODA caché es un nombre
 * distinto. Por eso la huella es obligatoria, y por eso lo comprueba una prueba y no una
 * costumbre: es el tipo de detalle que se olvida justo cuando hay prisa por publicar.
 */
describe('Manifiesto de activos', () => {
  const CARPETA = join(process.cwd(), 'public', 'imagenes');
  const CON_HUELLA = /\.[0-9a-f]{8}\.(webp|avif|png|jpe?g|svg)$/;

  const declarados = Object.entries(ACTIVOS).filter(
    (entrada): entrada is [string, string] => typeof entrada[1] === 'string',
  );

  it('debe declarar toda imagen con huella de contenido en el nombre', () => {
    const sinHuella = declarados.filter(([, ruta]) => !CON_HUELLA.test(ruta));

    expect(sinHuella).toEqual([]);
  });

  it('debe apuntar a archivos que existen de verdad', () => {
    // Un `null` degrada al degradado del sistema y es una decisión válida. Una ruta escrita
    // que no corresponde a ningún archivo es un hueco roto, y en producción se ve como una
    // imagen ausente sin ningún error en consola que lo explique.
    const enDisco = new Set(readdirSync(CARPETA));
    const rotas = declarados
      .map(([clave, ruta]) => [clave, ruta.replace('/imagenes/', '')] as const)
      .filter(([, archivo]) => !enDisco.has(archivo));

    expect(rotas).toEqual([]);
  });

  it('debe encontrar imagenes declaradas, para que la prueba no pase en vacio', () => {
    expect(declarados.length).toBeGreaterThan(0);
  });
});
