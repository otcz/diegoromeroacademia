import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { rutas } from './app.routes';

/**
 * Configuracion de arranque.
 *
 * <p>Los interceptores se registran aqui y en ningun otro sitio: la autenticacion y el
 * manejo de errores de red deben aplicarse a TODAS las peticiones, no a las que alguien
 * se acuerde de decorar.
 */
export const configuracionAplicacion: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([])),
    provideRouter(
      rutas,
      // Enlaza parametros de ruta a inputs del componente: menos codigo repetido de
      // suscripcion a ActivatedRoute en cada pantalla.
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
  ],
};
