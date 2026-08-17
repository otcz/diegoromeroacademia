import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ACTIVOS } from '../../disenio/activos';
import { AvanceEscala, Ejercicio, PasoPisada, Reto } from '../modelos/aprendizaje';

/**
 * Zona de ejercicios: rutinas cortas con metronomo y simulador.
 *
 * <p>Adaptador con datos simulados. Endpoints previstos: `GET /ejercicios`,
 * `GET /ejercicios/:id`, `POST /ejercicios/:id/repeticion`.
 *
 * <p>Cada ejercicio trae su propia pista de digitacion. En el simulador la pista NO avanza
 * con el tiempo del video sino con el **BPM** que el alumno elige, que es la diferencia de
 * fondo entre practicar y ver una clase: aqui el alumno manda la velocidad.
 */

const PISADAS_ESCALA: readonly PasoPisada[] = [
  { segundo: 0, fila: 1, boton: 3, direccion: 'abriendo', bajo: 'Do' },
  { segundo: 0.5, fila: 1, boton: 4, direccion: 'cerrando', bajo: 'Do' },
  { segundo: 1, fila: 1, boton: 5, direccion: 'abriendo', bajo: 'Do' },
  { segundo: 1.5, fila: 1, boton: 6, direccion: 'cerrando', bajo: 'Sol' },
  { segundo: 2, fila: 1, boton: 7, direccion: 'abriendo', bajo: 'Sol' },
  { segundo: 2.5, fila: 1, boton: 8, direccion: 'cerrando', bajo: 'Sol' },
  { segundo: 3, fila: 1, boton: 9, direccion: 'abriendo', bajo: 'Do' },
  { segundo: 3.5, fila: 1, boton: 10, direccion: 'cerrando', bajo: 'Do' },
];

const EJERCICIOS: readonly Ejercicio[] = [
  {
    id: 'e1',
    titulo: 'Escala de Do abriendo y cerrando',
    tipo: 'Escalas',
    nivel: 2,
    duracionSegundos: 500,
    bpmOriginal: 90,
    portada: ACTIVOS.practicaBotonadura,
    vecesPracticado: 3,
    pasos: [
      'Escala completa abriendo, sin bajos',
      'La misma escala cerrando',
      'Alternando cada dos notas',
      'Con el bajo marcando el tiempo',
    ],
    repeticionesObjetivo: 5,
    consejo:
      'Cuenta en voz alta mientras tocas. Si pierdes la cuenta, baja 10 BPM antes de volver a intentarlo.',
    pisadas: PISADAS_ESCALA,
  },
  {
    id: 'e2',
    titulo: 'Bajos alternos en paseo',
    tipo: 'Bajos',
    nivel: 2,
    duracionSegundos: 405,
    bpmOriginal: 100,
    portada: ACTIVOS.diegoTocando,
    vecesPracticado: 0,
    pasos: ['Solo bajos, sin melodía', 'Bajo y acorde alternando', 'Con el pie marcando'],
    repeticionesObjetivo: 4,
    consejo: 'El pie es el metrónomo de verdad. Si el pie se detiene, el compás ya se perdió.',
    pisadas: PISADAS_ESCALA,
  },
  {
    id: 'e3',
    titulo: 'Merengue: golpe y rebote',
    tipo: 'Ritmos',
    nivel: 3,
    duracionSegundos: 670,
    bpmOriginal: 120,
    portada: ACTIVOS.cursoCompleto,
    vecesPracticado: 1,
    pasos: ['El golpe seco', 'El rebote', 'Los dos seguidos', 'A tempo real'],
    repeticionesObjetivo: 5,
    consejo: 'El merengue vive en el rebote. Si suena parejo, todavía no es merengue.',
    pisadas: PISADAS_ESCALA,
  },
  {
    id: 'e4',
    titulo: 'Punteo rápido en tres tiempos',
    tipo: 'Velocidad',
    nivel: 3,
    duracionSegundos: 330,
    bpmOriginal: 140,
    portada: ACTIVOS.heroe,
    vecesPracticado: 0,
    pasos: ['A 90 BPM', 'A 110 BPM', 'A 140 BPM'],
    repeticionesObjetivo: 3,
    consejo: 'Sube de 10 en 10. Saltar a la velocidad final solo enseña a tocar mal más rápido.',
    pisadas: PISADAS_ESCALA,
  },
];

const RETO: Reto = {
  titulo: 'Reto de la semana · Escala de Do a 90 BPM',
  detalle: '3 de 5 días completados. Te faltan 2 sesiones de 10 minutos.',
  avance: 60,
  ejercicioId: 'e1',
};

const ESCALAS: readonly AvanceEscala[] = [
  { nombre: 'Do mayor', etiqueta: 'Limpia', avance: 100 },
  { nombre: 'Sol mayor', etiqueta: '62 %', avance: 62 },
  { nombre: 'Fa mayor', etiqueta: 'Sin empezar', avance: 0 },
];

/** Limites del control de BPM. Del handoff: 50 a 180, de cinco en cinco. */
export const BPM_MINIMO = 50;
export const BPM_MAXIMO = 180;
export const BPM_PASO = 5;

@Injectable({ providedIn: 'root' })
export class PracticaServicio {
  /** Catalogo completo de ejercicios. El filtro por tipo lo hace la pantalla. */
  ejercicios(): Observable<readonly Ejercicio[]> {
    return of(EJERCICIOS);
  }

  /** Ejercicio por identificador. Cae en el primero si el identificador no existe. */
  ejercicio(id: string): Observable<Ejercicio> {
    return of(EJERCICIOS.find((e) => e.id === id) ?? EJERCICIOS[0]);
  }

  /** Reto semanal con su avance. */
  reto(): Observable<Reto> {
    return of(RETO);
  }

  /** Progreso por escala, para la columna lateral del ejercicio guiado. */
  avanceEnEscalas(): Observable<readonly AvanceEscala[]> {
    return of(ESCALAS);
  }
}
