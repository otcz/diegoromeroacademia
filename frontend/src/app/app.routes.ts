import { Routes } from '@angular/router';
import { sinSesionAbierta } from './nucleo/guardas/sin-sesion-abierta';

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
    // Quien ya entro no vuelve a ver el formulario, ni pulsando «atras» ni por un marcador.
    canActivate: [sinSesionAbierta],
    loadComponent: () => import('./funcionalidades/acceso/acceso').then((m) => m.Acceso),
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'acceso',
  },
  // ==========================================================================
  // Aplicacion del estudiante (ADR 0013).
  //
  // Todas cuelgan de un padre sin ruta propia para compartir una unica instancia del shell:
  // al navegar entre secciones no se vuelve a crear el menu, asi que la barra lateral no
  // parpadea y el carrito abierto no se cierra solo.
  //
  // El padre va DESPUES de `''` y de `acceso` y ANTES del comodin. El orden importa: un
  // padre de ruta vacia intenta casar cualquier URL, asi que si estuviera arriba se quedaria
  // con la portada.
  // ==========================================================================
  {
    path: '',
    loadComponent: () => import('./compartido/disposicion/shell').then((m) => m.Shell),
    children: [
      {
        path: 'inicio',
        title: 'Tu panel — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'mis-cursos',
        title: 'Mis cursos — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/mis-cursos/mis-cursos').then((m) => m.MisCursos),
      },
      {
        path: 'clase/:id',
        title: 'Clase — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/clase/clase').then((m) => m.ClasePantalla),
      },
      {
        path: 'practica',
        title: 'Zona de ejercicios — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/practica/practica').then((m) => m.Practica),
      },
      {
        path: 'practica/:id',
        title: 'Ejercicio guiado — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/practica/ejercicio-guiado').then((m) => m.EjercicioGuiado),
      },
      {
        path: 'tutoriales',
        title: 'Tutoriales — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/tutoriales/tutoriales').then((m) => m.Tutoriales),
      },
      {
        path: 'tutoriales/:id',
        title: 'Ver tutorial — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/tutoriales/ver-tutorial').then((m) => m.VerTutorial),
      },
      {
        path: 'tienda',
        title: 'Tienda — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/tienda/tienda').then((m) => m.Tienda),
      },
      {
        path: 'regalar',
        title: 'Regalar — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/regalar/regalar').then((m) => m.Regalar),
      },
      {
        path: 'suscripcion',
        title: 'Mi suscripción — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/suscripcion/suscripcion').then((m) => m.SuscripcionPantalla),
      },
      {
        path: 'perfil',
        title: 'Mi perfil — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/perfil/perfil').then((m) => m.Perfil),
      },
      {
        path: 'ajustes',
        title: 'Ajustes — Academia Diego Romero',
        loadComponent: () => import('./funcionalidades/ajustes/ajustes').then((m) => m.Ajustes),
      },
      {
        path: 'certificados/:id',
        title: 'Certificado — Academia Diego Romero',
        loadComponent: () =>
          import('./funcionalidades/certificado/certificado').then((m) => m.CertificadoPantalla),
      },
    ],
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
 *
 * <p>Recorre tambien las rutas HIJAS. Cuando la aplicacion del estudiante paso a colgar de un
 * padre de ruta vacia, la version plana dejo de ver `/inicio`, `/tienda` y las otras once: la
 * prueba seguia en verde porque no encontraba enlaces rotos, pero es que ya no miraba donde
 * estaban. Una comprobacion que deja de comprobar sin fallar es peor que no tenerla.
 */
function recolectarRutas(lista: Routes, prefijo = ''): string[] {
  return lista.flatMap((ruta) => {
    if (typeof ruta.path !== 'string' || ruta.path === '**') {
      return [];
    }

    // Un padre de ruta vacia solo agrupa: aporta el prefijo de sus hijas y ningun destino
    // propio. Una ruta vacia SIN hijas si es una pantalla — la portada — y su destino es `/`.
    if (ruta.path === '') {
      return ruta.children ? recolectarRutas(ruta.children, prefijo) : [prefijo || '/'];
    }

    const completa = `${prefijo}/${ruta.path}`;
    return [completa, ...(ruta.children ? recolectarRutas(ruta.children, completa) : [])];
  });
}

export const RUTAS_INTERNAS: readonly string[] = recolectarRutas(rutas);

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

/**
 * A donde va el alumno justo despues de entrar.
 *
 * <p>Espejo de `IDENTIDAD_DESTINO_OK` del backend, que es quien redirige tras el ingreso con
 * Google. Tienen que coincidir: si no, se entra a un sitio distinto segun el metodo usado, y
 * esa es la clase de diferencia que nadie nota hasta que un alumno la reporta.
 *
 * <p>Fue `/` mientras no habia panel. Ya existe (ADR 0013), asi que se cumplio la condicion
 * de salida que estaba anotada aqui: entrar lleva al panel del alumno y no a la portada.
 * Hay que cambiar tambien `IDENTIDAD_DESTINO_OK` en el backend — si no coinciden, se entra
 * a un sitio distinto segun el metodo usado.
 */
export const DESTINO_TRAS_INGRESAR = '/inicio';

/**
 * A donde va el alumno al cerrar sesion.
 *
 * <p>La portada, y no la pantalla donde estuviera. Si se quedara en una que exige sesion
 * —el perfil— la guarda lo mandaria al formulario de ingreso, y salir terminaria pareciendo
 * entrar.
 */
export const DESTINO_TRAS_SALIR = '/';
