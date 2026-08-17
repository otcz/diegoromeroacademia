import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith, tap } from 'rxjs';
import { BarraLateral } from './barra-lateral';
import { BarraSuperior } from './barra-superior';
import { DisposicionServicio } from './disposicion-servicio';
import { NavInferior } from './nav-inferior';
import { PanelCarrito } from './panel-carrito';

/**
 * Armazon de la aplicacion del estudiante.
 *
 * <p>Compone barra lateral, barra superior, contenido, barra inferior de movil y panel del
 * carrito. Es la unica pieza que conoce la disposicion completa: cada pantalla se ocupa solo
 * de su contenido y se puede probar sin montar el menu.
 *
 * <p><b>Una sola instancia para todas las rutas hijas.</b> Al ser el componente de una ruta
 * padre, Angular no lo vuelve a crear al navegar entre secciones: la barra lateral no
 * parpadea, el carrito no se cierra y el desplazamiento de la barra se conserva.
 *
 * <p>Las tres disposiciones son la MISMA marca con reglas de ancho distintas, no tres
 * plantillas. Con plantillas separadas por dispositivo, el arreglo que se hace en una no
 * llega a las otras — y es exactamente lo que pide evitar el handoff.
 */
@Component({
  selector: 'adr-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraLateral, BarraSuperior, NavInferior, PanelCarrito, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);

  protected readonly disposicion = inject(DisposicionServicio);

  /**
   * Cierra el carrito y el menu de usuario en cada navegacion.
   *
   * <p>Sin esto, tocar «Mi perfil» en el menu navegaba y dejaba el menu abierto encima de la
   * pantalla nueva: el alumno llegaba a su perfil sin poder verlo. Con el panel del carrito
   * es peor todavia, porque tapa media pantalla.
   *
   * <p>Se lee el resultado como signal para que la suscripcion se cancele con el componente.
   * El valor no importa; lo que importa es el efecto.
   */
  protected readonly rutaActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      tap(() => this.disposicion.cerrarFlotantes()),
      map((evento) => evento.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
}
