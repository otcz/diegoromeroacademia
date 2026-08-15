import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { WhatsappFlotante } from './whatsapp-flotante';

describe('WhatsappFlotante', () => {
  async function crear(entradas: Record<string, unknown>) {
    const fixture = TestBed.createComponent(WhatsappFlotante);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
  }

  it('debe construir el enlace de WhatsApp con el numero indicado', async () => {
    const enlace = await crear({ numero: '573001234567' });

    expect(enlace.getAttribute('href')).toContain('api.whatsapp.com/send');
    expect(enlace.getAttribute('href')).toContain('phone=573001234567');
  });

  it('debe codificar el mensaje precargado para no romper la URL', async () => {
    const enlace = await crear({ numero: '573001234567', mensaje: 'Hola, ¿hay cupo?' });

    const href = enlace.getAttribute('href') ?? '';
    expect(href).not.toContain(' ');
    expect(decodeURIComponent(href.split('text=')[1])).toBe('Hola, ¿hay cupo?');
  });

  it('debe abrirse en otra pestania sin exponer la ventana de origen', async () => {
    const enlace = await crear({ numero: '573001234567' });

    expect(enlace.getAttribute('target')).toBe('_blank');
    expect(enlace.getAttribute('rel')).toContain('noopener');
  });

  it('debe llevar etiqueta accesible aunque en movil se oculte el texto', async () => {
    const enlace = await crear({ numero: '573001234567' });

    expect(enlace.getAttribute('aria-label')).toBe('Escribir por WhatsApp');
  });
});
