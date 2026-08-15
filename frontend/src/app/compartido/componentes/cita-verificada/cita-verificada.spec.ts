import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CitaVerificada } from './cita-verificada';

describe('CitaVerificada', () => {
  async function crear(entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CitaVerificada);
    fixture.componentRef.setInput('cita', 'En tres meses aprobé el nivel 1.');
    fixture.componentRef.setInput('autor', 'Carlos Mendoza');
    fixture.componentRef.setInput('enlaceFuente', 'https://youtube.com/watch?v=abc');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe usar marcado de cita, para que se anuncie como testimonio', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('figure')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('blockquote').textContent).toContain(
      'aprobé el nivel 1',
    );
    expect(fixture.nativeElement.querySelector('figcaption')).not.toBeNull();
  });

  it('debe enlazar a la fuente pública: sin dónde comprobarlo, es publicidad', async () => {
    const fixture = await crear();

    const fuente: HTMLAnchorElement = fixture.nativeElement.querySelector('.adr-cita__fuente');
    expect(fuente.getAttribute('href')).toBe('https://youtube.com/watch?v=abc');
    expect(fuente.getAttribute('target')).toBe('_blank');
    expect(fuente.getAttribute('rel')).toContain('noopener');
  });

  it('debe mostrar el sello de procedencia con icono y texto', async () => {
    const fixture = await crear();

    const fuente: HTMLElement = fixture.nativeElement.querySelector('.adr-cita__fuente');
    expect(fuente.querySelector('adr-icono')).not.toBeNull();
    expect(fuente.textContent).toContain('Comentario público en YouTube');
  });

  it('debe resolver el avatar con iniciales, sin exigir la foto de nadie', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('adr-avatar')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales').textContent).toBe('CM');
  });

  it('debe permitir otro texto de sello para otra fuente', async () => {
    const fixture = await crear({ textoSello: 'Alumno verificado del nivel 2' });

    expect(fixture.nativeElement.querySelector('.adr-cita__fuente').textContent).toContain(
      'Alumno verificado',
    );
  });
});
