import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Icono } from '../../compartido/componentes/icono/icono';
import { ItemListaComponente } from '../../compartido/componentes/item-lista/item-lista';
import { MinutosPipe } from '../../compartido/formato/pesos-pipe';
import { Reproductor } from '../../compartido/reproductor/reproductor';
import { NombreIcono } from '../../disenio/iconos/registro-iconos';
import { CatalogoServicio } from '../../nucleo/servicios/catalogo-servicio';

/**
 * Ver tutorial: reproductor, descripcion, recursos y lista de partes.
 *
 * <p>La cabecera dice «Comprado · acceso de por vida» porque es la diferencia de fondo entre
 * un tutorial y una clase de la suscripcion: al vencer el plan, esto sigue siendo suyo. Es
 * el no negociable 5 dicho donde el alumno lo ve, no solo cumplido en la base de datos.
 */
@Component({
  selector: 'adr-ver-tutorial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraProgreso, Boton, Icono, ItemListaComponente, MinutosPipe, Reproductor, RouterLink],
  templateUrl: './ver-tutorial.html',
  styleUrl: './ver-tutorial.scss',
})
export class VerTutorial {
  private readonly ruta = inject(ActivatedRoute);
  private readonly catalogo = inject(CatalogoServicio);

  protected readonly tutorial = toSignal(
    this.ruta.paramMap.pipe(switchMap((p) => this.catalogo.tutorial(p.get('id') ?? ''))),
    { initialValue: null },
  );

  protected readonly iconoRecurso: Record<string, NombreIcono> = {
    partitura: 'file-pdf',
    pista: 'music-notes',
    diagrama: 'image-square',
    ejercicio: 'barbell',
  };
}
