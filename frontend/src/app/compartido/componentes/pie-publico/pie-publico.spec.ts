import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PiePublico } from './pie-publico';

describe('PiePublico', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(PiePublico);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe cerrar con una sola llamada a la accion', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).toContain('Empieza hoy por el nivel 1');
    expect(fixture.nativeElement.textContent).toContain('Registrarme');
    expect(fixture.nativeElement.textContent).toContain('Sin permanencia');
  });

  it('NO debe repetir el subrayado mango: ya se gasto en el titular del heroe', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelectorAll('.adr-subrayado').length).toBe(0);
  });

  it('debe permitir otro cierre sin tocar el componente', async () => {
    const fixture = await crear({ titulo: 'Vuelve donde lo dejaste.', nota: '' });

    expect(fixture.nativeElement.textContent).toContain('Vuelve donde lo dejaste');
    expect(fixture.nativeElement.querySelector('.adr-pie__nota')).toBeNull();
  });

  it('debe nombrar los documentos legales y la verificacion, sin enlazarlos aun', async () => {
    const fixture = await crear();

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('Términos y condiciones');
    expect(texto).toContain('Reembolsos');
    expect(texto).toContain('Verificar certificado');
  });

  it('debe abrir el canal de YouTube sin exponer la ventana de origen', async () => {
    const fixture = await crear();

    const enlaces: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[target="_blank"]'),
    );
    const youtube = enlaces.find((a) => a.href.includes('youtube.com'));

    expect(youtube).toBeDefined();
    expect(youtube?.getAttribute('rel')).toContain('noopener');
  });

  it('no debe ofrecer WhatsApp mientras no haya numero configurado', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).not.toContain('Hablar por WhatsApp');
  });

  it('debe ofrecer WhatsApp cuando hay numero', async () => {
    const fixture = await crear({ numeroWhatsapp: '573001234567' });

    expect(fixture.nativeElement.textContent).toContain('Hablar por WhatsApp');
  });

  it('debe mostrar el anio indicado en el aviso de derechos', async () => {
    const fixture = await crear({ anio: 2027 });

    expect(fixture.nativeElement.textContent).toContain('© 2027');
  });
});
