import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { DESTINO_TRAS_INGRESAR } from '../../app.routes';
import { AutenticacionServicio } from '../servicios/autenticacion-servicio';

/**
 * Deja pasar solo a quien NO tiene sesion abierta.
 *
 * <p><b>El problema que resuelve.</b> El ingreso con Google termina en una redireccion del
 * servidor, asi que `/acceso` se queda en el historial del navegador. Al pulsar «atras»
 * despues de entrar, el alumno volvia al formulario de ingreso — ya autenticado, mirando una
 * pantalla que le pide autenticarse. Y si lo rellenaba, entraba otra vez a la misma cuenta,
 * lo cual no rompe nada pero enseña que la aplicacion no sabe quien es.
 *
 * <p><b>Por que una guarda y no `replaceUrl` en la navegacion.</b> Con Google, la cadena de
 * redirecciones la hace el SERVIDOR: cuando el navegador vuelve, `/acceso` lleva rato en el
 * historial y el frontend ya no puede quitarlo de ahi. Una guarda cubre ademas los otros dos
 * caminos por los que se llega a esa pantalla estando dentro: un marcador y la URL escrita a
 * mano. Los tres se arreglan en un solo sitio.
 *
 * <p><b>Esto es experiencia de usuario, no seguridad.</b> Lo dice `app.routes.ts` y conviene
 * repetirlo aqui: la autorizacion real vive en el backend (docs/06 §2). Una guarda del
 * frontend solo evita una pantalla sin sentido; nunca protege un dato.
 *
 * <p>Pregunta al backend en vez de mirar lo que el frontend recuerda, por lo mismo que lo
 * hace la pantalla de perfil: tras la redireccion de Google la aplicacion arranca de cero y
 * no sabe que alguien acaba de entrar.
 */
export const sinSesionAbierta: CanActivateFn = () => {
  const autenticacion = inject(AutenticacionServicio);
  const router = inject(Router);

  return autenticacion
    .sesionActual()
    .pipe(map((usuario) => usuario === null || router.createUrlTree([DESTINO_TRAS_INGRESAR])));
};
