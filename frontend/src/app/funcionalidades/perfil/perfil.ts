import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alerta } from '../../compartido/componentes/alerta/alerta';
import { Avatar } from '../../compartido/componentes/avatar/avatar';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Campo } from '../../compartido/componentes/campo/campo';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Icono } from '../../compartido/componentes/icono/icono';
import { Interruptor } from '../../compartido/componentes/interruptor/interruptor';
import { AutenticacionServicio } from '../../nucleo/servicios/autenticacion-servicio';
import { CuentaServicio, NIVELES } from '../../nucleo/servicios/cuenta-servicio';

/**
 * Longitud minima que acepta el formulario.
 *
 * <p>Doce, igual que el objeto de valor del backend. Que coincidan importa: si aqui se
 * pidieran menos, el alumno escribiria una que el servidor rechaza y el formulario parecería
 * roto. La validacion de verdad sigue siendo la del backend — esta es solo cortesia.
 */
const LONGITUD_MINIMA = 12;

/** Estado del unico bloque de esta pantalla que habla de verdad con el backend. */
type EstadoContrasena = 'comprobando' | 'sinSesion' | 'listo' | 'guardando' | 'guardada' | 'error';

/**
 * Mi perfil: foto, datos, nivel, resumen de cuenta y seguridad.
 *
 * <p><b>Solo un bloque de esta pantalla funciona de verdad hoy: el de la contrasena.</b> Es
 * el que existia antes del rediseno y sigue hablando con `POST /api/acceso/contrasena`. Los
 * demas se dibujan con datos simulados y sus botones estan deshabilitados.
 *
 * <p>Ese bloque importa mas de lo que parece: quien entro con Google no tiene contrasena y
 * depende de Google para siempre. Aqui deja una propia y puede entrar por el formulario, que
 * es el respaldo obligatorio de la especificacion §5.1.
 *
 * <p><b>Sin sesion la pantalla ya NO redirige.</b> Antes se iba a `/acceso`, y tenia sentido
 * cuando el perfil era solo el formulario de contrasena. Ahora es una de las trece pantallas
 * que el propietario tiene que poder revisar, y un salto al formulario de ingreso la hacia
 * inalcanzable en la demostracion. Se dibuja entera y el bloque de seguridad explica que hay
 * que entrar. El dato real sigue exigiendo sesion — lo exige el backend, que es donde cuenta.
 */
@Component({
  selector: 'adr-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alerta,
    Avatar,
    Boton,
    Campo,
    Chip,
    Icono,
    Interruptor,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  private readonly autenticacion = inject(AutenticacionServicio);
  private readonly cuenta = inject(CuentaServicio);

  protected readonly usuario = this.autenticacion.usuario;
  protected readonly perfil = this.cuenta.perfil;
  protected readonly nombreCompleto = this.cuenta.nombreCompleto;
  protected readonly niveles = NIVELES;

  protected readonly estado = signal<EstadoContrasena>('comprobando');
  protected readonly mensajeError = signal('');

  /** Verificacion en dos pasos. Local: no hay endpoint que la active todavia. */
  protected readonly dosPasos = signal(false);

  protected readonly formulario = new FormGroup({
    contrasena: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(LONGITUD_MINIMA)],
    }),
  });

  constructor() {
    this.autenticacion
      .sesionActual()
      .subscribe((usuario) => this.estado.set(usuario === null ? 'sinSesion' : 'listo'));
  }

  protected elegirNivel(nivel: string): void {
    this.cuenta.establecerNivel(nivel);
  }

  protected alternarDosPasos(): void {
    this.dosPasos.update((v) => !v);
  }

  /**
   * Guarda la contrasena.
   *
   * <p>Si el formulario es invalido se marca el campo como tocado para que el error aparezca:
   * un boton que no responde es lo que hace creer al alumno que la pagina se rompio.
   */
  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.estado.set('guardando');
    this.mensajeError.set('');

    this.autenticacion.establecerContrasena(this.formulario.controls.contrasena.value).subscribe({
      next: () => {
        this.estado.set('guardada');
        // Se limpia en cuanto se guarda: no tiene por que seguir en pantalla, ni en memoria,
        // ni quedar a mano de quien pase por delante del computador.
        this.formulario.reset();
      },
      error: (fallo: Error) => {
        this.estado.set('error');
        this.mensajeError.set(fallo.message);
      },
    });
  }
}
