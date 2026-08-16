import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Boton } from '../../compartido/componentes/boton/boton';
import { NavPublica } from '../../compartido/componentes/nav-publica/nav-publica';

/**
 * Pantalla 404.
 *
 * <p>Sustituye al `redirectTo: ''` que tenia el comodin. Un redirect silencioso devuelve al
 * visitante a la portada sin decirle nada, asi que un enlace roto se ve exactamente igual que
 * un enlace que funciona — y por eso los ocho botones de la landing pudieron apuntar durante
 * semanas a una ruta inexistente sin que nadie lo notara. Una pantalla que dice «esto no
 * existe» convierte ese fallo en visible el primer dia.
 *
 * <p>Lleva la navegacion publica para que el visitante tenga salida sin usar el boton atras.
 */
@Component({
  selector: 'adr-no-encontrado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, NavPublica],
  template: `
    <adr-nav-publica />

    <section class="adr-seccion">
      <div class="adr-contenedor no-encontrado">
        <p class="adr-kicker adr-kicker--azul">Error 404</p>
        <h1 class="adr-titulo-seccion">Esta página no existe.</h1>
        <p class="adr-texto-secundario no-encontrado__detalle">
          El enlace que seguiste está roto o la página se movió.
        </p>
        <adr-boton variante="primario" enlace="/">Volver al inicio</adr-boton>
      </div>
    </section>
  `,
  styles: `
    .no-encontrado {
      max-width: 44ch;
      padding-block: var(--adr-espacio-8);
    }

    .no-encontrado__detalle {
      margin-block: var(--adr-espacio-4) var(--adr-espacio-6);
    }
  `,
})
export class NoEncontrado {}
