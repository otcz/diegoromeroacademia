import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda contra el acento grave dentro de una plantilla en línea.
 *
 * <p><b>El fallo que previene.</b> Una plantilla de Angular escrita en línea vive dentro de
 * un literal de plantilla de TypeScript, delimitado por acentos graves. Escribir uno dentro
 * — al citar un selector o una propiedad CSS en un comentario HTML, que es lo natural —
 * CIERRA el literal a media plantilla. El compilador deja de ver una cadena y empieza a leer
 * el texto del comentario como código.
 *
 * <p>Los errores que produce no señalan la causa: «Cannot find name 'none'», «',' expected»,
 * «The left-hand side of an arithmetic operation must be of type 'any'», y de rebote un
 * «Component imports must be standalone components» en OTROS archivos que importan el
 * componente roto. Cuesta más leer el error que arreglarlo.
 *
 * <p>Pasó cuatro veces mientras se documentaban las correcciones de la landing, siempre por
 * el mismo motivo: querer citar con precisión. La prueba permite seguir escribiendo
 * comentarios cuidadosos y avisa en un segundo cuando el acento se cuela — con el archivo y
 * la cita, en vez de con un error de tipos a tres archivos de distancia.
 *
 * <p>Los archivos con `templateUrl` no tienen el problema: su HTML está fuera del literal.
 */
describe('Plantillas en linea', () => {
  const RAIZ = join(process.cwd(), 'src', 'app');
  const ACENTO_GRAVE = String.fromCharCode(96);

  function componentes(carpeta: string): string[] {
    return readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
      const ruta = join(carpeta, entrada.name);
      if (entrada.isDirectory()) {
        return componentes(ruta);
      }
      return entrada.name.endsWith('.ts') && !entrada.name.endsWith('.spec.ts') ? [ruta] : [];
    });
  }

  /** Devuelve el cuerpo de la plantilla en linea, o null si el componente usa templateUrl. */
  function plantillaDe(contenido: string): string | null {
    const inicio = contenido.indexOf(`template: ${ACENTO_GRAVE}`);
    if (inicio < 0) {
      return null;
    }
    const desde = inicio + `template: ${ACENTO_GRAVE}`.length;
    const fin = contenido.indexOf(ACENTO_GRAVE, desde);
    return fin < 0 ? null : contenido.slice(desde, fin);
  }

  it('no debe llevar acento grave dentro de un comentario HTML', () => {
    const infractores: string[] = [];

    for (const archivo of componentes(RAIZ)) {
      const plantilla = plantillaDe(readFileSync(archivo, 'utf8'));
      if (plantilla === null) {
        continue;
      }
      for (const comentario of plantilla.match(/<!--[\s\S]*?-->/g) ?? []) {
        if (comentario.includes(ACENTO_GRAVE)) {
          infractores.push(
            `${archivo.replace(RAIZ, '')} → ${comentario.slice(0, 60).replace(/\s+/g, ' ')}`,
          );
        }
      }
    }

    expect(infractores).toEqual([]);
  });

  it('debe encontrar plantillas que revisar, para que la prueba no pase en vacio', () => {
    const conPlantilla = componentes(RAIZ).filter(
      (a) => plantillaDe(readFileSync(a, 'utf8')) !== null,
    );

    expect(conPlantilla.length).toBeGreaterThan(10);
  });
});
