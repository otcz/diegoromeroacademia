import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
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
  imports: [ReactiveFormsModule],
  template: `
    <label class="adr-campo__rotulo" [for]="idCampo">{{ etiqueta() }}</label>

    <input
      class="adr-campo__control"
      [class.adr-campo__control--invalido]="mostrarError()"
      [id]="idCampo"
      [type]="tipo()"
      [formControl]="control()"
      [attr.autocomplete]="autocompletado()"
      [attr.placeholder]="marcador()"
      [attr.aria-invalid]="mostrarError()"
      [attr.aria-describedby]="mostrarError() ? idError : idAyuda"
    />

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
