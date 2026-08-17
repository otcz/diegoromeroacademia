import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { entorno } from '../../../../entornos/entorno';
import { Icono, TamanioIcono } from '../icono/icono';
import { Marca } from '../marca/marca';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';
import { NombreMarca } from '../../../disenio/iconos/marcas';

/**
 * Variantes del boton.
 *
 * <p>No existe una variante mango: la regla de color 2 prohibe el mango en botones. Es
 * acento, no accion. Dejar la variante fuera del tipo hace que ni siquiera se pueda pedir.
 *
 * <p>`proveedor` es el boton de ingreso con un tercero (Google, Facebook). Existe aparte
 * porque no es una accion NUESTRA: la marca manda sobre el aspecto, y usar `secundario`
 * lo pintaba con la tinta del proyecto y lo invertia al pasar el raton — con el logotipo
 * de Google encima, eso es exactamente lo que su identidad no permite.
 */
export type VarianteBoton =
  'primario' | 'secundario' | 'proveedor' | 'fantasma' | 'sobre-oscuro' | 'peligro';

export type TipoBoton = 'button' | 'submit';

/**
 * Camino de la API, normalizado a ruta.
 *
 * <p>`entorno.urlApi` vale `/api` en el servidor pero `http://localhost:8080/api` en
 * desarrollo, donde el frontend y el backend viven en puertos distintos. Comparar el prefijo
 * en crudo funcionaba solo en uno de los dos entornos — lo destapo la prueba de clic.
 *
 * <p>Pasarla por `URL` deja `/api/` en los dos casos. La base es ficticia y solo sirve para
 * poder resolver una ruta relativa; nunca se usa para pedir nada.
 */
const RUTA_API = `${new URL(entorno.urlApi, 'http://base.invalida').pathname.replace(/\/$/, '')}/`;

/**
 * Boton estandar del catalogo (docs/04 §3).
 *
 * <p>Ninguna pantalla crea su propio boton. Cuando cada pantalla improvisa el suyo, las
 * alturas y los radios dejan de coincidir y la interfaz se ve armada por partes (regla 11).
 *
 * <p>Si se le pasa `enlace`, se dibuja como `<a>`; si no, como `<button>`. La distincion no
 * es estetica: navegar es lo que hace un enlace, y un lector de pantalla lo anuncia distinto.
 * Un boton que navega deja al usuario sin saber que va a cambiar de pagina.
 *
 * <p><b>Un destino interno usa `routerLink`, no `href`.</b> Con `href`, cada clic dentro de la
 * propia aplicacion recarga el paquete entero: se pierde el estado, se vuelve a descargar todo
 * y el visitante ve un parpadeo en blanco. La distincion se decide por la FORMA del destino
 * — empieza por `/` — y no por una entrada nueva, para que ninguna pantalla pueda equivocarse
 * al pedirla.
 */
@Component({
  selector: 'adr-boton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono, Marca, NgTemplateOutlet, RouterLink],
  template: `
    <!-- El contenido se declara una sola vez y se reutiliza en las dos ramas: dos
         <ng-content> en la misma plantilla no proyectan lo que uno espera. -->
    <ng-template #contenido>
      @if (marca(); as nombreMarca) {
        <adr-marca [nombre]="nombreMarca" [tamanio]="tamanioIcono" />
      } @else if (icono(); as nombreIcono) {
        <adr-icono [nombre]="nombreIcono" [tamanio]="tamanioIcono" />
      }
      <span class="adr-boton__texto"><ng-content /></span>
    </ng-template>

    @if (enlace(); as destino) {
      @if (esInterno()) {
        <a [routerLink]="destino" [class]="clases()">
          <ng-container [ngTemplateOutlet]="contenido" />
        </a>
      } @else {
        <a
          [href]="destino"
          [class]="clases()"
          [attr.target]="nuevaPestania() ? '_blank' : null"
          [attr.rel]="nuevaPestania() ? 'noopener noreferrer' : null"
        >
          <ng-container [ngTemplateOutlet]="contenido" />
        </a>
      }
    } @else {
      <button
        [type]="tipo()"
        [class]="clases()"
        [disabled]="deshabilitado() || cargando()"
        [attr.aria-busy]="cargando() ? 'true' : null"
        (click)="accion.emit()"
      >
        <ng-container [ngTemplateOutlet]="contenido" />
      </button>
    }
  `,
  styleUrl: './boton.scss',
})
export class Boton {
  protected readonly tamanioIcono: TamanioIcono = 20;

  readonly variante = input<VarianteBoton>('primario');
  readonly tipo = input<TipoBoton>('button');
  readonly deshabilitado = input(false);
  readonly cargando = input(false);
  readonly anchoCompleto = input(false);
  readonly icono = input<NombreIcono | null>(null);

  /**
   * Marca de un tercero, en vez de un icono.
   *
   * <p>Excluyente con `icono` y con prioridad sobre el: un boton lleva una cosa o la otra.
   * Dos simbolos delante del texto no dicen mas, solo hacen dudar de cual es el que manda.
   */
  readonly marca = input<NombreMarca | null>(null);

  /** Si se indica, el boton se dibuja como enlace en vez de como boton. */
  readonly enlace = input<string | null>(null);
  readonly nuevaPestania = input(false);

  readonly accion = output<void>();

  /**
   * Una ruta de ESTA aplicacion: empieza por `/` y no cuelga de la API.
   *
   * <p>Las anclas (`#planes`) y las direcciones externas (`https://`, `mailto:`) no lo son:
   * el enrutador no las conoce y convertirlas en `routerLink` las rompe.
   *
   * <p><b>Y `/api/...` tampoco lo es, aunque empiece por barra.</b> Es un endpoint del
   * servidor. Con la regla anterior —«interno si empieza por `/`»— el boton «Continuar con
   * Google» se dibujaba con `routerLink`: al pulsarlo, Angular navegaba por dentro SIN pedirle
   * nada al servidor, no encontraba la ruta y pintaba el 404. Recargando esa misma URL si
   * funcionaba, porque entonces el navegador si hacia la peticion. Un fallo que solo aparece
   * al pulsar, nunca al mirar.
   *
   * <p>El prefijo se toma de la configuracion y no se escribe aqui: el dia que la API cambie
   * de base, esto sigue siendo cierto sin que nadie se acuerde de venir.
   */
  protected readonly esInterno = computed(() => {
    const destino = this.enlace();
    return destino !== null && destino.startsWith('/') && !destino.startsWith(RUTA_API);
  });

  protected readonly clases = computed(() => {
    const partes = ['adr-boton', `adr-boton--${this.variante()}`];
    if (this.anchoCompleto()) {
      partes.push('adr-boton--ancho-completo');
    }
    if (this.cargando()) {
      partes.push('adr-boton--cargando');
    }
    return partes.join(' ');
  });
}
