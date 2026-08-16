import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavPublica } from '../../compartido/componentes/nav-publica/nav-publica';
import { PiePublico } from '../../compartido/componentes/pie-publico/pie-publico';
import { WhatsappFlotante } from '../../compartido/componentes/whatsapp-flotante/whatsapp-flotante';
import { SeccionAcceso } from './secciones/seccion-acceso';
import { SeccionCamino } from './secciones/seccion-camino';
import { SeccionCatalogo } from './secciones/seccion-catalogo';
import { SeccionCifras } from './secciones/seccion-cifras';
import { SeccionHeroe } from './secciones/seccion-heroe';
import { SeccionNivel } from './secciones/seccion-nivel';
import { SeccionPlanes } from './secciones/seccion-planes';
import { SeccionPrueba } from './secciones/seccion-prueba';
import { SeccionSimulador } from './secciones/seccion-simulador';

/**
 * Landing pública (pantalla 1, especificación §6.1).
 *
 * <p>Este componente solo compone. Cada sección vive en su propio archivo bajo `secciones/`
 * porque la plantilla anterior tenía 201 líneas contra un tope de 150, y porque una landing
 * de una sola pieza es imposible de revisar: nadie sabe qué se rompe al tocar algo.
 *
 * <p>El orden es el argumento, y responde en el orden en que el visitante se hace las
 * preguntas: qué es esto (héroe), por qué creerte (cifras), <b>cómo entro y qué pasa después</b>
 * (camino), cuáles son los niveles (ruta), qué pasa dentro de uno (nivel), qué tienes tú que
 * nadie más (simulador), qué compro (catálogo), con qué reglas (acceso), cuánto cuesta
 * (planes) y adelante (cierre).
 *
 * <p>La sección del camino va tercera y no más abajo porque quien llega de YouTube pregunta
 * «¿cómo entro?» antes que «¿qué trae el nivel 3?». Antes ese arco completo no estaba escrito
 * en ningún sitio: había que armarlo juntando cuatro secciones separadas por dos pantallazos.
 *
 * <p>Cada sección que no mueva al alumno a registrarse o no genere confianza, sobra.
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
    SeccionAcceso,
    SeccionCamino,
    SeccionCatalogo,
    SeccionCifras,
    SeccionHeroe,
    SeccionNivel,
    SeccionPlanes,
    SeccionPrueba,
    SeccionSimulador,
    WhatsappFlotante,
  ],
  template: `
    <adr-nav-publica />

    <adr-seccion-heroe />
    <adr-seccion-cifras />
    <adr-seccion-camino />
    <adr-seccion-nivel />
    <adr-seccion-simulador />
    <adr-seccion-catalogo />
    <adr-seccion-acceso />
    <adr-seccion-planes />
    <adr-seccion-prueba />

    <adr-pie-publico [numeroWhatsapp]="numeroWhatsapp" [anio]="anio" />

    @if (numeroWhatsapp) {
      <adr-whatsapp-flotante [numero]="numeroWhatsapp" />
    }
  `,
})
export class Landing {
  // Se evalúa en el dispositivo del visitante: el build es de navegador servido estático, sin
  // renderizado en servidor. Escrito a mano, el 1 de enero la página mostraría un copyright
  // vencido — la señal universal de sitio abandonado, justo donde hay que generar confianza
  // para cobrar.
  protected readonly anio = new Date().getFullYear();

  // Pendiente de configuracion de marca (docs/03 §3). Sin numero, el boton no se dibuja.
  protected readonly numeroWhatsapp = '';
}
