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
}

/**
 * CONDICIÓN DE SALIDA: las portadas de curso desaparecen de aquí cuando el módulo `catalogo`
 * exponga `GET /api/cursos` y cada curso traiga su propia `portadaUrl`. El héroe y el
 * simulador se quedan: son activos de la página, no datos del negocio.
 */
export const ACTIVOS: ManifiestoActivos = {
  heroe: null,
  simulador: null,
  cursoCompleto: null,
  laGotaFria: null,
  losCaminosDeLaVida: null,
};
