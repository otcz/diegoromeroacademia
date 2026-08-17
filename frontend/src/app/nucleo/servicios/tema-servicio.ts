import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { AlmacenLocal } from './almacen-local';

/** Los dos temas del sistema. No hay un tercero ni un «automatico» persistido: ver abajo. */
export type Tema = 'claro' | 'oscuro';

/**
 * Atributo que conmuta la capa semantica de `_tokens.scss`.
 *
 * <p>Solo se escribe cuando el tema es el oscuro: el claro es el valor por defecto de
 * `:root`, asi que su atributo sobra y quitarlo deja el DOM mas limpio de leer.
 */
const ATRIBUTO = 'data-theme';
const VALOR_OSCURO = 'oscuro';

/** Clave de almacenamiento. Con prefijo del proyecto: el dominio puede alojar mas cosas. */
export const CLAVE_TEMA = 'adr-tema';

/**
 * Tema visual de la aplicacion (ADR 0012).
 *
 * <p>Resuelve el tema en este orden, que es el que pide el handoff:
 *
 * <ol>
 *   <li>Lo que el alumno eligio y quedo guardado.
 *   <li>Si nunca eligio, la preferencia del sistema operativo.
 *   <li>Si el navegador no la declara, el claro — que es el diseno aprobado de la portada.
 * </ol>
 *
 * <p><b>La preferencia del sistema se lee una vez y se materializa como atributo.</b> No se
 * deja como `@media (prefers-color-scheme)` en el CSS: con la consulta de medios, el
 * interruptor no puede ganarle al sistema sin duplicar cada regla del tema, y el resultado
 * es el clasico tema a medias en el que pulsar «claro» no hace nada si el portatil esta en
 * oscuro.
 *
 * <p>No se guarda un tercer valor «automatico». Se penso y se descarto: obliga a distinguir
 * «elegi claro» de «sigo al sistema y hoy toca claro», y esa diferencia no la ve nadie en la
 * interfaz. Quien quiera volver a seguir al sistema borra el sitio de sus datos, igual que
 * en cualquier otra aplicacion.
 */
@Injectable({ providedIn: 'root' })
export class TemaServicio {
  private readonly documento = inject(DOCUMENT);
  private readonly almacen = inject(AlmacenLocal);

  private readonly temaActual = signal<Tema>(this.resolverInicial());

  /** Tema vigente. Solo lectura: se cambia por `alternar` o `establecer`. */
  readonly tema = this.temaActual.asReadonly();

  /** Atajo para las plantillas, que preguntan esto mucho mas que el valor en si. */
  readonly esOscuro = computed(() => this.temaActual() === 'oscuro');

  /** Nombre para mostrar. Vive aqui y no en cada pantalla que lo escriba a su manera. */
  readonly nombre = computed(() => (this.esOscuro() ? 'oscuro' : 'claro'));

  constructor() {
    this.aplicar(this.temaActual());
  }

  /**
   * Cambia al otro tema y lo recuerda.
   *
   * <p>Es la accion del interruptor de la barra superior y la del bloque de Ajustes: las dos
   * llaman aqui para que no puedan discrepar.
   */
  alternar(): void {
    this.establecer(this.esOscuro() ? 'claro' : 'oscuro');
  }

  /** Fija un tema concreto. Lo usa la restauracion de preferencias del alumno. */
  establecer(tema: Tema): void {
    this.temaActual.set(tema);
    this.aplicar(tema);
    this.guardar(tema);
  }

  private aplicar(tema: Tema): void {
    const raiz = this.documento.documentElement;
    if (tema === 'oscuro') {
      raiz.setAttribute(ATRIBUTO, VALOR_OSCURO);
    } else {
      raiz.removeAttribute(ATRIBUTO);
    }
  }

  private resolverInicial(): Tema {
    return this.leerGuardado() ?? (this.prefiereOscuro() ? 'oscuro' : 'claro');
  }

  private leerGuardado(): Tema | null {
    const guardado = this.almacen.leerTexto(CLAVE_TEMA);
    return guardado === 'claro' || guardado === 'oscuro' ? guardado : null;
  }

  private guardar(tema: Tema): void {
    this.almacen.escribirTexto(CLAVE_TEMA, tema);
  }

  private prefiereOscuro(): boolean {
    return (
      this.documento.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    );
  }
}
