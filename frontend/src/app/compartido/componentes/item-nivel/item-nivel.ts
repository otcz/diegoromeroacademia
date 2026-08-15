import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icono, TamanioIcono } from '../icono/icono';
import { NombreIcono } from '../../../disenio/iconos/registro-iconos';

/** Estados posibles de una parada de la ruta. */
export type EstadoEstacion = 'completado' | 'actual' | 'bloqueado' | 'meta';

interface AspectoEstado {
  readonly icono: NombreIcono | null;
  readonly corto: string;
  readonly largo: string;
}

/**
 * Cada estado se dibuja con FORMA además de color: icono propio y texto propio.
 *
 * <p>Un candado gris y un check verde se distinguen sin ver el color; dos círculos que solo
 * difieren en tinte, no. El alumno tiene que saber qué puede abrir mirando de reojo
 * (docs/04 §5).
 */
const ASPECTO: Record<EstadoEstacion, AspectoEstado> = {
  completado: { icono: 'check-circle', corto: 'Aprobado', largo: 'Nivel aprobado' },
  actual: { icono: null, corto: 'Disponible', largo: 'Disponible ahora' },
  bloqueado: { icono: 'lock', corto: 'Bloqueado', largo: 'Se abre al aprobar el examen anterior' },
  meta: { icono: 'seal-check', corto: 'Certificado', largo: 'Certificado verificable' },
};

/**
 * Una parada de la ruta de aprendizaje (docs/04 §3).
 *
 * <p>Se usa en dos sitios con la misma pieza: la landing la muestra en modo compacto dentro
 * del panel del héroe, y la pantalla del curso (`/curso/{slug}`) la muestra completa con
 * estado real. Que sea el mismo componente es lo que garantiza que el alumno reconozca su
 * ruta al entrar: la vio antes de registrarse.
 *
 * <p>El estado `meta` cierra la ruta con el certificado. Su marca va en azul rey y no en
 * mango: el mango solo vive en subrayados, estrellas de dificultad y etiquetas «Nuevo» o
 * «Recomendado» (regla de color 2).
 */
@Component({
  selector: 'adr-item-nivel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono],
  template: `
    <div [class]="clases()">
      <span class="adr-nivel__marca" aria-hidden="true">
        @if (icono(); as nombre) {
          <adr-icono [nombre]="nombre" [tamanio]="tamanioIcono()" />
        } @else {
          <span class="adr-nivel__numero">{{ numero() }}</span>
        }
      </span>

      <div class="adr-nivel__cuerpo">
        <p class="adr-nivel__titulo">{{ titulo() }}</p>

        @if (!compacta() && resumen(); as texto) {
          <p class="adr-nivel__resumen">{{ texto }}</p>
        }

        <p class="adr-nivel__estado">{{ textoEstado() }}</p>
      </div>
    </div>
  `,
  styleUrl: './item-nivel.scss',
})
export class ItemNivel {
  readonly estado = input.required<EstadoEstacion>();
  readonly numero = input.required<number>();
  readonly titulo = input.required<string>();

  /** Una línea sobre el contenido del nivel. Nulo mientras Diego no confirme los temarios. */
  readonly resumen = input<string | null>(null);

  /** Versión reducida para el panel del héroe: sin tarjeta, sin resumen, marca pequeña. */
  readonly compacta = input(false);

  /** Sobre la sección oscura o dentro del panel de cristal. */
  readonly sobreOscuro = input(false);

  protected readonly icono = computed(() => ASPECTO[this.estado()].icono);

  protected readonly tamanioIcono = computed<TamanioIcono>(() => (this.compacta() ? 16 : 24));

  protected readonly textoEstado = computed(() =>
    this.compacta() ? ASPECTO[this.estado()].corto : ASPECTO[this.estado()].largo,
  );

  protected readonly clases = computed(() => {
    const partes = ['adr-nivel', `adr-nivel--${this.estado()}`];
    if (this.compacta()) {
      partes.push('adr-nivel--compacta');
    }
    if (this.sobreOscuro()) {
      partes.push('adr-nivel--sobre-oscuro');
    }
    return partes.join(' ');
  });
}
