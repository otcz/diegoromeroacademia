import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Avatar } from '../../compartido/componentes/avatar/avatar';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Icono } from '../../compartido/componentes/icono/icono';
import { ItemListaComponente } from '../../compartido/componentes/item-lista/item-lista';
import { DuracionPipe } from '../../compartido/formato/pesos-pipe';
import { Reproductor } from '../../compartido/reproductor/reproductor';
import { NombreIcono } from '../../disenio/iconos/registro-iconos';
import { CatalogoServicio } from '../../nucleo/servicios/catalogo-servicio';
import { CuentaServicio } from '../../nucleo/servicios/cuenta-servicio';

/** Las tres pestañas de debajo del vídeo. */
type Pestania = 'comentarios' | 'resumen' | 'recursos';

/**
 * Reproductor de clase: vídeo, simulador, pestañas y lista de lecciones.
 *
 * <p>La pestaña que abre por defecto es **Comentarios** y no Resumen, siguiendo el handoff:
 * es donde el alumno pregunta y donde ve que hay alguien al otro lado. Un resumen se lee una
 * vez; la conversación es lo que hace volver.
 */
@Component({
  selector: 'adr-clase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar,
    BarraProgreso,
    Boton,
    Chip,
    DuracionPipe,
    Icono,
    ItemListaComponente,
    Reproductor,
    RouterLink,
  ],
  templateUrl: './clase.html',
  styleUrl: './clase.scss',
})
export class ClasePantalla {
  private readonly ruta = inject(ActivatedRoute);
  private readonly catalogo = inject(CatalogoServicio);
  private readonly cuenta = inject(CuentaServicio);

  /** Referencia al reproductor, para que los capítulos puedan saltar el tiempo. */
  private readonly reproductor = viewChild(Reproductor);

  protected readonly perfil = this.cuenta.perfil;
  protected readonly pestania = signal<Pestania>('comentarios');

  protected readonly pestanias: readonly { clave: Pestania; etiqueta: string }[] = [
    { clave: 'comentarios', etiqueta: 'Comentarios' },
    { clave: 'resumen', etiqueta: 'Resumen' },
    { clave: 'recursos', etiqueta: 'Recursos' },
  ];

  /**
   * La clase de la URL.
   *
   * <p>Se encadena con `switchMap` sobre los parametros y no se lee una vez: navegar de la
   * leccion 7 a la 8 reutiliza el mismo componente, y con una lectura unica el alumno se
   * quedaria mirando la leccion anterior con la URL nueva.
   */
  protected readonly clase = toSignal(
    this.ruta.paramMap.pipe(switchMap((params) => this.catalogo.clase(params.get('id') ?? ''))),
    { initialValue: null },
  );

  protected readonly iconoRecurso: Record<string, NombreIcono> = {
    partitura: 'file-pdf',
    pista: 'music-notes',
    diagrama: 'image-square',
    ejercicio: 'barbell',
  };

  /** Salta el vídeo al capítulo. Es lo único que la pantalla le pide al reproductor. */
  protected irACapitulo(segundo: number): void {
    this.reproductor()?.irA(segundo);
  }
}
