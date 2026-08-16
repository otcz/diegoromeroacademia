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
  // Fuente: identidad oficial de TikTok. Tres capas: los desfases cian y magenta detras de la
  // nota blanca son lo que hace reconocible la marca — en monocromo se pierde.
  tiktok: {
    viewBox: '0 0 24 24',
    titular: 'TikTok',
    contenido:
      '<path fill="#25F4EE" d="M9.38 9.66v-1.2a5.9 5.9 0 0 0-.85-.07A5.9 5.9 0 0 0 5.2 19.2a5.88 5.88 0 0 1 4.18-9.54z"/>' +
      '<path fill="#25F4EE" d="M9.6 17.05a2.69 2.69 0 0 0 2.68-2.6V3.1h2.34a4.5 4.5 0 0 1-.07-.8h-3.2v11.35a2.69 2.69 0 0 1-3.99 2.31c.25.66.86 1.09 1.56 1.09z"/>' +
      '<path fill="#FE2C55" d="M18.86 7.4V6.26a4.45 4.45 0 0 1-2.42-.72 4.5 4.5 0 0 0 2.42 1.86z"/>' +
      '<path fill="#FE2C55" d="M16.44 5.54A4.48 4.48 0 0 1 15.32 2.3h-.86a4.5 4.5 0 0 0 1.98 3.24zM8.53 10.86a2.69 2.69 0 0 0-1.25 5.07 2.68 2.68 0 0 1 2.1-4.34c.28 0 .55.05.81.13V8.46a5.9 5.9 0 0 0-.85-.07h-.15v1.2a2.7 2.7 0 0 0-.66-.08z"/>' +
      '<path fill="#FFF" d="M18.86 7.4v1.2a7.7 7.7 0 0 1-4.5-1.45v6.55a5.9 5.9 0 0 1-5.89 5.89c-1.2 0-2.33-.36-3.27-.98a5.88 5.88 0 0 0 10.07-4.12V7.94a7.7 7.7 0 0 0 4.5 1.44v-1.9c-.3 0-.6-.03-.9-.09z"/>' +
      '<path fill="#FFF" d="M14.36 13.7V7.15a7.7 7.7 0 0 0 4.5 1.44V7.4a4.5 4.5 0 0 1-2.42-1.86 4.5 4.5 0 0 1-1.98-3.24h-2.18v11.35a2.69 2.69 0 0 1-4.85 1.6 2.69 2.69 0 0 1 1.25-5.07c.28 0 .55.05.81.13V8.46a5.88 5.88 0 0 0-4.18 9.54 5.87 5.87 0 0 0 3.27.98 5.9 5.9 0 0 0 5.89-5.28z"/>',
  },
  // Fuente: identidad oficial de Instagram. El degradado ES la marca: en plano se confunde
  // con cualquier otro icono de camara.
  instagram: {
    viewBox: '0 0 24 24',
    titular: 'Instagram',
    contenido:
      '<defs><linearGradient id="adr-instagram" x1="2" y1="22" x2="22" y2="2">' +
      '<stop offset="0" stop-color="#FFC107"/><stop offset=".3" stop-color="#F44336"/>' +
      '<stop offset=".6" stop-color="#9C27B0"/><stop offset="1" stop-color="#3F51B5"/>' +
      '</linearGradient></defs>' +
      '<path fill="url(#adr-instagram)" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
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
