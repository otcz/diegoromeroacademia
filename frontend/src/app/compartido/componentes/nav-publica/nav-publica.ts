import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Boton } from '../boton/boton';
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
  imports: [Boton, Icono],
  template: `
    <header class="adr-nav">
      <div class="adr-contenedor adr-nav__interior">
        <a class="adr-nav__marca" href="#inicio" aria-label="Academia Diego Romero — inicio">
          <span class="adr-nav__marca-nombre">Diego Romero</span>
          <span class="adr-nav__marca-bajada">Academia</span>
        </a>

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
          <a href="#planes" (click)="cerrar()">Planes</a>
          <div class="adr-nav__acciones">
            <adr-boton variante="secundario" enlace="/acceso">Entrar</adr-boton>
            <adr-boton variante="primario" enlace="/registro">Registrarme</adr-boton>
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './nav-publica.scss',
})
export class NavPublica {
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
