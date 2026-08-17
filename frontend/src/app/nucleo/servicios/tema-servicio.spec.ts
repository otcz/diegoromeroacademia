import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLAVE_TEMA, TemaServicio } from './tema-servicio';

/**
 * El tema visual (ADR 0012).
 *
 * <p>Estas pruebas fijan ademas el CONTRATO que copia el guion inline de `index.html`: la
 * clave de almacenamiento, el atributo y su valor. Ese guion existe para que la pagina no
 * parpadee en blanco antes de que Angular arranque, y es una copia deliberada de esta
 * logica. Si aqui cambia la clave y alli no, el fogonazo vuelve sin que nada falle — por eso
 * los tres valores estan comprobados con literales y no derivados del propio servicio.
 */
describe('TemaServicio', () => {
  const raiz = () => document.documentElement;

  function crear(): TemaServicio {
    TestBed.configureTestingModule({});
    return TestBed.inject(TemaServicio);
  }

  /**
   * Fija lo que responde `prefers-color-scheme` en esta prueba.
   *
   * <p>Se ASIGNA en vez de espiar: jsdom no implementa `matchMedia`, asi que `vi.spyOn` falla
   * con «can only spy on a function». Que no exista es justo uno de los casos que el servicio
   * tiene que aguantar, y tiene su propia prueba mas abajo.
   */
  function sistemaEnOscuro(oscuro: boolean): void {
    window.matchMedia = ((consulta: string) => ({
      matches: consulta.includes('dark') && oscuro,
      media: consulta,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
  }

  const matchMediaOriginal = window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    raiz().removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.matchMedia = matchMediaOriginal;
    localStorage.clear();
    raiz().removeAttribute('data-theme');
  });

  it('debe seguir la preferencia del sistema en la primera visita', () => {
    sistemaEnOscuro(true);

    expect(crear().tema()).toBe('oscuro');
    expect(raiz().getAttribute('data-theme')).toBe('oscuro');
  });

  it('debe quedarse en claro si el sistema no pide oscuro', () => {
    sistemaEnOscuro(false);

    const servicio = crear();

    expect(servicio.tema()).toBe('claro');
    // El claro NO escribe atributo: es el valor por defecto de :root y el atributo sobra.
    expect(raiz().hasAttribute('data-theme')).toBe(false);
  });

  it('debe respetar lo que el alumno eligio por encima de la preferencia del sistema', () => {
    // Es el fallo clasico del tema a medias: con el sistema en oscuro, pulsar «claro» no
    // hacia nada. Lo elegido manda.
    sistemaEnOscuro(true);
    localStorage.setItem(CLAVE_TEMA, 'claro');

    expect(crear().tema()).toBe('claro');
    expect(raiz().hasAttribute('data-theme')).toBe(false);
  });

  it('debe alternar, escribir el atributo y recordar la eleccion', () => {
    sistemaEnOscuro(false);
    const servicio = crear();

    servicio.alternar();

    expect(servicio.esOscuro()).toBe(true);
    expect(servicio.nombre()).toBe('oscuro');
    expect(raiz().getAttribute('data-theme')).toBe('oscuro');
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('oscuro');

    servicio.alternar();

    expect(servicio.esOscuro()).toBe(false);
    expect(raiz().hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('claro');
  });

  it('debe ignorar un valor guardado que no sea un tema', () => {
    // El almacen lo puede tocar cualquiera desde la consola, y una version anterior del
    // formato tambien deja basura. Ni una ni otra pueden dejar la aplicacion sin tema.
    sistemaEnOscuro(true);
    localStorage.setItem(CLAVE_TEMA, 'fucsia');

    expect(crear().tema()).toBe('oscuro');
  });

  it('debe arrancar aunque el navegador no declare prefers-color-scheme', () => {
    // Ocurre en el renderizado del servidor, en navegadores antiguos y en jsdom, que es
    // donde corren estas pruebas: sin el respaldo, el banco entero no arrancaria.
    window.matchMedia = undefined as unknown as typeof window.matchMedia;

    expect(crear().tema()).toBe('claro');
  });
});
