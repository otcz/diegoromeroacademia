import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Landing } from './landing';

describe('Landing', () => {
  async function crear() {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe mostrar la propuesta de valor del heroe', async () => {
    const fixture = await crear();

    const titulo: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(titulo.textContent).toContain('Aprende a tocar acordeón');
    expect(titulo.textContent).toContain('desde cero');
  });

  it('debe mostrar los precios sin exigir registro, que es el diferenciador comercial', async () => {
    const fixture = await crear();

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('$39.900');
    expect(texto).toContain('$349.900');
    expect(texto).toContain('Precios visibles, sin registrarte');
  });

  it('debe advertir que los precios son provisionales', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).toContain('Precios provisionales');
  });

  it('debe explicar la regla de acceso permanente frente a suscripcion', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).toContain('es tuyo para siempre');
  });

  it('debe dibujar las cuatro cifras de prueba social', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelectorAll('.landing__cifra').length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('26.000');
  });

  it('debe dibujar los tres pasos del metodo y las tres tarjetas del catalogo', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelectorAll('.landing__metodo-rejilla article').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.landing__curso').length).toBe(3);
  });

  it('debe destacar el plan anual, que es el que se quiere promover', async () => {
    const fixture = await crear();

    const destacados = fixture.nativeElement.querySelectorAll('.landing__plan--recomendado');
    expect(destacados.length).toBe(1);
    expect(destacados[0].textContent).toContain('Anual');
  });

  it('debe presentar el simulador como lo exclusivo del proyecto', async () => {
    const fixture = await crear();

    const seccion: HTMLElement = fixture.nativeElement.querySelector('#simulador');
    expect(seccion.textContent).toContain('Solo aquí');
    expect(seccion.querySelectorAll('li').length).toBe(3);
  });

  it('debe usar el subrayado mango una sola vez por pantalla en el heroe', async () => {
    const fixture = await crear();

    const heroe: HTMLElement = fixture.nativeElement.querySelector('.landing__heroe');
    expect(heroe.querySelectorAll('.adr-subrayado').length).toBe(1);
  });

  it('no debe dibujar el boton de WhatsApp mientras no haya numero configurado', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('adr-whatsapp-flotante')).toBeNull();
  });
});
