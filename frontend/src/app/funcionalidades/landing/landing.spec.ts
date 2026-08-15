import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Landing } from './landing';

/**
 * Se prueba la landing COMPUESTA y no cada sección por separado.
 *
 * <p>Las secciones no tienen lógica: solo maquetan contenido constante. Probarlas aisladas
 * verificaría que una plantilla dibuja lo que dice su plantilla. Montarlas juntas verifica
 * lo que sí puede romperse: que compongan, que el orden del argumento se mantenga y que las
 * reglas del sistema visual se respeten en el conjunto.
 */
describe('Landing', () => {
  async function crear() {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('debe montar las secciones en el orden del argumento', async () => {
    const fixture = await crear();
    const raiz: HTMLElement = fixture.nativeElement;

    const orden = [
      'adr-nav-publica',
      'adr-seccion-heroe',
      'adr-seccion-cifras',
      'adr-seccion-ruta',
      'adr-seccion-nivel',
      'adr-seccion-simulador',
      'adr-seccion-catalogo',
      'adr-seccion-planes',
      'adr-pie-publico',
    ];
    const presentes = Array.from(raiz.children).map((n) => n.tagName.toLowerCase());
    expect(presentes.filter((t) => orden.includes(t))).toEqual(orden);
  });

  it('debe prometer y enseñar la ruta sobre el pliegue', async () => {
    const fixture = await crear();
    const heroe: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-heroe');

    expect(heroe.querySelector('h1')?.textContent).toContain('Aprende acordeón');
    expect(heroe.querySelector('h1')?.textContent).toContain('desde cero');
    // La ruta compacta dentro del panel de cristal: el camino antes del registro.
    expect(heroe.querySelector('adr-panel-cristal adr-ruta-niveles')).not.toBeNull();
    expect(heroe.querySelectorAll('adr-item-nivel').length).toBe(5);
  });

  it('debe velar el fondo del héroe para que el texto sea legible sobre cualquier foto', async () => {
    const fixture = await crear();

    expect(
      fixture.nativeElement.querySelector('adr-seccion-heroe .adr-marco__velo--lateral'),
    ).not.toBeNull();
  });

  it('debe usar el subrayado mango una sola vez en toda la página', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelectorAll('.adr-subrayado').length).toBe(1);
  });

  it('debe acompañar las cifras de su procedencia, que es lo que las hace comprobables', async () => {
    const fixture = await crear();
    const cifras: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-cifras');

    expect(cifras.querySelectorAll('adr-dato').length).toBe(4);
    expect(cifras.textContent).toContain('26.000');
    expect(cifras.textContent).toContain('@DiegoRomeroAcordeon');
  });

  it('no debe anunciar el catálogo gratuito de YouTube justo antes del muro de pago', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.textContent).not.toContain('362');
  });

  it('debe mostrar las cinco estaciones de la ruta a tamaño completo', async () => {
    const fixture = await crear();
    const ruta: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-ruta');

    expect(ruta.querySelectorAll('adr-item-nivel').length).toBe(5);
    expect(ruta.textContent).toContain('Se abre al aprobar el examen anterior');
  });

  it('debe explicar el tramo en tres pasos', async () => {
    const fixture = await crear();
    const nivel: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-nivel');

    expect(nivel.querySelectorAll('.nivel__paso').length).toBe(3);
    expect(nivel.textContent).toContain('Diego revisa tu video');
  });

  it('debe presentar el simulador con marco de ventana y su diagrama dibujado', async () => {
    const fixture = await crear();
    const sim: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-simulador');

    expect(sim.querySelector('.adr-marco--ventana')).not.toBeNull();
    expect(sim.querySelectorAll('.simulador__boton').length).toBe(15);
    expect(sim.querySelectorAll('.simulador__boton--activo').length).toBe(3);
    expect(sim.querySelectorAll('.simulador__chip').length).toBe(3);
  });

  it('debe mostrar los precios sin exigir registro', async () => {
    const fixture = await crear();
    const texto: string = fixture.nativeElement.textContent;

    expect(texto).toContain('$39.900');
    expect(texto).toContain('$349.900');
    expect(texto).toContain('Precios visibles, sin registrarte');
    expect(texto).toContain('Precios provisionales');
  });

  it('debe destacar el plan anual y solo ese', async () => {
    const fixture = await crear();

    const destacados = fixture.nativeElement.querySelectorAll('.adr-plan--recomendado');
    expect(destacados.length).toBe(1);
    expect(destacados[0].textContent).toContain('Anual');
  });

  it('debe ofrecer las tres piezas del catálogo con su regla de acceso', async () => {
    const fixture = await crear();
    const catalogo: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-catalogo');

    expect(catalogo.querySelectorAll('adr-tarjeta-curso').length).toBe(3);
    expect(catalogo.textContent).toContain('tuyo para siempre');
  });

  it('no debe dibujar los testimonios mientras no haya comentarios reales del canal', async () => {
    const fixture = await crear();
    const prueba: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-prueba');

    // Mejor ausente que fabricada.
    expect(prueba.querySelector('section')).toBeNull();
    expect(fixture.nativeElement.querySelector('adr-cita-verificada')).toBeNull();
  });

  it('debe cerrar con una sola llamada a la acción, sin gastar dos secciones', async () => {
    const fixture = await crear();
    const pie: HTMLElement = fixture.nativeElement.querySelector('adr-pie-publico');

    expect(pie.textContent).toContain('Empieza hoy por el nivel 1');
    expect(pie.textContent).toContain('Sin permanencia');
    // El gesto de marca no se repite aqui.
    expect(pie.querySelector('.adr-subrayado')).toBeNull();
  });

  it('debe funcionar sin una sola foto, con marcadores del sistema', async () => {
    const fixture = await crear();

    // Heroe, simulador y tres portadas de curso: cinco huecos, cinco marcadores.
    expect(fixture.nativeElement.querySelectorAll('.adr-marco__marcador').length).toBe(5);
    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(0);
  });

  it('no debe ofrecer WhatsApp mientras no haya número configurado', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('adr-whatsapp-flotante')).toBeNull();
  });
});
