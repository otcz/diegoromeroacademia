import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Icono } from '../../compartido/componentes/icono/icono';
import { Interruptor } from '../../compartido/componentes/interruptor/interruptor';
import { Idioma } from '../../nucleo/modelos/cuenta';
import {
  CuentaServicio,
  FILAS_NOTIFICACION,
  FILAS_REPRODUCCION,
  IDIOMAS,
} from '../../nucleo/servicios/cuenta-servicio';
import { TemaServicio } from '../../nucleo/servicios/tema-servicio';

/**
 * Ajustes: notificaciones, idioma, reproduccion y tema.
 *
 * <p>No hay boton de «Guardar». Cada interruptor escribe al instante y se persiste solo: es
 * lo que espera cualquiera en una pantalla de preferencias de 2026, y un guardado explicito
 * solo anade una forma de perder los cambios al salir sin pulsarlo.
 *
 * <p>El tema comparte servicio con el interruptor de la barra superior, asi que los dos
 * mandos dicen siempre lo mismo.
 */
@Component({
  selector: 'adr-ajustes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Chip, Icono, Interruptor, RouterLink],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.scss',
})
export class Ajustes {
  private readonly cuenta = inject(CuentaServicio);

  protected readonly tema = inject(TemaServicio);

  protected readonly preferencias = this.cuenta.preferencias;
  protected readonly filasNotificacion = FILAS_NOTIFICACION;
  protected readonly filasReproduccion = FILAS_REPRODUCCION;
  protected readonly idiomas = IDIOMAS;

  protected alternarNotificacion(clave: (typeof FILAS_NOTIFICACION)[number]['clave']): void {
    this.cuenta.alternarNotificacion(clave);
  }

  protected alternarReproduccion(clave: (typeof FILAS_REPRODUCCION)[number]['clave']): void {
    this.cuenta.alternarReproduccion(clave);
  }

  protected elegirIdioma(idioma: Idioma): void {
    this.cuenta.establecerIdioma(idioma);
  }
}
