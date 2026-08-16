import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Icono } from '../icono/icono';
import { switchMap } from 'rxjs';

export type TipoCampo = 'text' | 'email' | 'password' | 'tel';

let contadorCampos = 0;

/**
 * Mensajes por defecto de validacion.
 *
 * <p>Viven aqui y no en cada formulario para que el alumno lea siempre la misma frase ante
 * el mismo error. Un mensaje distinto en cada pantalla se percibe como un sistema descuidado.
 */
const MENSAJES: Record<string, (error: ValidationErrors[string]) => string> = {
  required: () => 'Este campo es obligatorio',
  email: () => 'Escribe un correo válido',
  minlength: (error) => `Debe tener al menos ${error.requiredLength} caracteres`,
  maxlength: (error) => `No puede superar los ${error.requiredLength} caracteres`,
};

/**
 * Campo de formulario del catalogo (docs/04 §3).
 *
 * <p>Reune rotulo, control, texto de ayuda y error en una sola pieza, para que ningun
 * formulario tenga que volver a armar esa estructura ni decidir donde va cada cosa.
 *
 * <p>Recibe el `FormControl` directamente en vez de implementar ControlValueAccessor: es
 * mas simple de leer y de probar, y no oculta el estado del control a quien lo usa.
 *
 * <p>El error solo se muestra cuando el control ya fue tocado. Regañar al alumno mientras
 * todavia esta escribiendo es la forma mas rapida de que abandone un formulario.
 */
@Component({
  selector: 'adr-campo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icono, ReactiveFormsModule],
  template: `
    <label class="adr-campo__rotulo" [for]="idCampo">{{ etiqueta() }}</label>

    <div class="adr-campo__caja">
      <input
        class="adr-campo__control"
        [class.adr-campo__control--invalido]="mostrarError()"
        [class.adr-campo__control--con-ojo]="esContrasena()"
        [id]="idCampo"
        [type]="tipoEfectivo()"
        [formControl]="control()"
        [attr.autocomplete]="autocompletado()"
        [attr.placeholder]="marcador()"
        [attr.aria-invalid]="mostrarError()"
        [attr.aria-describedby]="mostrarError() ? idError : idAyuda"
      />

      @if (esContrasena()) {
        <button
          type="button"
          class="adr-campo__ojo"
          [attr.aria-label]="visible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          [attr.aria-pressed]="visible()"
          (click)="alternarVisibilidad()"
        >
          <adr-icono [nombre]="visible() ? 'eye-slash' : 'eye'" [tamanio]="20" />
        </button>
      }
    </div>

    @if (mostrarError()) {
      <p class="adr-campo__error" [id]="idError" role="alert">{{ mensajeError() }}</p>
    } @else if (ayuda()) {
      <p class="adr-campo__ayuda" [id]="idAyuda">{{ ayuda() }}</p>
    }
  `,
  styleUrl: './campo.scss',
})
export class Campo {
  private readonly secuencia = contadorCampos++;

  protected readonly idCampo = `adr-campo-${this.secuencia}`;
  protected readonly idError = `adr-campo-error-${this.secuencia}`;
  protected readonly idAyuda = `adr-campo-ayuda-${this.secuencia}`;

  readonly control = input.required<FormControl>();
  readonly etiqueta = input.required<string>();
  readonly tipo = input<TipoCampo>('text');
  readonly ayuda = input('');
  readonly marcador = input('');
  readonly autocompletado = input<string | null>(null);

  /**
   * Si la contrasena se esta viendo en claro.
   *
   * <p>Un campo de contrasena sin forma de verla es la causa numero uno de que alguien la
   * escriba mal tres veces y acabe bloqueado por el freno de intentos fallidos. Empieza
   * oculta: quien lo necesite la muestra, no al reves.
   */
  protected readonly visible = signal(false);

  protected readonly esContrasena = computed(() => this.tipo() === 'password');

  /** El tipo real del input. Cambiarlo es lo que muestra u oculta el texto. */
  protected readonly tipoEfectivo = computed(() =>
    this.esContrasena() && this.visible() ? 'text' : this.tipo(),
  );

  protected alternarVisibilidad(): void {
    this.visible.update((actual) => !actual);
  }

  /** Mensajes propios del formulario, que ganan sobre los de por defecto. */
  readonly mensajes = input<Record<string, string>>({});

  /**
   * Pulso de cambios del control.
   *
   * <p>`invalid`, `touched` y `errors` son propiedades normales, no signals. Sin esto, un
   * `computed` que las lea se queda congelado en su primer valor y el mensaje de error no
   * aparece nunca — la aplicacion es zoneless y nada mas dispara el redibujado.
   *
   * <p>`control.events` emite ante cambios de valor, de estado y de «tocado», que son
   * exactamente los tres que deciden si se muestra el error.
   */
  private readonly pulso = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events)),
    { initialValue: null },
  );

  protected readonly mostrarError = computed(() => {
    this.pulso();
    const control = this.control();
    return control.invalid && (control.touched || control.dirty);
  });

  protected readonly mensajeError = computed(() => {
    this.pulso();
    const errores = this.control().errors;
    if (!errores) {
      return '';
    }

    const clave = Object.keys(errores)[0];
    const propio = this.mensajes()[clave];
    if (propio) {
      return propio;
    }

    const porDefecto = MENSAJES[clave];
    return porDefecto ? porDefecto(errores[clave]) : 'El valor no es válido';
  });
}
