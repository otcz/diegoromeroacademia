import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alerta } from '../../compartido/componentes/alerta/alerta';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Campo } from '../../compartido/componentes/campo/campo';
import { NavPublica } from '../../compartido/componentes/nav-publica/nav-publica';
import { AutenticacionServicio } from '../../nucleo/servicios/autenticacion-servicio';

/**
 * Longitud minima que acepta el formulario.
 *
 * <p>Doce, igual que el objeto de valor del backend. Que coincidan importa: si aqui se
 * pidieran menos, el alumno escribiria una que el servidor rechaza y el formulario parecería
 * roto. La validacion de verdad sigue siendo la del backend — esta es solo cortesia.
 */
const LONGITUD_MINIMA = 12;

type EstadoPerfil = 'cargando' | 'listo' | 'guardando' | 'guardada' | 'error';

/**
 * Perfil del alumno: hoy, poner o cambiar la contrasena.
 *
 * <p><b>Para que sirve.</b> Quien entro con Google no tiene contrasena, y por tanto depende
 * de Google para siempre. Aqui deja una propia y puede entrar por el formulario — que es el
 * respaldo obligatorio de la especificacion §5.1: no todos tienen Google activo, y quien
 * pierde el acceso a su cuenta de Google perderia tambien la de la academia.
 *
 * <p>La pantalla se dibuja despues de PREGUNTARLE al backend quien tiene la sesion abierta.
 * No basta con lo que el frontend recuerde: el ingreso con Google termina en una redireccion
 * y la aplicacion se recarga sin saber que alguien entro.
 *
 * <p>Si no hay sesion, se va a la pantalla de acceso. Esconder el formulario y dejar la
 * pagina vacia seria peor: el alumno no sabria si esta roto o si le falta entrar.
 */
@Component({
  selector: 'adr-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alerta, Boton, Campo, NavPublica, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  private readonly autenticacion = inject(AutenticacionServicio);
  private readonly router = inject(Router);

  protected readonly usuario = this.autenticacion.usuario;
  protected readonly estado = signal<EstadoPerfil>('cargando');
  protected readonly mensajeError = signal('');

  protected readonly formulario = new FormGroup({
    contrasena: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(LONGITUD_MINIMA)],
    }),
  });

  constructor() {
    this.autenticacion.sesionActual().subscribe((usuario) => {
      if (usuario === null) {
        this.router.navigate(['/acceso']);
        return;
      }
      this.estado.set('listo');
    });
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
