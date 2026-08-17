import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemaServicio } from './nucleo/servicios/tema-servicio';

/** Raiz de la aplicacion. Solo aloja el enrutador: la disposicion vive en cada funcionalidad. */
@Component({
  selector: 'adr-raiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  /**
   * Instancia el tema al arrancar.
   *
   * <p>No se usa el valor: basta con que el servicio exista. Su constructor sincroniza el
   * atributo `data-theme` con lo que resolvio, que es lo que hace que el interruptor y el
   * guion inline del `index.html` no puedan discrepar.
   *
   * <p>Sin esto, el servicio solo se crearia cuando alguna pantalla lo inyectara, y el tema
   * de la aplicacion dependeria de que esa pantalla estuviera en el arbol.
   */
  protected readonly tema = inject(TemaServicio);
}
