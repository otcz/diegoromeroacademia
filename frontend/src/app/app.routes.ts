import { Routes } from '@angular/router';

/**
 * Rutas de la aplicacion.
 *
 * <p>Toda funcionalidad se carga de forma diferida con `loadComponent`: la landing publica
 * no puede pagar el peso del panel de administracion ni del simulador.
 *
 * <p>Las rutas van en espanol por la regla 7. La especificacion §6.1 escribe `/login`, asi
 * que se conserva como redireccion permanente: una URL publicada no se rompe, se redirige.
 *
 * <p>Las guardas que se agreguen aqui son solo experiencia de usuario. La autorizacion real
 * vive en el backend (docs/06 §2).
 */
export const rutas: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Academia Diego Romero — Aprende a tocar acordeón desde cero',
    loadComponent: () => import('./funcionalidades/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'acceso',
    title: 'Entrar — Academia Diego Romero',
    loadComponent: () => import('./funcionalidades/acceso/acceso').then((m) => m.Acceso),
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'acceso',
  },
  {
    // Cualquier ruta desconocida vuelve a la portada. Sin esto, una URL mal escrita deja al
    // visitante frente a una pagina en blanco sin explicacion ni salida.
    path: '**',
    redirectTo: '',
  },
];
