import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ACTIVOS } from '../../disenio/activos';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';
import { Boton } from '../componentes/boton/boton';
import { Icono } from '../componentes/icono/icono';
import { NAVEGACION_ESCRITORIO } from './navegacion';

/**
 * Barra lateral de escritorio (246 px).
 *
 * <p>Tres bloques de arriba abajo: identidad, navegacion y pie. El pie lleva el estado del
 * plan, Ajustes y Salir. El estado del plan esta ahi y no en la barra superior porque es lo
 * que el alumno mira cuando se pregunta «¿hasta cuando tengo esto?», y esa pregunta aparece
 * mirando el menu, no la cabecera.
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

  protected readonly entradas = NAVEGACION_ESCRITORIO;
  protected readonly logotipo = ACTIVOS.logotipo;
  protected readonly perfil = this.cuenta.perfil;

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
