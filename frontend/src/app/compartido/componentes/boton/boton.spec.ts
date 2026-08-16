import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Boton } from './boton';

describe('Boton', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Boton);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  /**
   * Distingue el enlace que INTERCEPTA Angular del que llega al servidor.
   *
   * <p>Comprobar el `href` no sirve: `routerLink` tambien lo escribe, y por eso el fallo del
   * boton de Google paso las pruebas. Lo que de verdad cambia es si el clic sale a la red.
   * Se simula un clic con el boton izquierdo y sin modificadores —que es lo unico que
   * `RouterLink` intercepta— y se mira si alguien llamo a `preventDefault`.
   */
  async function elClicSaleALaRed(destino: string) {
    const fixture = await crear({ enlace: destino });
    const ancla: HTMLAnchorElement = fixture.nativeElement.querySelector('a');

    const clic = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    ancla.dispatchEvent(clic);
    return !clic.defaultPrevented;
  }

  it('NO debe interceptar los destinos de la API: son del servidor, no rutas', async () => {
    // El boton «Continuar con Google» apunta a /api/acceso/oauth2/google. Cuando se
    // interceptaba, Angular navegaba por dentro, no encontraba la ruta y pintaba el 404
    // sin haberle pedido nada al servidor. Recargando esa URL si funcionaba.
    expect(await elClicSaleALaRed('/api/acceso/oauth2/google')).toBe(true);
  });

  it('debe interceptar las rutas propias, para no recargar la aplicacion entera', async () => {
    expect(await elClicSaleALaRed('/acceso')).toBe(false);
  });

  it('no debe interceptar anclas ni destinos externos', async () => {
    expect(await elClicSaleALaRed('#planes')).toBe(true);
    expect(await elClicSaleALaRed('https://youtube.com/@DiegoRomeroAcordeon')).toBe(true);
  });

  it('debe usar la variante primaria cuando no se indica ninguna', async () => {
    const fixture = await crear();

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(boton.className).toContain('adr-boton--primario');
  });

  it('debe aplicar la clase de la variante pedida', async () => {
    const fixture = await crear({ variante: 'secundario' });

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(boton.className).toContain('adr-boton--secundario');
  });

  it('debe emitir la accion al pulsarlo', async () => {
    const fixture = await crear();
    let pulsaciones = 0;
    fixture.componentInstance.accion.subscribe(() => pulsaciones++);

    fixture.nativeElement.querySelector('button').click();

    expect(pulsaciones).toBe(1);
  });

  it('debe quedar inutilizable mientras carga, para no enviar dos veces un pago', async () => {
    const fixture = await crear({ cargando: true });

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(boton.disabled).toBe(true);
    expect(boton.getAttribute('aria-busy')).toBe('true');
  });

  it('debe respetar el estado deshabilitado', async () => {
    const fixture = await crear({ deshabilitado: true });

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('debe ocupar todo el ancho cuando se pide', async () => {
    const fixture = await crear({ anchoCompleto: true });

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(boton.className).toContain('adr-boton--ancho-completo');
  });

  it('debe mostrar el icono solo cuando se indica uno', async () => {
    const sinIcono = await crear();
    expect(sinIcono.nativeElement.querySelector('adr-icono')).toBeNull();

    const conIcono = await crear({ icono: 'play-circle' });
    expect(conIcono.nativeElement.querySelector('adr-icono')).not.toBeNull();
  });

  it('debe permitir enviar un formulario cuando el tipo es submit', async () => {
    const fixture = await crear({ tipo: 'submit' });

    expect(fixture.nativeElement.querySelector('button').type).toBe('submit');
  });
});
