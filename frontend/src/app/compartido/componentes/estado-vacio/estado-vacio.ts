import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';
import { Icono } from '../icono/icono';

/**
 * Estado vacio: icono, titulo, explicacion y la accion que corresponda.
 *
 * <p>Es uno de los cuatro estados obligatorios de `docs/04 §4`. Una lista vacia sin esto se
 * ve exactamente igual que una lista que fallo al cargar, y el alumno no tiene forma de
 * distinguir «no tienes nada todavia» de «esto esta roto».
 *
 * <p>La accion va por contenido proyectado y no como entrada de texto: cada sitio necesita
 * un boton distinto —a veces un enlace, a veces nada— y una entrada `textoAccion` obligaria
 * a anadir `rutaAccion`, `varianteAccion` y demas hasta reimplementar el boton entero.
 */
@Component({
  selector: 'adr-estado-vacio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <div class="vacio">
      <span class="vacio__icono">
        <adr-icono [nombre]="icono()" [tamanio]="24" />
      </span>
      <p class="vacio__titulo">{{ titulo() }}</p>
      @if (explicacion()) {
        <p class="vacio__explicacion">{{ explicacion() }}</p>
      }
      <div class="vacio__accion">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './estado-vacio.scss',
})
export class EstadoVacio {
  readonly icono = input.required<NombreIcono>();
  readonly titulo = input.required<string>();
  readonly explicacion = input('');
}
