import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda contra el desborde horizontal: ninguna rejilla usa `fr` desnudo.
 *
 * <p><b>Por qué es una prueba de CÓDIGO y no de maquetación.</b> El desborde se midió en el
 * navegador real: `scrollWidth - clientWidth` daba 144 px a 768 px de ancho. Pero las pruebas
 * corren en jsdom, que no tiene motor de maquetación y devuelve 0 en `scrollWidth`,
 * `clientWidth` y `getBoundingClientRect`. Una regresión escrita contra esas medidas pasaría
 * en vacío para siempre — sería peor que no tenerla, porque daría falsa confianza.
 *
 * <p><b>La causa raíz.</b> `1fr` es azúcar de `minmax(auto, 1fr)`, y ese `auto` impone un
 * suelo de min-content que la fracción NO puede bajar. Con un precio de 22 px tabular y un
 * botón con `white-space: nowrap`, ese suelo era de 266 px por tarjeta; a 768 px el padding
 * del contenedor además se duplica justo cuando las rejillas pasan a tres columnas, así que
 * el ancho útil caía en el mismo instante en que la demanda se triplicaba.
 *
 * <p>`minmax(0, 1fr)` quita el suelo y deja que la pista encoja de verdad.
 */
describe('Rejillas del sistema visual', () => {
  // `process.cwd()` y no `import.meta.url`: bajo el servidor de pruebas, la URL del modulo
  // llega con el prefijo virtual `/@fs/` y no es una ruta de disco valida.
  const RAIZ = join(process.cwd(), 'src', 'app');

  /** Propiedades donde un `fr` desnudo produce el desborde. */
  const PROPIEDADES = /(grid-template-columns|grid-auto-columns)\s*:\s*([^;}]+)/g;

  /** `1fr`, `2fr`, `repeat(3, 1fr)`… pero NO `minmax(0, 1fr)`, que es la forma correcta. */
  const FRACCION_DESNUDA = /(^|[\s,(])[\d.]*fr\b/;

  /**
   * Sustituye cada `minmax(...)` completo por `OK`, respetando los parentesis anidados.
   *
   * <p>Antes esto era `valor.replace(/minmax\([^)]*\)/g, 'OK')`, y esa expresion se para en el
   * PRIMER parentesis de cierre. Con `minmax(min(240px, 100%), 1fr)` —el patron responsive
   * que pide el handoff— dejaba el resto `OK, 1fr)` y el `1fr` sobrevivia, asi que la guarda
   * marcaba siete rejillas correctas como infractoras.
   *
   * <p>Y ese caso es SEGURO: `min(240px, 100%)` ya limita el minimo al ancho del contenedor,
   * que es justo lo que impide el desborde que esta prueba vigila. El fallo era de la
   * expresion regular, no de las rejillas.
   */
  function sinMinmax(valor: string): string {
    let salida = '';
    let profundidad = 0;

    for (let i = 0; i < valor.length; i++) {
      const resto = valor.slice(i);
      if (profundidad === 0 && resto.startsWith('minmax(')) {
        salida += 'OK';
        profundidad = 1;
        i += 'minmax('.length - 1;
        continue;
      }
      if (profundidad > 0) {
        if (valor[i] === '(') {
          profundidad++;
        } else if (valor[i] === ')') {
          profundidad--;
        }
        continue;
      }
      salida += valor[i];
    }

    return salida;
  }

  function hojasDeEstilo(carpeta: string): string[] {
    return readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
      const ruta = join(carpeta, entrada.name);
      if (entrada.isDirectory()) {
        return hojasDeEstilo(ruta);
      }
      return entrada.name.endsWith('.scss') ? [ruta] : [];
    });
  }

  it('debe declarar toda pista de rejilla con minmax(0, ...) y nunca con fr desnudo', () => {
    const infractoras: string[] = [];

    for (const hoja of hojasDeEstilo(RAIZ)) {
      const contenido = readFileSync(hoja, 'utf8');
      for (const [, propiedad, valor] of contenido.matchAll(PROPIEDADES)) {
        // Se quitan los minmax() completos antes de buscar: lo que sobreviva es fr desnudo.
        if (FRACCION_DESNUDA.test(sinMinmax(valor))) {
          infractoras.push(`${hoja.replace(RAIZ, '')} → ${propiedad}: ${valor.trim()}`);
        }
      }
    }

    expect(infractoras).toEqual([]);
  });

  it('debe encontrar hojas que revisar, para que la prueba no pase en vacio', () => {
    // Sin esto, un cambio de ruta dejaría la lista vacía y la guarda pasaría siempre.
    expect(hojasDeEstilo(RAIZ).length).toBeGreaterThan(10);
  });
});
