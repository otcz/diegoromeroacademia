import { Injectable, computed, inject, signal } from '@angular/core';
import { AlmacenLocal } from '../../nucleo/servicios/almacen-local';

/** Clave de persistencia de la barra lateral. */
export const CLAVE_BARRA_LATERAL = 'adr-barra-lateral';

/**
 * Estado de la disposicion: barra lateral, carrito y menu de usuario.
 *
 * <p>Vive en un servicio y no en el componente del shell porque tres piezas distintas lo
 * tocan: la barra superior abre el carrito, la tarjeta de producto tambien, y el propio
 * panel se cierra a si mismo. Pasarlo por entradas y salidas obligaria a encadenar eventos
 * por tres niveles de plantilla, que es como se pierde un `close` por el camino.
 *
 * <p>La preferencia de la barra lateral se recuerda —lo pide el handoff— porque quien la
 * oculta lo hace para ganar ancho en una pantalla pequenia, y volver a ocultarla en cada
 * carga es exactamente el trabajo que se queria evitar.
 *
 * <p>El carrito y el menu de usuario NO se recuerdan: un panel abierto al entrar tapa la
 * pantalla que el alumno vino a ver.
 */
@Injectable({ providedIn: 'root' })
export class DisposicionServicio {
  private readonly almacen = inject(AlmacenLocal);

  private readonly barraLateralOculta = signal(
    this.almacen.leerTexto(CLAVE_BARRA_LATERAL) === 'oculta',
  );
  private readonly carritoAbierto = signal(false);
  private readonly menuUsuarioAbierto = signal(false);

  readonly barraLateralVisible = computed(() => !this.barraLateralOculta());
  readonly carrito = this.carritoAbierto.asReadonly();
  readonly menuUsuario = this.menuUsuarioAbierto.asReadonly();

  /** Muestra u oculta la barra lateral y lo recuerda. Es el boton de hamburguesa. */
  alternarBarraLateral(): void {
    this.barraLateralOculta.update((oculta) => !oculta);
    this.almacen.escribirTexto(
      CLAVE_BARRA_LATERAL,
      this.barraLateralOculta() ? 'oculta' : 'visible',
    );
  }

  /**
   * Abre el carrito.
   *
   * <p>Cierra el menu de usuario al hacerlo: dos capas flotantes a la vez dejan al alumno sin
   * saber cual cierra la tecla `Esc`, y en movil se tapan la una a la otra.
   */
  abrirCarrito(): void {
    this.menuUsuarioAbierto.set(false);
    this.carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

  alternarMenuUsuario(): void {
    this.carritoAbierto.set(false);
    this.menuUsuarioAbierto.update((abierto) => !abierto);
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto.set(false);
  }

  /** Cierra todo lo flotante. Lo llama el shell en cada navegacion. */
  cerrarFlotantes(): void {
    this.carritoAbierto.set(false);
    this.menuUsuarioAbierto.set(false);
  }
}
