import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavPublica } from '../../compartido/componentes/nav-publica/nav-publica';
import { PiePublico } from '../../compartido/componentes/pie-publico/pie-publico';
import { WhatsappFlotante } from '../../compartido/componentes/whatsapp-flotante/whatsapp-flotante';
import { SeccionCatalogo } from './secciones/seccion-catalogo';
import { SeccionCifras } from './secciones/seccion-cifras';
import { SeccionHeroe } from './secciones/seccion-heroe';
import { SeccionNivel } from './secciones/seccion-nivel';
import { SeccionPlanes } from './secciones/seccion-planes';
import { SeccionPrueba } from './secciones/seccion-prueba';
import { SeccionRuta } from './secciones/seccion-ruta';
import { SeccionSimulador } from './secciones/seccion-simulador';

/**
 * Landing pública (pantalla 1, especificación §6.1).
 *
 * <p>Este componente solo compone. Cada sección vive en su propio archivo bajo `secciones/`
 * porque la plantilla anterior tenía 201 líneas contra un tope de 150, y porque una landing
 * de una sola pieza es imposible de revisar: nadie sabe qué se rompe al tocar algo.
 *
 * <p>El orden es el argumento: se promete, se prueba con cifras, se enseña el camino, se
 * explica un tramo, se muestra lo exclusivo, se pone precio y se cierra. Cada sección que no
 * mueva al alumno a registrarse o no genere confianza, sobra.
 *
 * <p>La sección de testimonios lleva guarda propia: si no hay comentarios reales del canal,
 * no se dibuja.
 */
@Component({
  selector: 'adr-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavPublica,
    PiePublico,
    SeccionCatalogo,
    SeccionCifras,
    SeccionHeroe,
    SeccionNivel,
    SeccionPlanes,
    SeccionPrueba,
    SeccionRuta,
    SeccionSimulador,
    WhatsappFlotante,
  ],
  template: `
    <adr-nav-publica />

    <adr-seccion-heroe />
    <adr-seccion-cifras />
    <adr-seccion-ruta />
    <adr-seccion-nivel />
    <adr-seccion-simulador />
    <adr-seccion-catalogo />
    <adr-seccion-planes />
    <adr-seccion-prueba />

    <adr-pie-publico [numeroWhatsapp]="numeroWhatsapp" [anio]="anio" />

    @if (numeroWhatsapp) {
      <adr-whatsapp-flotante [numero]="numeroWhatsapp" />
    }
  `,
})
export class Landing {
  protected readonly anio = 2026;

  // Pendiente de configuracion de marca (docs/03 §3). Sin numero, el boton no se dibuja.
  protected readonly numeroWhatsapp = '';
}
