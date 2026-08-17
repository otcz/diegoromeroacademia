import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Acceso al almacenamiento del navegador que no puede tumbar la aplicacion.
 *
 * <p><b>Por que existe.</b> `localStorage` lanza excepcion en dos situaciones que no son
 * teoricas: en el renderizado del servidor —donde el objeto no existe y prerenderizamos la
 * portada— y en Safari con navegacion privada, donde existe pero cualquier acceso tira
 * `SecurityError`. Un `JSON.parse` de basura tambien lanza. Sin este envoltorio, cada
 * servicio que persiste algo repite el mismo `try/catch` y basta que uno se olvide para
 * dejar la pantalla en blanco a quien navega en privado.
 *
 * <p>La degradacion correcta es siempre la misma: no se pudo leer, no hay valor; no se pudo
 * escribir, el dato dura lo que la pestania. Nunca un error visible: que el tema no se
 * recuerde es un inconveniente, que la aplicacion no arranque es un fallo.
 *
 * <p>Las claves llevan el prefijo `adr-` porque el dominio puede alojar mas cosas.
 */
@Injectable({ providedIn: 'root' })
export class AlmacenLocal {
  private readonly documento = inject(DOCUMENT);

  /** Lee una cadena. Nulo si no hay valor o si el almacen no esta disponible. */
  leerTexto(clave: string): string | null {
    try {
      return this.almacen()?.getItem(clave) ?? null;
    } catch {
      return null;
    }
  }

  /** Escribe una cadena. Silencioso si el almacen no esta disponible. */
  escribirTexto(clave: string, valor: string): void {
    try {
      this.almacen()?.setItem(clave, valor);
    } catch {
      // Sin almacen el valor vive en memoria. Es la degradacion correcta.
    }
  }

  /**
   * Lee un objeto serializado, con respaldo si falta o esta corrupto.
   *
   * <p>El respaldo cubre tambien el JSON invalido: un valor a medias en el almacen —por una
   * pestania cerrada a mitad de escritura, o por una version anterior del formato— no puede
   * impedir que la pantalla se dibuje.
   */
  leerObjeto<T>(clave: string, respaldo: T): T {
    const crudo = this.leerTexto(clave);
    if (crudo === null) {
      return respaldo;
    }
    try {
      return JSON.parse(crudo) as T;
    } catch {
      return respaldo;
    }
  }

  /** Serializa y escribe un objeto. */
  escribirObjeto(clave: string, valor: unknown): void {
    try {
      this.escribirTexto(clave, JSON.stringify(valor));
    } catch {
      // Una estructura con ciclos no se serializa. Tampoco puede romper nada.
    }
  }

  private almacen(): Storage | undefined {
    return this.documento.defaultView?.localStorage;
  }
}
