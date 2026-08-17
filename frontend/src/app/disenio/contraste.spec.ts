import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Contraste AA de la capa semantica, medido en los DOS temas (ADR 0009 y ADR 0012).
 *
 * <p><b>Por que es una prueba de tokens y no de pantallas.</b> Se intento medir sobre el DOM
 * recorriendo cada texto y componiendo el fondo de sus ancestros. No funciona: en cuanto hay
 * dos superficies translucidas encima —y en el tema oscuro las tarjetas son un velo del 4%
 * sobre otro velo— la composicion acumulada se descuadra y la medida sale mal. Ese auditor
 * marcaba nueve textos correctos como fallidos y no vio ninguno de los reales.
 *
 * <p>Lo que SI se puede medir con exactitud son los pares de tokens, que es de donde salen
 * todos los textos: si cada escalon de texto cumple sobre cada superficie donde se usa,
 * cumple en las trece pantallas. Y ademas falla en el sitio util — sobre el valor que hay que
 * cambiar, no sobre un `<span>` de una pantalla concreta.
 *
 * <p>El ADR 0009 fijo el 4,5:1 de docs/04 §5. Esta prueba lo defiende ahora tambien en
 * oscuro, que es lo que el ADR 0012 anadio al sistema.
 */
describe('Contraste de la capa semantica', () => {
  const TOKENS = readFileSync(join(process.cwd(), 'src', 'app', 'disenio', '_tokens.scss'), 'utf8');

  /** Minimo de docs/04 §5 para texto normal. */
  const MINIMO_TEXTO = 4.5;

  type Color = readonly [number, number, number, number];

  /**
   * Lee las declaraciones de un bloque.
   *
   * <p>El archivo tiene varios `:root` —paleta, capa semantica y alias— y todos aportan al
   * tema claro, asi que se acumulan en orden: gana el ultimo, igual que en CSS.
   */
  function declaraciones(selector: string): Map<string, string> {
    const mapa = new Map<string, string>();
    const bloques = TOKENS.split(/\n(?=[.:[\w])/);

    for (const bloque of bloques) {
      const encabezado = bloque.slice(0, bloque.indexOf('{')).trim();
      if (encabezado !== selector) {
        continue;
      }
      for (const [, nombre, valor] of bloque.matchAll(/(--adr-[\w-]+):\s*([^;]+);/g)) {
        mapa.set(nombre, valor.trim());
      }
    }

    return mapa;
  }

  const CLARO = declaraciones(':root');
  const OSCURO = new Map([...CLARO, ...declaraciones("[data-theme='oscuro']")]);

  /** Resuelve `var(--x)` en cadena hasta llegar a un color literal. */
  function resolver(nombre: string, tema: Map<string, string>, saltos = 0): string {
    const valor = tema.get(nombre);
    if (valor === undefined) {
      throw new Error(`Token sin definir: ${nombre}`);
    }
    if (saltos > 8) {
      throw new Error(`Referencia circular en ${nombre}`);
    }
    const referencia = valor.match(/^var\((--adr-[\w-]+)\)$/);
    return referencia ? resolver(referencia[1], tema, saltos + 1) : valor;
  }

  function aColor(valor: string): Color {
    const hex = valor.match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      const n = parseInt(hex[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
    }

    const rgb = valor.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+)%)?\s*\)$/);
    if (rgb) {
      return [+rgb[1], +rgb[2], +rgb[3], rgb[4] === undefined ? 1 : +rgb[4] / 100];
    }

    throw new Error(`No se sabe leer el color: ${valor}`);
  }

  /** Compone un color con alfa sobre un fondo ya opaco. */
  function sobre(frente: Color, fondo: Color): Color {
    const a = frente[3];
    return [
      frente[0] * a + fondo[0] * (1 - a),
      frente[1] * a + fondo[1] * (1 - a),
      frente[2] * a + fondo[2] * (1 - a),
      1,
    ];
  }

  function luminancia([r, g, b]: Color): number {
    const canal = (c: number) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  }

  function razon(frente: Color, fondo: Color): number {
    const [claro, oscuro] = [luminancia(frente), luminancia(fondo)].sort((a, b) => b - a);
    return (claro + 0.05) / (oscuro + 0.05);
  }

  /**
   * Mide un token de texto sobre una pila de superficies.
   *
   * <p>La pila va de la mas honda a la mas somera: el fondo de la aplicacion primero y la
   * superficie del chip al final. Es como se apilan de verdad, y en oscuro importa — una
   * tarjeta es un velo translucido sobre otro velo.
   */
  function medir(texto: string, pila: readonly string[], tema: Map<string, string>): number {
    let fondo = aColor(resolver(pila[0], tema));
    for (const capa of pila.slice(1)) {
      fondo = sobre(aColor(resolver(capa, tema)), fondo);
    }
    return razon(sobre(aColor(resolver(texto, tema)), fondo), fondo);
  }

  /** Cada escalon de texto sobre las superficies donde se usa de verdad. */
  const TEXTOS: readonly string[] = [
    '--adr-texto-1',
    '--adr-texto-2',
    '--adr-texto-3',
    '--adr-texto-4',
    '--adr-texto-5',
    '--adr-enlace',
  ];

  const SUPERFICIES: readonly { nombre: string; pila: readonly string[] }[] = [
    { nombre: 'el fondo de la aplicacion', pila: ['--adr-fondo'] },
    { nombre: 'una tarjeta', pila: ['--adr-fondo', '--adr-superficie'] },
    { nombre: 'una tarjeta secundaria', pila: ['--adr-fondo', '--adr-superficie-2'] },
    { nombre: 'un relleno', pila: ['--adr-fondo', '--adr-superficie', '--adr-relleno-1'] },
  ];

  /** Cada tinta de estado sobre su propio fondo, dentro de una tarjeta. */
  const ESTADOS: readonly { nombre: string; texto: string; fondo: string }[] = [
    { nombre: 'azul', texto: '--adr-estado-azul-texto', fondo: '--adr-estado-azul-fondo' },
    { nombre: 'verde', texto: '--adr-estado-verde-texto', fondo: '--adr-estado-verde-fondo' },
    { nombre: 'dorado', texto: '--adr-estado-dorado-texto', fondo: '--adr-estado-dorado-fondo' },
    { nombre: 'rojo', texto: '--adr-estado-rojo-texto', fondo: '--adr-estado-rojo-fondo' },
    { nombre: 'morado', texto: '--adr-estado-morado-texto', fondo: '--adr-estado-morado-fondo' },
  ];

  const TEMAS: readonly { nombre: string; tema: Map<string, string> }[] = [
    { nombre: 'claro', tema: CLARO },
    { nombre: 'oscuro', tema: OSCURO },
  ];

  it('debe haber leido los dos temas, para que la prueba no pase en vacio', () => {
    // Sin esto, un cambio de formato en el archivo dejaria los mapas vacios y la guarda
    // pasaria siempre sin medir nada.
    expect(CLARO.size).toBeGreaterThan(40);
    expect(resolver('--adr-fondo', CLARO)).toBe('#f6f8fb');
    expect(resolver('--adr-fondo', OSCURO)).toBe('#080614');
  });

  for (const { nombre: tema, tema: mapa } of TEMAS) {
    for (const superficie of SUPERFICIES) {
      it(`debe cumplir AA en tema ${tema} sobre ${superficie.nombre}`, () => {
        const fallos = TEXTOS.map((texto) => ({
          texto,
          razon: +medir(texto, superficie.pila, mapa).toFixed(2),
        })).filter((m) => m.razon < MINIMO_TEXTO);

        expect(fallos).toEqual([]);
      });
    }

    it(`debe cumplir AA en las pastillas de estado del tema ${tema}`, () => {
      // Son texto pequenio dentro de un tinte translucido: el caso donde mas facil se cuela
      // un color que se lee bien en la maqueta y no en pantalla.
      const fallos = ESTADOS.map((estado) => ({
        estado: estado.nombre,
        razon: +medir(
          estado.texto,
          ['--adr-fondo', '--adr-superficie', estado.fondo],
          mapa,
        ).toFixed(2),
      })).filter((m) => m.razon < MINIMO_TEXTO);

      expect(fallos).toEqual([]);
    });
  }

  it('debe conservar la jerarquia de los escalones de texto en ambos temas', () => {
    // Cinco escalones que no bajan de contraste en orden no son una jerarquia: son cinco
    // grises parecidos, y el cuarto acaba usandose por accidente donde iba el segundo.
    for (const { nombre, tema } of TEMAS) {
      const medidas = [
        '--adr-texto-1',
        '--adr-texto-2',
        '--adr-texto-3',
        '--adr-texto-4',
        '--adr-texto-5',
      ].map((t) => medir(t, ['--adr-fondo'], tema));

      for (let i = 1; i < medidas.length; i++) {
        expect(medidas[i], `${nombre}: el escalon ${i + 1} no baja respecto al ${i}`).toBeLessThan(
          medidas[i - 1],
        );
      }
    }
  });
});
