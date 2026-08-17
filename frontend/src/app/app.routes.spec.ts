import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DESTINO_TRAS_INGRESAR, RUTAS_INTERNAS, rutas } from './app.routes';

/**
 * El mapa de rutas de la aplicacion del estudiante (ADR 0013).
 *
 * <p><b>Por que esta prueba existe.</b> Las trece pantallas cuelgan de un padre de ruta VACIA
 * para compartir una sola instancia del armazon. Ese patron tiene una trampa conocida: el
 * padre casa con cualquier URL, asi que basta ponerlo en el orden equivocado para que se
 * quede con la portada, o para que el comodin deje de alcanzarse y un enlace roto lleve a una
 * pantalla en blanco en vez de al 404.
 *
 * <p>Nada de eso falla al compilar y no se ve en una captura. Aqui se navega de verdad a cada
 * ruta y se comprueba que sale el componente que toca.
 */
describe('Rutas de la aplicacion', () => {
  /** Cada ruta con un texto que solo aparece en su pantalla. */
  const PANTALLAS: readonly { ruta: string; contiene: string }[] = [
    { ruta: '/inicio', contiene: 'CONTINÚA DONDE QUEDASTE' },
    { ruta: '/mis-cursos', contiene: 'Tu plan incluye los niveles' },
    { ruta: '/clase/l7', contiene: 'Progreso del curso' },
    { ruta: '/practica', contiene: 'Zona de ejercicios' },
    { ruta: '/practica/e1', contiene: 'Repeticiones de hoy' },
    { ruta: '/tutoriales', contiene: 'Mi colección' },
    { ruta: '/tutoriales/t1', contiene: 'Partes del tutorial' },
    { ruta: '/tienda', contiene: 'Instrumentos, accesorios' },
    { ruta: '/regalar', contiene: 'VISTA PREVIA DE LA TARJETA' },
    { ruta: '/suscripcion', contiene: 'Cambiar de plan' },
    { ruta: '/perfil', contiene: 'Tus datos, tu foto' },
    { ruta: '/ajustes', contiene: 'Notificaciones, idioma' },
    { ruta: '/certificados/cert1', contiene: 'Certificado de finalización' },
  ];

  beforeEach(() => {
    // Se REINICIA el banco antes de configurarlo. La configuracion global de
    // `src/pruebas/configuracion-global.ts` registra un enrutador con un comodin
    // `{ path: '**', children: [] }`, y `provideRouter` acumula rutas en vez de
    // reemplazarlas: ese comodin va primero, casa con todo y no activa ningun componente.
    // Sin el reinicio, las trece pantallas salian vacias y la prueba «no encontraba» nada
    // sin que hubiera nada roto en las rutas de verdad.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter(rutas), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  /**
   * Navega y devuelve el banco.
   *
   * <p>Se lee `fixture.nativeElement` y no `routeNativeElement`: lo segundo devuelve solo el
   * componente de la ruta ACTIVADA mas profunda, y aqui hace falta ver tambien el armazon que
   * lo envuelve. Y no se le pasa un tipo esperado a `navigateByUrl` porque el componente
   * cambia en cada ruta — comprobar cual salio es justo lo que hace cada prueba.
   */
  async function ir(ruta: string): Promise<HTMLElement> {
    const banco = await RouterTestingHarness.create();
    await banco.navigateByUrl(ruta);
    banco.detectChanges();
    return banco.fixture.nativeElement as HTMLElement;
  }

  for (const pantalla of PANTALLAS) {
    it(`debe resolver ${pantalla.ruta} y dibujar su pantalla dentro del armazon`, async () => {
      const raiz = await ir(pantalla.ruta);

      expect(raiz.textContent).toContain(pantalla.contiene);
      // El armazon es un padre compartido: si una ruta quedara fuera, esa pantalla saldria
      // sin menu y sin acceso al carrito, y solo se notaria al abrirla.
      expect(raiz.querySelector('adr-barra-lateral')).not.toBeNull();
      expect(raiz.querySelector('adr-nav-inferior')).not.toBeNull();
    });
  }

  it('debe seguir enseniando la portada en la raiz, y no el armazon', async () => {
    // El padre de ruta vacia casa con cualquier URL. Si estuviera antes que la portada, se
    // quedaria con ella y la pagina publica desapareceria.
    const raiz = await ir('/');

    expect(raiz.querySelector('adr-landing')).not.toBeNull();
    expect(raiz.querySelector('adr-barra-lateral')).toBeNull();
  });

  it('debe llevar al 404 lo que no resuelve, en vez de a una pantalla en blanco', async () => {
    // La trampa del padre vacio: si el comodin quedara inalcanzable, un enlace roto daria
    // una pagina vacia dentro del armazon — indistinguible de una que no cargo.
    const raiz = await ir('/esta-ruta-no-existe');

    expect(raiz.textContent).toContain('Error 404');
    expect(raiz.textContent).toContain('Esta página no existe');
    expect(raiz.querySelector('adr-barra-lateral')).toBeNull();
  });

  it('debe conservar /login como redireccion, porque es una URL ya publicada', () => {
    // Se comprueba en la TABLA y no navegando: `/acceso` lleva la guarda `sinSesionAbierta`,
    // que pregunta al backend, y una navegacion de verdad se quedaria esperando una respuesta
    // HTTP que esta prueba no tiene por que orquestar. La guarda ya tiene su propio spec.
    const login = rutas.find((r) => r.path === 'login');

    expect(login?.redirectTo).toBe('acceso');
    expect(login?.pathMatch).toBe('full');
  });

  it('debe incluir las rutas hijas en RUTAS_INTERNAS', () => {
    // La version plana dejo de ver las trece pantallas cuando pasaron a colgar del armazon:
    // la prueba de enlaces rotos seguia verde porque ya no miraba donde estaban.
    expect(RUTAS_INTERNAS).toContain('/inicio');
    expect(RUTAS_INTERNAS).toContain('/tienda');
    expect(RUTAS_INTERNAS).toContain('/certificados/:id');
    // Y la portada sigue estando, que es lo que comprueba el logotipo de la landing.
    expect(RUTAS_INTERNAS).toContain('/');
  });

  it('debe llevar al panel del alumno tras entrar, y no a la portada', () => {
    // Espejo de IDENTIDAD_DESTINO_OK del backend. Si no coinciden, se entra a un sitio
    // distinto segun se use Google o el formulario.
    expect(DESTINO_TRAS_INGRESAR).toBe('/inicio');
    expect(RUTAS_INTERNAS).toContain(DESTINO_TRAS_INGRESAR);
  });
});
