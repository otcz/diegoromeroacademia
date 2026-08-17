import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Etiqueta } from '../../compartido/componentes/etiqueta/etiqueta';
import { Icono } from '../../compartido/componentes/icono/icono';
import { MarcoImagen } from '../../compartido/componentes/marco-imagen/marco-imagen';
import { EstadoAvance } from '../../nucleo/modelos/aprendizaje';
import { CatalogoServicio } from '../../nucleo/servicios/catalogo-servicio';

/** Los tres filtros de la pantalla. «todos» es el estado inicial. */
type Filtro = 'todos' | 'enCurso' | 'completado';

/**
 * Mis cursos: los niveles del alumno con su avance.
 *
 * <p>Cada tarjeta enseña lo que el alumno puede hacer AHORA con ese curso: continuar si va
 * por la mitad, descargar el certificado si lo terminó, o mejorar el plan si está bloqueado.
 * Un curso bloqueado no se oculta — ver que hay más camino es lo que hace subir de plan.
 */
@Component({
  selector: 'adr-mis-cursos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraProgreso, Boton, Chip, Etiqueta, Icono, MarcoImagen],
  templateUrl: './mis-cursos.html',
  styleUrl: './mis-cursos.scss',
})
export class MisCursos {
  private readonly catalogo = inject(CatalogoServicio);

  private readonly cursos = toSignal(this.catalogo.cursos(), { initialValue: [] });

  protected readonly filtro = signal<Filtro>('todos');

  protected readonly filtros: readonly { clave: Filtro; etiqueta: string }[] = [
    { clave: 'todos', etiqueta: 'Todos' },
    { clave: 'enCurso', etiqueta: 'En curso' },
    { clave: 'completado', etiqueta: 'Completados' },
  ];

  protected readonly visibles = computed(() => {
    const activo = this.filtro();
    return activo === 'todos'
      ? this.cursos()
      : this.cursos().filter((c) => c.estado === (activo as EstadoAvance));
  });

  protected readonly rotuloEstado: Record<EstadoAvance, string> = {
    completado: 'Completado',
    enCurso: 'En curso',
    bloqueado: 'Bloqueado',
  };
}
