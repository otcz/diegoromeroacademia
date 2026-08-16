/**
 * Reexporta el logotipo con el azul del sistema y produce sus variantes.
 *
 *   npm run marca:logotipo
 *
 * <p><b>Qué problema resuelve.</b> El logotipo que entregó el propietario trae su propio azul
 * —#0170BB— y el sistema visual usa otro —#1D6BF3, «azul rey»—. Dos azules parecidos pero
 * distintos en la misma pantalla no se leen como dos marcas: se leen como descuido, y es de
 * las cosas que se notan sin poder señalarlas. El propietario decidió que ceda el logotipo.
 *
 * <p><b>Por qué se genera y no se edita el archivo a mano.</b> Editar el SVG entregado
 * borraría la pieza original, que es la prueba de qué se recibió y de quién. Aquí el original
 * se queda intacto en `activos/originales/` y de él salen las versiones de trabajo. Además el
 * color sale del token: el día que el azul rey cambie, se vuelve a ejecutar esto y el
 * logotipo sigue al sistema sin abrir un editor.
 *
 * <p>Produce en `activos/marca/`:
 * <ul>
 *   <li>`logo-dr.svg` — como el original, con el azul del sistema.
 *   <li>`logo-dr-transparente.svg` — sin el cuadro negro de fondo, para poder ponerlo sobre
 *       cualquier superficie. El de fondo negro solo sirve sobre negro.
 *   <li>Un PNG de 1024 px de cada uno, para donde no se admite SVG (redes, ofimática).
 * </ul>
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const raiz = (relativa) =>
  new URL(relativa, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const ORIGINAL = raiz('../../activos/originales/logo-dr.svg');
const DESTINO = raiz('../../activos/marca/');
const PUBLICO = raiz('../public/imagenes/');

/** Espejo de `--adr-color-azul-rey` en disenio/_tokens.scss. Si allí cambia, aquí también. */
const AZUL_REY = '#1d6bf3';

/** El azul que trae el archivo entregado. Es lo que se sustituye. */
const AZUL_ENTREGADO = /#0170bb/gi;

/** Lado de los PNG de conveniencia. */
const LADO_PNG = 1024;

const original = await readFile(ORIGINAL, 'utf8');

// Si el propietario reexporta el logotipo con otro azul, esto tiene que ROMPER y no seguir
// en silencio: un archivo que sale igual que entro es el fallo mas caro de detectar.
if (!AZUL_ENTREGADO.test(original)) {
  throw new Error(
    `El logotipo ya no trae ${AZUL_ENTREGADO.source}. Revisa el original antes de reexportar.`,
  );
}
AZUL_ENTREGADO.lastIndex = 0;

const conAzulRey = original.replace(AZUL_ENTREGADO, AZUL_REY);

// El fondo es el PRIMER rectangulo del archivo, a lienzo completo. Se quita por posicion y
// no por color: dentro del dibujo hay mas negro —el disco sobre el que van las letras— y
// buscar «lo negro» se lo llevaria tambien.
const transparente = conAzulRey.replace(/<rect\b[^>]*\/>/, '');

if (transparente === conAzulRey) {
  throw new Error('No se encontro el rectangulo de fondo: el logotipo cambio de estructura.');
}

await mkdir(DESTINO, { recursive: true });

const variantes = [
  { nombre: 'logo-dr', contenido: conAzulRey },
  { nombre: 'logo-dr-transparente', contenido: transparente },
];

for (const { nombre, contenido } of variantes) {
  await writeFile(`${DESTINO}${nombre}.svg`, contenido);
  await sharp(Buffer.from(contenido), { density: 96 })
    .resize(LADO_PNG, LADO_PNG)
    .png({ compressionLevel: 9 })
    .toFile(`${DESTINO}${nombre}.png`);
  console.warn(`${nombre}.svg y .png  ${LADO_PNG}x${LADO_PNG}`);
}

// La que consume la aplicacion es la transparente: se pone sobre la barra blanca y sobre el
// pie oscuro sin arrastrar un cuadro negro detras.
//
// Va como SVG servido y no incrustado en el paquete: son 7 kB de trazados que estarian en
// cada carga aunque nadie mirase la barra, y el navegador lo cachea aparte. Y lleva HUELLA
// DE CONTENIDO en el nombre por la misma razon que las fotos: cambiar el logotipo
// conservando el nombre deja a las caches sirviendo el viejo durante horas.
const huella = createHash('sha256').update(transparente).digest('hex').slice(0, 8);
const nombreServido = `logo-dr.${huella}.svg`;

await mkdir(PUBLICO, { recursive: true });
await writeFile(`${PUBLICO}${nombreServido}`, transparente);

for (const viejo of await readdir(PUBLICO)) {
  if (/^logo-dr\.[0-9a-f]{8}\.svg$/.test(viejo) && viejo !== nombreServido) {
    await unlink(`${PUBLICO}${viejo}`);
    console.warn(`  huella anterior descartada: ${viejo}`);
  }
}

console.warn(`\nAzul ${AZUL_REY} (azul rey). El original se queda intacto en activos/originales/.`);
console.warn(`\nRuta para disenio/activos.ts:\n  /imagenes/${nombreServido}`);
