import { Routes } from '@angular/router';

/**
 * Rutas de la aplicacion.
 *
 * <p>Toda funcionalidad se carga de forma diferida con `loadComponent`: la landing publica
 * no puede pagar el peso del panel de administracion ni del simulador. Las rutas siguen
 * las de la especificacion §6.1.
 *
 * <p>Las guardas que se agreguen aqui son solo experiencia de usuario. La autorizacion
 * real vive en el backend (docs/06 §2).
 */
export const rutas: Routes = [
  {
    path: '',
    title: 'Academia Diego Romero — Aprende a tocar acordeón desde cero',
    loadComponent: () => import('./funcionalidades/landing/landing').then((m) => m.Landing),
  },
];
