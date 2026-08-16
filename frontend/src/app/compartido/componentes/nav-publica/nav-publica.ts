import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DESTINO_REGISTRO } from '../../../app.routes';
import { ACTIVOS } from '../../../disenio/activos';
import { Boton } from '../boton/boton';
import { RouterLink } from '@angular/router';
import { Icono } from '../icono/icono';

/**
 * Navegacion de las paginas publicas (docs/04 §3).
 *
 * <p>Vive en el catalogo y no dentro de la landing porque se repite en todas las paginas
 * abiertas: landing por instrumento, planes, verificacion de certificado. Que cada una
 * armara la suya es como empiezan a desalinearse las cabeceras.
 *
 * <p>Mobile first: en celular arranca colapsada, que es de donde viene la mayoria del
 * trafico (especificacion §14.1).
 */
@Component({
  selector: 'adr-nav-publica',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Icono, RouterLink],
  template: `
    <header class="adr-nav">
      <div class="adr-contenedor adr-nav__interior">
        <!-- El logotipo ACOMPAÑA al nombre, no lo sustituye. Dentro del logotipo «DIEGO
             ROMERO» va escrito en píxeles: a la altura de una barra no se lee, no lo lee un
             lector de pantalla y no se puede seleccionar. El texto de al lado sí hace las
             tres cosas. Por eso la imagen va con «alt» vacío — el nombre ya está ahí y
             anunciarlo dos veces seguidas estorba.
             Ancho y alto van escritos para que la barra no dé un salto al cargar. -->
        <!-- A la portada, no a un ancla. Con «#inicio» el logotipo solo funcionaba EN la
             portada: desde /acceso o /perfil se limitaba a pegar el ancla a la URL actual y
             no pasaba nada, que es lo peor que puede hacer un control — parecer pulsable y
             no responder. Con routerLink navega desde cualquier pagina y sin recargar la
             aplicacion entera; el fragmento conserva el salto al heroe cuando ya se esta en
             la portada, porque el enrutador tiene «anchorScrolling» activado. -->
        <a
          class="adr-nav__marca"
          routerLink="/"
          fragment="inicio"
          aria-label="Academia Diego Romero — inicio"
        >
          <img
            class="adr-nav__logotipo"
            [src]="logotipo"
            alt=""
            width="40"
            height="40"
            decoding="async"
          />
          <span class="adr-nav__marca-texto">
            <span class="adr-nav__marca-nombre">Diego Romero</span>
            <span class="adr-nav__marca-bajada">Academia</span>
          </span>
        </a>

        <!-- FUERA del menú colapsable a propósito. Medido en móvil: el menú está oculto,
             así que las cinco acciones viven tras la hamburguesa y entre el
             bloque del héroe (y=467) y el siguiente botón visible (y=5204) hay 4737 px —
             5,8 pantallas de argumento sin nada que pulsar, en el canal que la propia
             especificación §14.1 declara mayoritario. La barra es pegajosa; ahora lleva
             pegada una acción.

             «Empezar» y no «Registrarme»: medido, quedan ~92 px útiles entre la marca y la
             hamburguesa, y «Registrarme» (137 px) empuja la marca a tres líneas. -->
        <adr-boton
          class="adr-nav__cta-movil"
          variante="primario"
          [enlace]="destinoRegistro"
        >
          Empezar
        </adr-boton>

        <button
          type="button"
          class="adr-nav__boton"
          [attr.aria-expanded]="abierto()"
          aria-controls="menu-principal"
          aria-label="Abrir menú"
          (click)="alternar()"
        >
          <adr-icono [nombre]="abierto() ? 'x' : 'list'" [tamanio]="24" />
        </button>

        <nav id="menu-principal" class="adr-nav__menu" [class.adr-nav__menu--abierto]="abierto()">
          <a href="#catalogo" (click)="cerrar()">Cursos</a>
          <a href="#simulador" (click)="cerrar()">Simulador</a>
          <!-- «Precios» y no «Planes»: el visitante que llega de YouTube no compra software
               por internet, y ademas cabe mejor en el menu colapsado. El ancla no cambia. -->
          <a href="#planes" (click)="cerrar()">Precios</a>
          <div class="adr-nav__acciones">
            <adr-boton variante="secundario" enlace="/acceso">Entrar</adr-boton>
            <adr-boton variante="primario" [enlace]="destinoRegistro">Registrarme</adr-boton>
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './nav-publica.scss',
})
export class NavPublica {
  protected readonly destinoRegistro = DESTINO_REGISTRO;
  protected readonly logotipo = ACTIVOS.logotipo;
  protected readonly abierto = signal(false);

  /** Alterna el menu en movil. */
  protected alternar(): void {
    this.abierto.update((valor) => !valor);
  }

  /** Cierra el menu al elegir un enlace, para que no tape el destino al que se navega. */
  protected cerrar(): void {
    this.abierto.set(false);
  }
}
