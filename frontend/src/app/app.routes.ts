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
    title: 'Aprende acordeón vallenato desde cero — Academia Diego Romero',
    loadComponent: () => import('./funcionalidades/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'acceso',
    title: 'Entrar — Academia Diego Romero',
    loadComponent: () => import('./funcionalidades/acceso/acceso').then((m) => m.Acceso),
  },
  {
    path: 'perfil',
    title: 'Tu cuenta — Academia Diego Romero',
    loadComponent: () => import('./funcionalidades/perfil/perfil').then((m) => m.Perfil),
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'acceso',
  },
  {
    // Antes esto era `redirectTo: ''`. Se cambio a una pantalla explicita porque el redirect
    // silencioso hacia INDISTINGUIBLE un enlace roto de uno que funciona: los ocho botones de
    // la landing apuntaban a `/registro`, que no existe, y el visitante volvia a la portada
    // creyendo que la pagina simplemente no reaccionaba. Un 404 visible falla ruidosamente.
    path: '**',
    title: 'Página no encontrada — Academia Diego Romero',
    loadComponent: () =>
      import('./funcionalidades/no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
  },
];

/**
 * Destinos internos que la aplicacion sabe resolver hoy.
 *
 * <p>Existe para que una prueba pueda comprobar que ningun texto de la landing apunta a una
 * ruta inexistente. Se deriva de `rutas` en vez de escribirse a mano: una lista paralela se
 * desincroniza en la primera pantalla nueva y la prueba pasaria a mentir.
 */
export const RUTAS_INTERNAS: readonly string[] = rutas
  .map((r) => r.path)
  .filter((p): p is string => typeof p === 'string' && p !== '**')
  .map((p) => `/${p}`);

/**
 * Destino de toda llamada a la accion mientras no exista la pantalla de registro (§6.2).
 *
 * <p>CONDICION DE SALIDA: pasa a `/registro` el dia que esa pantalla exista, y se cambia
 * AQUI, una vez. Antes los ocho botones escribian `/registro` a mano, ninguno resolvia y el
 * comodin los devolvia en silencio a la portada.
 *
 * <p>Vive junto a las rutas y no en el contenido de la landing porque lo citan tambien la
 * navegacion y el pie, que son del catalogo compartido: `compartido/` no puede depender de
 * `funcionalidades/`, y ArchUnit tiene su equivalente en el backend por la misma razon.
 */
export const DESTINO_REGISTRO = '/acceso';
