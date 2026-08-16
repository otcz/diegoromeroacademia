import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alerta } from '../../compartido/componentes/alerta/alerta';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Campo } from '../../compartido/componentes/campo/campo';
import { Icono } from '../../compartido/componentes/icono/icono';
import { AutenticacionServicio } from '../../nucleo/servicios/autenticacion-servicio';
import { ACTIVOS } from '../../disenio/activos';
import { entorno } from '../../../entornos/entorno';

/** Longitud minima de contrasena aceptada por el formulario. La real la impone el backend. */
const LONGITUD_MINIMA_CONTRASENA = 8;

type EstadoAcceso = 'inactivo' | 'enviando' | 'error';

/**
 * Pantalla de acceso (pantalla 3, especificacion §6.1).
 *
 * <p>Los tres metodos de ingreso quedan jerarquizados como pide la especificacion §14.1:
 * los proveedores externos arriba, porque eliminan el soporte por contrasenas olvidadas
 * —constante en este publico—, y el correo debajo como respaldo obligatorio.
 *
 * <p>La validacion de aqui es solo comodidad para el alumno. La de verdad esta en el
 * backend: este formulario asume que puede ser sustituido por `curl` (docs/06 §2).
 */
@Component({
  selector: 'adr-acceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alerta, Boton, Campo, Icono, ReactiveFormsModule],
  templateUrl: './acceso.html',
  styleUrl: './acceso.scss',
})
export class Acceso {
  private readonly autenticacion = inject(AutenticacionServicio);

  protected readonly formulario = new FormGroup({
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    contrasena: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(LONGITUD_MINIMA_CONTRASENA)],
    }),
  });

  protected readonly estado = signal<EstadoAcceso>('inactivo');
  protected readonly mensajeError = signal('');

  /**
   * Fondo del panel de marca: Diego tocando.
   *
   * <p>Antes iba el Hohner Corona, una foto de banco del instrumento. Cambia porque esto es
   * una marca personal: quien entra a la academia de Diego Romero espera a Diego, no a un
   * acordeon anonimo. El instrumento solo no distingue esta academia de ninguna otra.
   */
  protected readonly fotoDeFondo = `url(${ACTIVOS.diegoEnTarima})`;

  protected readonly urlGoogle = this.autenticacion.urlProveedor('google');
  protected readonly urlFacebook = this.autenticacion.urlProveedor('facebook');
  protected readonly facebookHabilitado = entorno.loginFacebookHabilitado;

  /**
   * Envia las credenciales.
   *
   * <p>Si el formulario es invalido se marcan todos los campos como tocados para que los
   * errores aparezcan de golpe: dejar el boton sin respuesta visible es lo que hace que el
   * alumno crea que la pagina se rompio.
   */
  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.estado.set('enviando');
    this.mensajeError.set('');

    this.autenticacion.iniciarSesion(this.formulario.getRawValue()).subscribe({
      next: () => this.estado.set('inactivo'),
      error: (error: Error) => {
        this.estado.set('error');
        this.mensajeError.set(error.message);
      },
    });
  }
}
