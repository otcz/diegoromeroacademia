import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { entorno } from '../../../entornos/entorno';
import { Perfil } from './perfil';

/**
 * La pantalla que deja a quien entro con Google tener tambien contrasena.
 *
 * <p>Lo que mas importa probar es que la pantalla PREGUNTA quien tiene la sesion. El ingreso
 * con Google termina en una redireccion y la aplicacion se recarga sin saber que alguien
 * entro: si el perfil se fiara de lo que el frontend recuerda, funcionaria despues del
 * formulario y no despues de Google.
 */
describe('Perfil', () => {
  const USUARIO = {
    id: '5d082da2-aafe-4606-a53a-76326f5713e2',
    nombre: 'Alumno',
    correo: 'alumno@ejemplo.com',
    rol: 'estudiante',
  };

  async function crear() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(Perfil);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    return { fixture, http };
  }

  it('debe preguntar al backend quien tiene la sesion antes de dibujar nada', async () => {
    const { fixture, http } = await crear();

    http.expectOne(`${entorno.urlApi}/acceso/sesion`).flush(USUARIO);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('alumno@ejemplo.com');
    expect(fixture.nativeElement.querySelector('form')).not.toBeNull();
  });

  it('debe dibujarse entera sin sesion y ofrecer entrar, en vez de desviar', async () => {
    const { fixture, http } = await crear();
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Un 401 no es un error a mostrar: significa «no has entrado».
    http.expectOne(`${entorno.urlApi}/acceso/sesion`).flush(null, { status: 401, statusText: '' });
    fixture.detectChanges();
    await fixture.whenStable();

    // Antes se desviaba a /acceso, y tenia sentido cuando el perfil era solo el formulario
    // de contrasena. Ahora es una de las trece pantallas de la aplicacion: desviar la hacia
    // IMPOSIBLE de revisar. Se dibuja entera y el bloque de seguridad explica que falta.
    expect(navegar).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Mi perfil');
    expect(fixture.nativeElement.textContent).toContain('hace falta haber iniciado sesión');
    // Y sin formulario: no hay a quien cambiarle la contrasena.
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });

  it('NO debe enviar una contrasena mas corta que la que exige el backend', async () => {
    const { fixture, http } = await crear();
    http.expectOne(`${entorno.urlApi}/acceso/sesion`).flush(USUARIO);
    fixture.detectChanges();

    const componente = fixture.componentInstance as unknown as {
      formulario: { controls: { contrasena: { setValue(v: string): void } } };
      enviar(): void;
    };
    componente.formulario.controls.contrasena.setValue('corta');
    componente.enviar();

    // Si se enviara, el backend la rechazaria y el formulario pareceria roto sin decir por que.
    http.expectNone(`${entorno.urlApi}/acceso/contrasena`);
  });

  it('debe guardar la contrasena y BORRARLA del formulario al terminar', async () => {
    const { fixture, http } = await crear();
    http.expectOne(`${entorno.urlApi}/acceso/sesion`).flush(USUARIO);
    fixture.detectChanges();

    const componente = fixture.componentInstance as unknown as {
      formulario: { controls: { contrasena: { setValue(v: string): void; value: string } } };
      enviar(): void;
    };
    componente.formulario.controls.contrasena.setValue('una-contrasena-larga');
    componente.enviar();

    const peticion = http.expectOne(`${entorno.urlApi}/acceso/contrasena`);
    expect(peticion.request.body).toEqual({ contrasena: 'una-contrasena-larga' });
    peticion.flush(null);

    fixture.detectChanges();
    await fixture.whenStable();

    // No tiene por que seguir en pantalla ni en memoria despues de guardarse.
    expect(componente.formulario.controls.contrasena.value).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Tu contraseña quedó guardada');
  });
});
