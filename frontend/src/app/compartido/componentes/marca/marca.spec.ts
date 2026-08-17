import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MARCAS, NombreMarca } from '../../../disenio/iconos/marcas';
import { Marca } from './marca';

/**
 * La marca de un tercero.
 *
 * <p>Lo que hay que proteger aqui no es que se dibuje —eso se ve— sino que se dibuje CON SUS
 * COLORES. El fallo que motivo este componente era invisible en las pruebas: un glifo
 * monocromo puesto donde iba un logotipo. Se veia bien en gris y estaba mal.
 */
describe('Marca', () => {
  async function crear(nombre: NombreMarca) {
    const fixture = TestBed.createComponent(Marca);
    fixture.componentRef.setInput('nombre', nombre);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('svg') as SVGElement;
  }

  it('debe dibujar la marca con SUS colores, nunca con el del texto', async () => {
    const svg = await crear('google');

    // Los cuatro de Google. Si alguien «unificara» esto con el sistema de iconos, el
    // primer sintoma seria un fill="currentColor" y esta prueba lo caza.
    const colores = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('fill'));
    expect(colores).toEqual(['#EA4335', '#4285F4', '#FBBC05', '#34A853']);
    expect(svg.getAttribute('fill')).toBeNull();
  });

  it('debe respetar el sistema de coordenadas de cada titular', async () => {
    // Forzarlas a la rejilla de los iconos —0 -960 960 960— las deformaria, y una marca
    // deformada no se puede usar.
    expect((await crear('google')).getAttribute('viewBox')).toBe('0 0 48 48');
    expect((await crear('facebook')).getAttribute('viewBox')).toBe('0 0 36 36');
  });

  it('debe dibujar los logotipos que ya no puede dar la libreria de iconos', async () => {
    // WhatsApp y LinkedIn entraban por el registro de iconos cuando la fuente era Phosphor.
    // Material Symbols retiro las marcas de su catalogo (ADR 0014), asi que vinieron aqui —
    // que ademas es donde el ADR 0010 decia que debian estar desde el principio.
    for (const nombre of ['whatsapp', 'linkedin'] as const) {
      const svg = await crear(nombre);
      const colores = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('fill'));

      expect(colores.length, nombre).toBeGreaterThan(0);
      expect(colores, nombre).not.toContain('currentColor');
    }

    // El verde de WhatsApp es el mismo del token que pinta la pastilla flotante: por eso el
    // circulo del logotipo se funde con el fondo y queda el auricular blanco, que es la forma
    // que la marca aprueba sobre su propio verde.
    expect(MARCAS.whatsapp.contenido).toContain('#25D366');
  });

  it('debe quedar oculta para los lectores de pantalla', async () => {
    // Siempre va junto al texto «Continuar con Google»: anunciarla repetiria la palabra.
    expect((await crear('google')).getAttribute('aria-hidden')).toBe('true');
  });

  it('debe declarar a su titular, para poder rendir cuentas de cada marca ajena', async () => {
    for (const [nombre, marca] of Object.entries(MARCAS)) {
      expect(marca.titular, nombre).not.toBe('');
    }
  });
});
