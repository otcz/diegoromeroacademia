import { Pipe, PipeTransform } from '@angular/core';
import { formatearDuracion, formatearMinutos, formatearPesos } from './formato';

/**
 * Precio en pesos colombianos a partir de centavos.
 *
 * <p>Es pura: para el mismo numero devuelve siempre lo mismo, asi que Angular la evalua una
 * vez por valor y no en cada deteccion de cambios. En una rejilla de tienda con nueve
 * tarjetas eso es la diferencia entre nueve llamadas y nueve por ciclo.
 */
@Pipe({ name: 'pesos' })
export class PesosPipe implements PipeTransform {
  transform(centavos: number): string {
    return formatearPesos(centavos);
  }
}

/** Duracion «m:ss» para la barra del reproductor. */
@Pipe({ name: 'duracion' })
export class DuracionPipe implements PipeTransform {
  transform(segundos: number): string {
    return formatearDuracion(segundos);
  }
}

/** Duracion «42 min» para tarjetas y listas. */
@Pipe({ name: 'minutos' })
export class MinutosPipe implements PipeTransform {
  transform(segundos: number): string {
    return formatearMinutos(segundos);
  }
}
