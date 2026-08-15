import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Dificultad } from '../../compartido/componentes/dificultad/dificultad';
import { Etiqueta } from '../../compartido/componentes/etiqueta/etiqueta';
import { Icono } from '../../compartido/componentes/icono/icono';
import { NavPublica } from '../../compartido/componentes/nav-publica/nav-publica';
import { PiePublico } from '../../compartido/componentes/pie-publico/pie-publico';
import { WhatsappFlotante } from '../../compartido/componentes/whatsapp-flotante/whatsapp-flotante';
import {
  CATALOGO,
  CIFRAS,
  PASOS_METODO,
  PLANES,
  VENTAJAS_SIMULADOR,
} from './landing.contenido';

/**
 * Landing publica (pantalla 1, especificacion §6.1).
 *
 * <p>Recreacion del diseno aprobado «Azul rey». Los precios se muestran sin registro a
 * proposito: es la diferencia deliberada frente a FZ Academia, que los oculta hasta que te
 * registras (especificacion §1).
 *
 * <p>La navegacion y el pie salen del catalogo compartido porque se repiten en todas las
 * paginas publicas. Este componente solo aporta el contenido propio de la portada.
 */
@Component({
  selector: 'adr-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Dificultad, Etiqueta, Icono, NavPublica, PiePublico, WhatsappFlotante],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  protected readonly cifras = CIFRAS;
  protected readonly pasosMetodo = PASOS_METODO;
  protected readonly ventajasSimulador = VENTAJAS_SIMULADOR;
  protected readonly catalogo = CATALOGO;
  protected readonly planes = PLANES;
  protected readonly anio = 2026;

  // Pendiente de configuracion de marca (docs/03 §3). Sin numero, el boton no se dibuja.
  protected readonly numeroWhatsapp = '';
}
