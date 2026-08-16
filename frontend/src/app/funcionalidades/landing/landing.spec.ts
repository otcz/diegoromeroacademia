import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { RUTAS_INTERNAS } from '../../app.routes';
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
      // El arco completo va ANTES del mapa de niveles: «¿cómo entro?» se pregunta antes
      // que «¿qué trae el nivel 3?».
      'adr-seccion-camino',
      // Aquí había una sección «La ruta» a tamaño completo. Se borró: su contenido era
      // IDÉNTICO carácter a carácter al del panel del héroe, y quedaban a 1743 px de
      // distancia en móvil. Ocupaba casi dos pantallas para no aportar una sola palabra.
      'adr-seccion-nivel',
      'adr-seccion-simulador',
      'adr-seccion-catalogo',
      // La sección de acceso va justo aquí: entre los dos productos y el precio. Antes o
      // después no sirve — la regla de qué se pierde solo importa un latido antes de pagar.
      'adr-seccion-acceso',
      'adr-seccion-planes',
      'adr-pie-publico',
    ];
    const presentes = Array.from(raiz.children).map((n) => n.tagName.toLowerCase());
    expect(presentes.filter((t) => orden.includes(t))).toEqual(orden);
  });

  it('debe prometer y enseñar la ruta sobre el pliegue', async () => {
    const fixture = await crear();
    const heroe: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-heroe');

    // El titular nombra el GÉNERO, no solo el instrumento: «acordeón» a secas incluye el de
    // piano y el cromático europeo, que es otra música. «Desde cero» bajó a la entradilla.
    expect(heroe.querySelector('h1')?.textContent).toContain('Aprende acordeón');
    expect(heroe.querySelector('h1')?.textContent).toContain('vallenato');
    expect(heroe.textContent).toContain('Desde cero');
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

  it('debe dibujar la ruta UNA sola vez en toda la pagina', async () => {
    const fixture = await crear();
    const raiz: HTMLElement = fixture.nativeElement;

    // Se dibujaba dos veces con texto identico caracter a caracter: el panel del heroe y una
    // seccion a tamanio completo, separadas por 1743 px en movil. Los cinco `resumen` van en
    // `null`, asi que la version grande no podia pintar ni una palabra que la compacta no
    // tuviera. La especificacion §6.1 situa la ruta completa en /curso/{slug}, no en la
    // portada. Si vuelve a aparecer una segunda, este numero lo delata.
    expect(raiz.querySelectorAll('adr-ruta-niveles').length).toBe(1);
    expect(raiz.querySelectorAll('adr-item-nivel').length).toBe(5);
    expect(raiz.querySelectorAll('.adr-nivel--bloqueado').length).toBe(3);

    // La unica frase util que aportaba la seccion borrada se conserva, en el panel.
    const heroe = raiz.querySelector('adr-seccion-heroe') as HTMLElement;
    expect(heroe.textContent).toContain('Cada nivel se abre al aprobar el examen del anterior');
  });

  it('debe contar el recorrido entero, del registro al certificado', async () => {
    const fixture = await crear();
    const camino: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-camino');

    expect(camino.querySelectorAll('.camino__paso').length).toBe(4);
    expect(camino.textContent).toContain('Te registras');
    expect(camino.textContent).toContain('Recibes tu certificado');
    // La marca de repetición es la pieza que hace encajar el modelo: sin ella el recorrido
    // se lee como cuatro pasos y no como cuatro niveles.
    expect(camino.querySelectorAll('.camino__paso--repite').length).toBe(1);
    expect(camino.textContent).toContain('Una vez por cada uno de los 4 niveles');
  });

  it('debe nombrar el conjunto vallenato con el acordeon primero y marcado', async () => {
    const fixture = await crear();
    const conjunto: HTMLElement = fixture.nativeElement.querySelector('.heroe__conjunto');

    const items = Array.from(conjunto.querySelectorAll('li'), (n) => n.textContent?.trim());
    expect(items).toEqual(['Acordeón vallenato', 'Caja', 'Guacharaca', 'Guitarra']);
    // Solo el acordeón va destacado: la página se enfoca en él a propósito.
    expect(conjunto.querySelectorAll('.heroe__instrumento--principal').length).toBe(1);
  });

  it('debe explicar el tramo en tres pasos', async () => {
    const fixture = await crear();
    const nivel: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-nivel');

    expect(nivel.querySelectorAll('.nivel__paso').length).toBe(3);
    // «Un instructor» y no «Diego»: la especificación §4 define el actor como «Diego u otros
    // profesores» y la decisión #4 sigue abierta. Comprometer por escrito a una persona
    // convierte una decisión pendiente en una promesa que habría que retractar en público.
    expect(nivel.textContent).toContain('un instructor te dice qué ajustar');
    expect(fixture.nativeElement.textContent).not.toContain('Diego revisa');
  });

  it('debe presentar el simulador con marco de ventana y su diagrama dibujado', async () => {
    const fixture = await crear();
    const sim: HTMLElement = fixture.nativeElement.querySelector('adr-seccion-simulador');

    expect(sim.querySelector('.adr-marco--ventana')).not.toBeNull();
    // Cuatro hileras de ocho: tres de pitos y una de bajos, que es como es el acordeón
    // diatónico de verdad. Con quince botones el marco se veía medio vacío y hacía parecer
    // inacabado justo lo único que ningún competidor tiene.
    expect(sim.querySelectorAll('.simulador__boton').length).toBe(32);
    expect(sim.querySelectorAll('.simulador__boton--activo').length).toBe(3);
    expect(sim.querySelectorAll('.simulador__chip').length).toBe(3);
  });

  it('debe decir QUE SE PIERDE al cancelar, no solo que se puede cancelar', async () => {
    const fixture = await crear();
    const texto: string = fixture.nativeElement.textContent;

    // La página repetía tres veces «cancela cuando quieras» y ninguna que al cancelar se
    // pierden los cursos del catálogo. Así fabricaba el reclamo de soporte más caro de las
    // plataformas de suscripción en vez de prevenirlo. La especificación §3.2 exige que esto
    // se entienda ANTES de pagar, no en el correo de cancelación.
    expect(texto).toContain('pierdes los cursos');
    expect(texto).toContain('conservas');
  });

  it('no debe ofrecer ningun destino interno que el enrutador no sepa resolver', async () => {
    const fixture = await crear();

    // Los ocho botones de la página apuntaban a `/registro`, que no existe: el comodín los
    // devolvía en silencio a la portada, así que un enlace roto se veía igual que uno bueno.
    // Es el defecto más caro que puede tener una landing y no sale en ninguna captura.
    // Se compara la RUTA, no el enlace entero: lo que el enrutador tiene que saber resolver
    // es el camino. El fragmento y la consulta van detras y no cambian el destino — el
    // logotipo apunta a `/#inicio`, que es la portada con un salto al heroe.
    const internos: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[href^="/"]'),
      (a) => ((a as HTMLAnchorElement).getAttribute('href') ?? '').split(/[?#]/)[0],
    );

    expect(internos.length).toBeGreaterThan(0);
    for (const destino of internos) {
      expect(RUTAS_INTERNAS).toContain(destino);
    }
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

  it('debe pintar imagen donde hay archivo y marcador donde todavia no lo hay', async () => {
    const fixture = await crear();

    // Seis huecos: heroe, simulador, tres portadas y la foto de practica. Hoy hay cinco
    // imagenes; el simulador sigue con su diagrama dibujado porque no existe captura real.
    //
    // Se cuentan las del marco y no todas las `img` de la pagina: la barra lleva ahora el
    // logotipo, que no es un hueco de foto y no debe contar aqui.
    expect(fixture.nativeElement.querySelectorAll('.adr-marco__imagen').length).toBe(5);
    expect(fixture.nativeElement.querySelectorAll('.adr-marco__marcador').length).toBe(1);
  });

  it('debe describir la foto de practica, que ensenia el instrumento y no decora', async () => {
    const fixture = await crear();
    const foto: HTMLImageElement = fixture.nativeElement.querySelector(
      'adr-seccion-nivel .adr-marco__imagen',
    );

    // Un `alt` vacio aqui perderia el unico sitio donde la pagina dice, en texto, cual es
    // el instrumento. Es informacion, no adorno.
    expect(foto).not.toBeNull();
    expect(foto.getAttribute('alt')).toContain('diatónico');
  });

  it('debe cargar con prioridad solo el fondo del heroe, que es el LCP', async () => {
    const fixture = await crear();

    const imagenes: HTMLImageElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('img'),
    );
    const prioritarias = imagenes.filter((i) => i.getAttribute('loading') === 'eager');

    expect(prioritarias.length).toBe(1);
    expect(prioritarias[0].getAttribute('src')).toContain('heroe');
  });

  it('debe servir todas las FOTOS en WebP', async () => {
    const fixture = await crear();

    // Solo las fotos. El logotipo de la barra es un SVG a proposito: es un dibujo de trazos,
    // no una fotografia, y en vectorial pesa menos y se ve nitido a cualquier tamanio.
    // Convertirlo a WebP seria empeorarlo por cumplir una regla que no le corresponde.
    const fuentes: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('.adr-marco__imagen'),
      (i) => (i as HTMLImageElement).getAttribute('src') ?? '',
    );
    expect(fuentes.length).toBeGreaterThan(0);
    expect(fuentes.every((s) => s.endsWith('.webp'))).toBe(true);
  });

  it('no debe ofrecer WhatsApp mientras no haya número configurado', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('adr-whatsapp-flotante')).toBeNull();
  });
});
