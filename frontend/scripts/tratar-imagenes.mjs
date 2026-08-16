/**
 * Trata las fotos de banco antes de publicarlas: recorta, iguala y tiñe a la marca.
 *
 *   npm run imagenes:tratar
 *
 * <p><b>El problema que resuelve.</b> Tres fotos de banco distintas, aunque cada una sea buena,
 * se ven como tres fotos de banco: distinta temperatura, distinto contraste, distinto encuadre.
 * Puestas en la misma página gritan «esto es material comprado». Lo que las convierte en un
 * conjunto no es retocarlas una a una, es pasarlas a todas por la MISMA receta.
 *
 * <p><b>Por qué el tinte es del sistema y no un gusto.</b> El velo de color usa los mismos dos
 * tintes que ya manda `_tokens.scss` — azul rey en las sombras, mango en las luces. Así la foto
 * y la interfaz comparten paleta y la página deja de parecer un collage. Los valores viven aquí
 * arriba, en una tabla, no repartidos por el código (regla 4).
 *
 * <p><b>Qué NO hace.</b> No amplía: si el origen no da el ancho que el hueco pide, lo dice y
 * sigue. No inventa nitidez sobre píxeles que no existen.
 *
 * <p>Escribe JPEG intermedio en `public/imagenes/`; el paso a WebP lo hace después
 * `imagenes:optimizar`, que ya sabe medir el ahorro y descartar conversiones que engordan.
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const CARPETA = new URL('../public/imagenes/', import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  '$1',
);
const ORIGENES = new URL('../../activos/originales/', import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  '$1',
);

/**
 * Tintes de la marca, en RGB. Espejo de `--adr-color-azul-rey` y `--adr-color-mango`
 * de `disenio/_tokens.scss`. Si allí cambian, aquí también: son el mismo color.
 */
const TINTE = {
  sombras: { r: 29, g: 107, b: 243 },
  luces: { r: 255, g: 176, b: 31 },
};

/**
 * La receta común. Un solo juego de números para todas las fotos: eso es lo que las
 * hermana. Ajustar aquí cambia el aspecto de todo el material fotográfico a la vez.
 */
const RECETA = {
  /** Opacidad del velo azul sobre la imagen completa. Por encima de .2 se nota el truco. */
  velo: 0.14,
  /** Contraste en forma de recta y = ax + b sobre cada canal. */
  contraste: { pendiente: 1.09, corte: -10 },
  /** Saturación por debajo de 1: el banco viene saturado de fábrica y compite con la marca. */
  saturacion: 0.86,
  /** Nitidez posterior al reescalado, que siempre suaviza. */
  nitidez: { sigma: 0.9 },
  calidad: 92,
};

/**
 * Qué se hace con cada archivo. `foco` es la fracción del origen que queda en el centro del
 * recorte: {x: .5, y: .35} centra el corte en el tercio superior. Se expresa en fracción y no
 * en píxeles para que siga valiendo si mañana llega la misma toma a otra resolución.
 */
const TRABAJOS = [
  {
    // La foto de Diego SIN los textos del afiche. La edito el propietario para el rediseño
    // del acceso: se recorto el rotulado impreso y se borro el destello, porque en el diseño
    // nuevo el titular es TEXTO de la interfaz y no pixeles dentro de la imagen. Con eso el
    // titular escala, se selecciona, lo lee un lector de pantalla y se traduce.
    //
    // Va CRUDA por lo mismo que el afiche: el diseño se aprobo con estos colores. Pasarla por
    // la receta —que baja saturacion y añade velo— la alejaria de lo aprobado.
    origen: 'diego-tocando.png',
    destino: 'diego-tocando.png',
    ancho: 1080,
    relacion: 1080 / 950,
    foco: { x: 0.5, y: 0.5 },
    zoom: 1,
    minimo: 900,
    crudo: true,
  },
  {
    // EL acordeon vallenato: un Hohner Corona III, con su marca a la vista. Dominio publico
    // (Wikimedia Commons, «Acordeon vallenato.jpg»), asi que no debe atribucion.
    //
    // `zoom` recorta mas cerca para dejar fuera la cara del musico del original: no tenemos
    // su consentimiento para usar su imagen en un sitio comercial, y el instrumento es lo
    // que aporta. Es el unico trabajo que lo necesita.
    origen: 'commons-acordeon-vallenato.jpg',
    destino: 'practica-botonadura.jpg',
    ancho: 1600,
    relacion: 3 / 2,
    foco: { x: 0.63, y: 0.46 },
    zoom: 0.78,
    minimo: 700,
  },
  {
    // Afiche del propietario, ENTERO. Material grafico suyo, de su propia marca, asi que no
    // hay licencia que resolver.
    //
    // Primero se recorto para dejar fuera el rotulado quemado, porque el panel llevaba
    // titular y cifras propios y dos textos se peleaban. Al vaciar el panel esa razon
    // desaparecio: hoy el afiche no compite con nada y ademas es lo unico que pone el
    // nombre de la marca en la pantalla de entrada.
    //
    // <b>Va CRUDO, sin la receta.</b> El resto de la tabla son fotos de banco y la receta
    // existe para hermanarlas. Esto no es una foto: es una pieza terminada por el disenador
    // del propietario. Bajarle la saturacion y meterle velo seria retocar el trabajo de otro
    // — y ademas el contraste extra ensucia el borde negro de las letras.
    //
    // <b>Cuadrado, del maestro a 3840x3840.</b> El propietario extendio el fondo a los lados
    // por su cuenta: esa extension, hecha dentro del afiche por quien lo diseño, es mejor
    // que la que hacia la pagina con un desenfoque en CSS.
    //
    // A 1:1 la columna mide el 56% de una pantalla 16:9 — mas de lo que pedia la version
    // 3:4, que daba el 42%. Es una eleccion del propietario y cambia el equilibrio de la
    // pantalla, no solo la imagen: quien decide cuanto pesa la marca frente al formulario es
    // el. Lo que si obligo es a cambiar el tope de la columna, que ahora sale de lo que el
    // formulario necesita para seguir siendo usable (ver `acceso.scss`).
    //
    // Se entrega a 1600 px de lado y no a los 3840 del maestro: la columna nunca pasa de
    // ~1080 px de CSS, y 1600 cubre eso con margen para pantallas de doble densidad sin
    // triplicar el peso.
    origen: 'afiche-academia.png',
    destino: 'afiche-academia.png',
    ancho: 1600,
    relacion: 1,
    foco: { x: 0.5, y: 0.5 },
    zoom: 1,
    minimo: 1000,
    crudo: true,
  },
  {
    // Imagen de vista previa al compartir el enlace. 1200x630 es lo que esperan WhatsApp,
    // Facebook y X; por debajo, recortan por su cuenta y suele salir mal.
    //
    // NO lleva huella en el nombre, a diferencia del resto: una vista previa ya compartida
    // apunta a esta URL para siempre, y renombrarla rompe cada enlace que ya circula. Se
    // sirve con revalidacion corta, que es justo el caso que cubre esa regla de nginx.
    origen: 'commons-acordeon-vallenato.jpg',
    destino: 'og-academia.jpg',
    ancho: 1200,
    relacion: 1200 / 630,
    foco: { x: 0.58, y: 0.5 },
    zoom: 1,
    minimo: 700,
  },
];

