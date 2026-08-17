import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { BarraProgreso } from '../../compartido/componentes/barra-progreso/barra-progreso';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Icono } from '../../compartido/componentes/icono/icono';
import { DuracionPipe } from '../../compartido/formato/pesos-pipe';
import { Reproductor } from '../../compartido/reproductor/reproductor';
import { PracticaServicio } from '../../nucleo/servicios/practica-servicio';

/**
 * Ejercicio guiado: video, metronomo, pasos y registro de repeticiones.
 *
 * <p>Las repeticiones se cuentan en el cliente y se pierden al recargar. Es deliberado y
 * temporal: sin `POST /ejercicios/:id/repeticion` no hay donde guardarlas, y un contador que
 * finja persistir es peor que uno que se ve claramente de la sesion.
 */
@Component({
  selector: 'adr-ejercicio-guiado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarraProgreso, Boton, DuracionPipe, Icono, Reproductor, RouterLink],
  templateUrl: './ejercicio-guiado.html',
  styleUrl: './ejercicio-guiado.scss',
})
export class EjercicioGuiado {
  private readonly ruta = inject(ActivatedRoute);
  private readonly practica = inject(PracticaServicio);

  protected readonly ejercicio = toSignal(
    this.ruta.paramMap.pipe(switchMap((p) => this.practica.ejercicio(p.get('id') ?? ''))),
    { initialValue: null },
  );

  protected readonly escalas = toSignal(this.practica.avanceEnEscalas(), { initialValue: [] });

  /** Repeticiones registradas hoy. Solo de esta sesion, ver el comentario de la clase. */
  protected readonly repeticiones = signal(0);

  protected readonly pasosHechos = signal(0);

  protected readonly avanceRepeticiones = computed(() => {
    const objetivo = this.ejercicio()?.repeticionesObjetivo ?? 1;
    return Math.min(100, (this.repeticiones() / objetivo) * 100);
  });

  protected registrarRepeticion(): void {
    this.repeticiones.update((n) => n + 1);
  }

  /**
   * Marca los pasos hasta el que se pulso, no solo ese.
   *
   * <p>Los pasos son secuenciales: nadie hace el cuarto sin el tercero. Marcar solo el
   * pulsado dejaria listas imposibles —el paso 4 hecho y el 1 pendiente— que luego hay que
   * interpretar en cada sitio que las lea.
   */
  protected marcarHasta(indice: number): void {
    this.pasosHechos.set(indice + 1 === this.pasosHechos() ? indice : indice + 1);
  }
}
