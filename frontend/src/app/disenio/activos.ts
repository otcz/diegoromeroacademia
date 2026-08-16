/**
 * Manifiesto de imágenes de la aplicación.
 *
 * <p>Un único mapa con la ruta de cada foto que la interfaz espera. Hoy están todas en
 * `null` y cada hueco lo pinta `<adr-marco-imagen>` con un degradado del sistema.
 *
 * <p>Vive en `disenio/` y no dentro de una funcionalidad porque `<adr-marco-imagen>` es un
 * componente del catálogo: lo van a consumir la landing, la ruta de niveles y el reproductor.
 * Si el mapa viviera en un archivo de la landing, la primera pantalla interna que necesite
 * una portada lo duplicaría, y a partir de ahí las rutas divergen.
 *
 * <p><b>Cómo se añade una foto:</b> se deja el archivo en `frontend/public/imagenes/` y se
 * cambia el `null` por su ruta. Ni una plantilla, ni un `.scss`, ni un componente se tocan —
 * la relación de aspecto, el velo, el `width`/`height` y la carga diferida ya están resueltos.
 */

/** Ruta pública de una imagen, o `null` mientras no exista el archivo. */
export type RutaActivo = string | null;

export interface ManifiestoActivos {
  /** Fondo del héroe. Apaisada 16:9, mínimo 2400 px de ancho. */
  readonly heroe: RutaActivo;
  /** Captura del simulador funcionando, 16:10, dentro del marco de ventana. */
  readonly simulador: RutaActivo;
  /** Portada del curso por niveles. 3:2, mínimo 800 px. */
  readonly cursoCompleto: RutaActivo;
  /** Portada del tutorial suelto. 3:2, mínimo 800 px. */
  readonly laGotaFria: RutaActivo;
  /** Portada del tutorial suelto. 3:2, mínimo 800 px. */
  readonly losCaminosDeLaVida: RutaActivo;
  /** Detalle de una mano sobre la botonadura, en la sección «dentro de un nivel». 3:2. */
  readonly practicaBotonadura: RutaActivo;
  /** Afiche completo de la academia, para el panel de la pantalla de acceso. Vertical 9:16. */
  readonly aficheAcademia: RutaActivo;
}

/**
 * CONDICIÓN DE SALIDA: las portadas de curso desaparecen de aquí cuando el módulo `catalogo`
 * exponga `GET /api/cursos` y cada curso traiga su propia `portadaUrl`. El héroe y el
 * simulador se quedan: son activos de la página, no datos del negocio.
 */
export const ACTIVOS: ManifiestoActivos = {
  // TEMPORALES. Son las imágenes que entregó el propietario el 2026-08-15: ilustraciones
  // y material gráfico, no fotos de Diego. Se colocaron por decisión suya, conociendo sus
  // límites, y se sustituyen en cuanto haya sesión de fotos. Detalle en
  // activos/referencia/LEEME.md.
  //
  // Ninguna llega al ancho que su hueco necesita, así que se verán suaves — sobre todo el
  // héroe, que a 567 px cubre un fondo pensado para 2400.
  // Las rutas llevan HUELLA DE CONTENIDO (`.3f4f1a29.`) y las genera `imagenes:optimizar`,
  // que las imprime al terminar para copiarlas aquí. No se escriben a mano.
  //
  // Sin la huella, cambiar una foto conservando el nombre deja a las cachés sirviendo la
  // vieja: al sustituir el acordeón alpino por el Hohner Corona, Cloudflare siguió dando la
  // anterior desde el borde y la página parecía no haber cambiado. La cabecera de origen no
  // basta — el proveedor la reescribe con su propio TTL. El nombre sí manda, en toda caché.
  heroe: '/imagenes/heroe-vallenato.3f4f1a29.webp',
  cursoCompleto: '/imagenes/curso-acordeon-completo.8c2ae897.webp',
  laGotaFria: '/imagenes/curso-la-gota-fria.787a5cad.webp',
  losCaminosDeLaVida: '/imagenes/curso-los-caminos-de-la-vida.6870d3db.webp',

  // Foto de banco (licencia Pexels, uso comercial sin atribución), tratada por
  // `imagenes:tratar` con la misma receta que el resto: recorte 3:2, velo azul rey en
  // sombras y mango en luces. Es la única de las tres descargadas que muestra un acordeón
  // DIATÓNICO de botones — el vallenato. Las otras dos eran un cromático europeo y uno de
  // piano, y se descartaron: en una academia de vallenato el instrumento equivocado se nota.
  practicaBotonadura: '/imagenes/practica-botonadura.a0cb191f.webp',

  // El afiche del propietario, ENTERO y sin retocar. Es la única imagen del producto donde
  // aparece Diego, y en una marca personal eso manda: quien entra a la academia de Diego
  // Romero espera ver a Diego, no a un acordeón anónimo.
  //
  // Lleva su propia rotulación quemada —«ESTUDIO ACADÉMICO», el titular y el logotipo DR—,
  // que en la pantalla de acceso no estorba porque ese panel no tiene texto propio. Es más:
  // hoy es lo único que pone el nombre de la marca en esa pantalla.
  //
  // Va crudo, sin la receta de `imagenes:tratar`: es una pieza de diseño terminada, no una
  // foto de banco que haya que hermanar con las demás.
  aficheAcademia: '/imagenes/afiche-academia.0dda596a.webp',

  // Sigue en null a propósito: ninguna de las imágenes entregadas es una captura del
  // simulador, y el diagrama de botones que dibuja <adr-marco-imagen> con CSS y tokens
  // representa el producto mejor que una ilustración de un acordeonista.
  simulador: null,
};
