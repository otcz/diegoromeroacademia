import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tutorial } from '../../../nucleo/modelos/aprendizaje';
import { MinutosPipe, PesosPipe } from '../../formato/pesos-pipe';
import { BarraProgreso } from '../barra-progreso/barra-progreso';
import { Boton } from '../boton/boton';
import { Etiqueta } from '../etiqueta/etiqueta';
import { MarcoImagen } from '../marco-imagen/marco-imagen';

/**
 * Tarjeta de tutorial: portada, titulo, metadatos y la accion que corresponda.
 *
 * <p><b>La accion depende de si esta comprado, y esa es toda la logica del componente.</b>
 * Comprado y empezado → «Continuar». Comprado y sin empezar → «Ver ahora». Sin comprar →
 * «Comprar» con su precio. Tres estados en una sola tarjeta, porque el catalogo y la
 * coleccion del alumno se mezclan en la misma rejilla y dos tarjetas distintas para lo mismo
 * se separan al primer cambio.
 *
 * <p>La compra suelta da acceso PERMANENTE (no negociable 5). Por eso la etiqueta dice
 * «Comprado» y no «Incluido»: son cosas distintas y confundirlas al vencer la suscripcion es
 * el reclamo mas caro de todos.
 */
@Component({
  selector: 'adr-tarjeta-tutorial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraProgreso, Boton, Etiqueta, MarcoImagen, MinutosPipe, PesosPipe],
  templateUrl: './tarjeta-tutorial.html',
  styleUrl: './tarjeta-tutorial.scss',
})
export class TarjetaTutorial {
  readonly tutorial = input.required<Tutorial>();

  /** Compacta para el carrusel de Inicio; completa en la pantalla de Tutoriales. */
  readonly compacta = input(false);
}
