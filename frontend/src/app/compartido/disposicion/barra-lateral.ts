import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ACTIVOS } from '../../disenio/activos';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';
import { Boton } from '../componentes/boton/boton';
import { Icono } from '../componentes/icono/icono';
import { DisposicionServicio } from './disposicion-servicio';
import { NAVEGACION_ESCRITORIO } from './navegacion';

/**
 * Barra lateral de escritorio: ancha (246 px) o plegada en riel de iconos (76 px).
 *
 * <p>Tres bloques de arriba abajo: identidad, navegacion y pie. El pie lleva el estado del
 * plan, Ajustes y Salir. El estado del plan esta ahi y no en la barra superior porque es lo
 * que el alumno mira cuando se pregunta «¿hasta cuando tengo esto?», y esa pregunta aparece
 * mirando el menu, no la cabecera.
 *
 * <p><b>Plegada NO es escondida.</b> Antes la hamburguesa la borraba de la pantalla y el
 * alumno se quedaba sin navegacion, con un boton que no explicaba adonde habia ido todo.
 * Ahora se reduce a sus iconos, que es la forma en que se espera ver un menu lateral plegado.
 *
 * <p>En el riel, cada rotulo sigue en el DOM con `adr-solo-lectores`: un icono solo es
 * ambiguo, asi que quien usa lector de pantalla necesita el texto, y quien usa raton lo ve en
 * el `title` al pasar por encima. Borrar el `<span>` habria dejado cinco enlaces sin nombre.
 *
 * <p>`routerLinkActive` marca la seccion activa. No se calcula comparando la URL a mano: esa
 * comparacion siempre acaba fallando con las rutas hijas —`/practica/e1` tiene que dejar
 * «Zona Ejercicios» encendida— y el enrutador ya lo resuelve.
 */
@Component({
  selector: 'adr-barra-lateral',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Icono, RouterLink, RouterLinkActive],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.scss',
})
export class BarraLateral {
  private readonly cuenta = inject(CuentaServicio);
  private readonly disposicion = inject(DisposicionServicio);

  protected readonly entradas = NAVEGACION_ESCRITORIO;
  protected readonly logotipo = ACTIVOS.logotipo;
  protected readonly perfil = this.cuenta.perfil;

  /** Cierto cuando la barra va plegada a iconos. Lo decide la hamburguesa de la cabecera. */
  protected readonly riel = computed(() => !this.disposicion.barraLateralExpandida());

  /** Nota del bloque de plan. Depende del estado, y el texto lo decide el dominio, no la vista. */
  protected readonly notaPlan: Record<string, string> = {
    activa: 'Renueva el 12 sep 2026',
    porVencer: 'Vence en 3 días',
    vencida: 'Venció el 12 ago 2026',
  };

  protected readonly rotuloEstado: Record<string, string> = {
    activa: 'Activa',
    porVencer: 'Por vencer',
    vencida: 'Vencida',
  };
}
