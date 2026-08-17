import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoServicio } from '../../nucleo/servicios/carrito-servicio';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';
import { TemaServicio } from '../../nucleo/servicios/tema-servicio';
import { Avatar } from '../componentes/avatar/avatar';
import { Icono } from '../componentes/icono/icono';
import { DisposicionServicio } from './disposicion-servicio';
import { OPCIONES_USUARIO } from './navegacion';

/**
 * Barra superior pegajosa.
 *
 * <p>De izquierda a derecha: hamburguesa, buscador, y a la derecha los iconos de
 * configuracion, carrito, tema y notificaciones, mas el menu de usuario. Por debajo de
 * 620 px se oculta el nombre y quedan solo los iconos, que es lo que cabe.
 *
 * <p>El menu de usuario se cierra al pulsar fuera y con `Esc`. Los dos escuchadores estan
 * declarados como `host` y no anadidos a mano en `ngOnInit`: asi Angular los quita al
 * destruir el componente y no queda un escuchador de `document` vivo por cada vez que se
 * monto la barra.
 */
@Component({
  selector: 'adr-barra-superior',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Icono, RouterLink],
  templateUrl: './barra-superior.html',
  styleUrl: './barra-superior.scss',
  host: {
    '(document:click)': 'cerrarSiEsFuera($event)',
    '(document:keydown.escape)': 'cerrarMenu()',
  },
})
export class BarraSuperior {
  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly cuenta = inject(CuentaServicio);

  protected readonly disposicion = inject(DisposicionServicio);
  protected readonly tema = inject(TemaServicio);
  protected readonly carrito = inject(CarritoServicio);

  protected readonly perfil = this.cuenta.perfil;
  protected readonly nombreCompleto = this.cuenta.nombreCompleto;
  protected readonly opciones = OPCIONES_USUARIO;

  /**
   * Cierra el menu cuando el clic cae fuera de la barra.
   *
   * <p>Se comprueba contra el elemento anfitrion completo y no contra el desplegable: el
   * propio boton que abre el menu esta fuera del desplegable, asi que comparar solo con el
   * panel haria que el clic de apertura se leyera tambien como clic fuera — el menu se
   * abriria y se cerraria en el mismo gesto.
   */
  protected cerrarSiEsFuera(evento: Event): void {
    if (!this.disposicion.menuUsuario()) {
      return;
    }
    if (!this.elemento.nativeElement.contains(evento.target as Node)) {
      this.disposicion.cerrarMenuUsuario();
    }
  }

  protected cerrarMenu(): void {
    this.disposicion.cerrarMenuUsuario();
  }
}
