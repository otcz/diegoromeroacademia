import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EstadoVacio } from '../../compartido/componentes/estado-vacio/estado-vacio';
import { TarjetaTutorial } from '../../compartido/componentes/tarjeta-tutorial/tarjeta-tutorial';
import { Boton } from '../../compartido/componentes/boton/boton';
import { CatalogoServicio } from '../../nucleo/servicios/catalogo-servicio';

/**
 * Tutoriales: la coleccion del alumno primero, el catalogo despues.
 *
 * <p>Ese orden no es casual. Lo que el alumno ya pago es suyo para siempre (no negociable 5)
 * y es lo que viene a buscar; poner el catalogo arriba convertiria su biblioteca en un
 * escaparate.
 */
@Component({
  selector: 'adr-tutoriales',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, EstadoVacio, RouterLink, TarjetaTutorial],
  templateUrl: './tutoriales.html',
  styleUrl: './tutoriales.scss',
})
export class Tutoriales {
  private readonly catalogo = inject(CatalogoServicio);

  private readonly todos = toSignal(this.catalogo.tutoriales(), { initialValue: [] });

  protected readonly recomendados = toSignal(this.catalogo.tutorialesRecomendados(), {
    initialValue: [],
  });

  protected readonly coleccion = computed(() => this.todos().filter((t) => t.comprado));
}
