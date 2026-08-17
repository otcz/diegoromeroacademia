import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clase, Curso, Modulo, Tutorial } from '../modelos/aprendizaje';
import { CURSOS, MODULOS, CLASE, TUTORIALES, RECOMENDADOS } from './catalogo-datos';

/**
 * Catalogo de aprendizaje: cursos, clases y tutoriales.
 *
 * <p><b>Esto es un adaptador con datos simulados, no la implementacion definitiva.</b> Se
 * devuelve `Observable` y no el arreglo pelado a proposito: el dia que exista el backend se
 * cambia el cuerpo de cada metodo por una llamada HTTP y **ninguna pantalla se entera**. Si
 * los metodos devolvieran datos sincronos, cada pantalla tendria que reescribirse para
 * manejar la espera, y esa reescritura es justo lo que un puerto evita.
 *
 * <p>Endpoints previstos, del handoff: `GET /cursos`, `GET /clases/:id` (incluye la pista de
 * digitacion), `POST /clases/:id/avance`, `GET /tutoriales`.
 *
 * <p>Las miniaturas reutilizan la foto del artista porque todavia no hay material real por
 * leccion. Esta anotado en `docs/00-contexto.md §5` como decision pendiente 12.
 */

@Injectable({ providedIn: 'root' })
export class CatalogoServicio {
  /** Cursos inscritos del alumno, con su avance. */
  cursos(): Observable<readonly Curso[]> {
    return of(CURSOS);
  }

  /** Modulos del curso en marcha. Alimenta la ruta del panel de inicio. */
  modulosDelCursoActual(): Observable<readonly Modulo[]> {
    return of(MODULOS);
  }

  /**
   * Clase por identificador.
   *
   * <p>Devuelve siempre la misma mientras no exista catalogo real: el prototipo tiene una
   * sola leccion desarrollada y fingir cinco iguales con el titulo cambiado no anade nada
   * que se pueda revisar.
   */
  clase(_id: string): Observable<Clase> {
    return of(CLASE);
  }

  /** Tutoriales que el alumno ya compro, mas el que esta de estreno. */
  tutoriales(): Observable<readonly Tutorial[]> {
    return of(TUTORIALES);
  }

  /**
   * Solo los tutoriales que el alumno pago.
   *
   * <p>Vive aqui y no en cada pantalla porque «mi coleccion» lo preguntan dos —Inicio y
   * Tutoriales— y con el filtro repetido bastaba con que una se olvidara para ensenar un
   * boton de «Comprar» bajo el titulo «Tutoriales que compraste». Paso: el panel de Inicio
   * listaba los tres del catalogo.
   *
   * <p>La compra suelta da acceso PERMANENTE (no negociable 5), asi que esta lista no
   * depende del estado de la suscripcion.
   */
  tutorialesComprados(): Observable<readonly Tutorial[]> {
    return of(TUTORIALES.filter((tutorial) => tutorial.comprado));
  }

  /** Sugerencias de compra para el nivel del alumno. */
  tutorialesRecomendados(): Observable<readonly Tutorial[]> {
    return of(RECOMENDADOS);
  }

  /** Tutorial por identificador, con sus partes y recursos. */
  tutorial(id: string): Observable<Tutorial> {
    return of(TUTORIALES.find((t) => t.id === id) ?? TUTORIALES[0]);
  }
}
