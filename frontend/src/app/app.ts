import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Raiz de la aplicacion. Solo aloja el enrutador: la disposicion vive en cada funcionalidad. */
@Component({
  selector: 'adr-raiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
