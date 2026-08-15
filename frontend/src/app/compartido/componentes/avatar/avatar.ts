import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TamanioAvatar = 32 | 40 | 48;

/** Cuántas iniciales se muestran. Con tres, a 32 px ya no se leen. */
const MAXIMO_INICIALES = 2;

/**
 * Avatar de una persona (docs/04 §3).
 *
 * <p>Degrada a iniciales, así que **nunca necesita una foto**. Eso importa aquí: los
 * testimonios vienen de comentarios públicos del canal, donde no hay retrato ni derecho a
 * usarlo. Un hueco gris comunicaría descuido; unas iniciales, no.
 *
 * <p>El nombre completo va en `title` y en `aria-label`: las iniciales solas no identifican
 * a nadie para quien usa un lector de pantalla.
 */
@Component({
  selector: 'adr-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="adr-avatar"
      [style.width.px]="tamanio()"
      [style.height.px]="tamanio()"
      [attr.title]="nombre()"
      [attr.aria-label]="nombre()"
      role="img"
    >
      @if (foto(); as ruta) {
        <img class="adr-avatar__foto" [src]="ruta" alt="" loading="lazy" decoding="async" />
      } @else {
        <span class="adr-avatar__iniciales" aria-hidden="true">{{ iniciales() }}</span>
      }
    </span>
  `,
  styleUrl: './avatar.scss',
})
export class Avatar {
  readonly nombre = input.required<string>();
  readonly foto = input<string | null>(null);
  readonly tamanio = input<TamanioAvatar>(40);

  protected readonly iniciales = computed(() =>
    this.nombre()
      .trim()
      .split(/\s+/)
      .filter((parte) => parte.length > 0)
      .slice(0, MAXIMO_INICIALES)
      .map((parte) => parte[0].toUpperCase())
      .join(''),
  );
}
