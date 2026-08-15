import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RutaNiveles } from '../../../compartido/componentes/ruta-niveles/ruta-niveles';
import { ESTACIONES } from '../landing.contenido';

/**
 * La ruta, a tamaño completo: la pieza central de la página.
 *
 * <p>Es el mismo componente que verá el alumno dentro, en `/curso/{slug}`, con su progreso
 * real. Que lo reconozca al entrar no es casualidad: lo vio antes de registrarse.
 */
@Component({
  selector: 'adr-seccion-ruta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RutaNiveles],
  template: `
    <section id="ruta" class="adr-seccion ruta">
      <div class="adr-contenedor">
        <p class="adr-kicker adr-kicker--azul">La ruta</p>
        <h2 class="adr-titulo-seccion">Cuatro niveles, un camino.</h2>

        <adr-ruta-niveles [estaciones]="estaciones" orientacion="auto" />

        <p class="adr-nota">Cada nivel se abre al aprobar el examen del anterior.</p>
      </div>
    </section>
  `,
  styleUrl: './seccion-ruta.scss',
})
export class SeccionRuta {
  protected readonly estaciones = ESTACIONES;
}
