import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  async function crear(entradas: Record<string, unknown>) {
    const fixture = TestBed.createComponent(Avatar);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe degradar a iniciales, para no necesitar nunca una foto', async () => {
    const fixture = await crear({ nombre: 'Oscar Tomás Carrillo Zuleta' });

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales').textContent).toBe('OT');
  });

  it('debe tomar como mucho dos iniciales, porque con tres no se leen', async () => {
    const fixture = await crear({ nombre: 'Ana María Pérez Gómez' });

    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales').textContent).toBe('AM');
  });

  it('debe funcionar con un solo nombre', async () => {
    const fixture = await crear({ nombre: 'Diego' });

    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales').textContent).toBe('D');
  });

  it('debe tolerar espacios de mas sin producir iniciales vacias', async () => {
    const fixture = await crear({ nombre: '  diego   romero  ' });

    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales').textContent).toBe('DR');
  });

  it('debe usar la foto cuando existe', async () => {
    const fixture = await crear({ nombre: 'Diego Romero', foto: '/imagenes/diego.webp' });

    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(
      '/imagenes/diego.webp',
    );
    expect(fixture.nativeElement.querySelector('.adr-avatar__iniciales')).toBeNull();
  });

  it('debe anunciar el nombre completo: unas iniciales no identifican a nadie', async () => {
    const fixture = await crear({ nombre: 'Diego Romero' });

    const avatar: HTMLElement = fixture.nativeElement.querySelector('.adr-avatar');
    expect(avatar.getAttribute('aria-label')).toBe('Diego Romero');
    expect(avatar.getAttribute('role')).toBe('img');
  });

  it('debe aplicar el tamanio pedido', async () => {
    const fixture = await crear({ nombre: 'Diego Romero', tamanio: 48 });

    const avatar: HTMLElement = fixture.nativeElement.querySelector('.adr-avatar');
    expect(avatar.style.width).toBe('48px');
    expect(avatar.style.height).toBe('48px');
  });
});