/** Capa de un color plano del tamaño pedido, para componer como velo. */
function capa(ancho, alto, color, opacidad) {
  return sharp({
    create: {
      width: ancho,
      height: alto,
      channels: 4,
      background: { ...color, alpha: opacidad },
    },
  })
    .png()
    .toBuffer();
}

/**
 * Recorta centrado en el foco, sin salirse del origen.
 *
 * <p>`sharp` sabe recortar por entropía, pero elige distinto en cada imagen y el resultado
 * deja de ser reproducible. Aquí el encuadre es un dato del trabajo, no una heurística.
 */
function recorte({ width, height }, relacion, foco, zoom = 1) {
  const maximo = Math.min(width, Math.round(height * relacion));
  const anchoCorte = Math.round(maximo * zoom);
  const altoCorte = Math.round(anchoCorte / relacion);
  const izquierda = Math.round(foco.x * width - anchoCorte / 2);
  const arriba = Math.round(foco.y * height - altoCorte / 2);
  return {
    width: anchoCorte,
    height: altoCorte,
    left: Math.max(0, Math.min(izquierda, width - anchoCorte)),
    top: Math.max(0, Math.min(arriba, height - altoCorte)),
  };
}

const avisos = [];

for (const trabajo of TRABAJOS) {
  const origen = join(ORIGENES, trabajo.origen);
  const destino = join(CARPETA, trabajo.destino);

  let bruto;
  try {
    bruto = await readFile(origen);
  } catch {
    avisos.push(`  ${trabajo.origen}: no esta en activos/originales/. Se omite.`);
    continue;
  }

  const meta = await sharp(bruto).metadata();
  const corte = recorte(meta, trabajo.relacion, trabajo.foco, trabajo.zoom);

  if (corte.width < trabajo.minimo) {
    avisos.push(
      `  ${trabajo.origen}: el recorte da ${corte.width} px y hacen falta ${trabajo.minimo}`,
    );
  }

  const ancho = Math.min(trabajo.ancho, corte.width);
  const alto = Math.round(ancho / trabajo.relacion);

  // Primero el recorte y el reescalado; el velo se compone al tamanio final para que la
  // capa de color no se reescale con la foto y pierda uniformidad.
  const base = await sharp(bruto).extract(corte).resize(ancho, alto).toBuffer();

  // Una pieza ya terminada no pasa por la receta: se reencuadra y se reescala, nada mas.
  // Y sale en PNG, sin perdida, porque lo que lleva encima es rotulacion — el JPEG le pone
  // halo a los bordes duros de las letras.
  const tratada = trabajo.crudo
    ? await sharp(base).png().toBuffer()
    : await sharp(base)
        .modulate({ saturation: RECETA.saturacion })
        .linear(RECETA.contraste.pendiente, RECETA.contraste.corte)
        .composite([
          { input: await capa(ancho, alto, TINTE.sombras, RECETA.velo), blend: 'soft-light' },
          { input: await capa(ancho, alto, TINTE.luces, RECETA.velo / 2), blend: 'overlay' },
        ])
        .sharpen(RECETA.nitidez)
        .jpeg({ quality: RECETA.calidad })
        .toBuffer();

  await writeFile(destino, tratada);
  const peso = (await stat(destino)).size;
  console.warn(
    `${trabajo.origen} → ${trabajo.destino}  ` +
      `${meta.width}x${meta.height} → ${ancho}x${alto}  ${(peso / 1024).toFixed(0)} kB`,
  );
}

if (avisos.length > 0) {
  console.warn('\nAvisos:');
  console.warn(avisos.join('\n'));
}
