// Marcas de terceros. NO es el sistema de iconos del proyecto — ver ADR 0010.
//
// Un icono comunica una idea y por eso se tine con `currentColor` y sale de una sola
// libreria (Phosphor, ADR 0005). Una marca IDENTIFICA a su dueno: su forma y sus colores
// los fija el titular, no nosotros. Google exige su «G» de cuatro colores, sin recolorear
// y sin sustituir, en cualquier boton que diga «Continuar con Google».
//
// Por eso viven aparte, se escriben a mano y no pasan por `npm run iconos:generar`.

/** Una marca: su dibujo y el sistema de coordenadas en que fue dibujada. */
export interface Marca {
  readonly viewBox: string;
  readonly contenido: string;
  /** Nombre legible del titular, para el texto alternativo. */
  readonly titular: string;
}

/**
 * Marcas registradas.
 *
 * <p>Cada trazo lleva su color escrito a proposito: es lo unico del proyecto que NO usa
 * tokens (regla 15). El azul de Google no es nuestro y no puede seguir nuestra paleta.
 */
export const MARCAS = {
  // Fuente: identidad oficial de «Iniciar sesion con Google».
  google: {
    viewBox: '0 0 48 48',
    titular: 'Google',
    contenido:
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>',
  },
  // Fuente: identidad oficial de «Iniciar sesion con Facebook».
  facebook: {
    viewBox: '0 0 36 36',
    titular: 'Facebook',
    contenido:
      '<path fill="#1877F2" d="M36 18C36 8.06 27.94 0 18 0S0 8.06 0 18c0 8.98 6.58 16.43 15.19 17.78V23.2h-4.57V18h4.57v-3.96c0-4.51 2.69-7 6.8-7 1.97 0 4.03.35 4.03.35v4.43h-2.27c-2.24 0-2.94 1.39-2.94 2.81V18h5l-.8 5.2h-4.2v12.58C29.42 34.43 36 26.98 36 18z"/>' +
      '<path fill="#FFF" d="M25.01 23.2l.8-5.2h-5v-3.37c0-1.42.7-2.81 2.94-2.81h2.27V7.39s-2.06-.35-4.03-.35c-4.11 0-6.8 2.49-6.8 7V18h-4.57v5.2h4.57v12.58a18.1 18.1 0 005.62 0V23.2h4.2z"/>',
  },
  // Fuente: identidad oficial de YouTube. El boton de reproduccion, con su rojo de marca.
  youtube: {
    viewBox: '0 0 24 24',
    titular: 'YouTube',
    contenido:
      '<path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>' +
      '<path fill="#FFF" d="M9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>',
  },
} as const satisfies Record<string, Marca>;

/** Nombres validos de marca. Uno fuera de esta lista no compila. */
export type NombreMarca = keyof typeof MARCAS;
