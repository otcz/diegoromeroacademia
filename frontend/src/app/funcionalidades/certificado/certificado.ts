import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Icono } from '../../compartido/componentes/icono/icono';
import { ACTIVOS } from '../../disenio/activos';
import { entorno } from '../../../entornos/entorno';
import { ComercioServicio } from '../../nucleo/servicios/comercio-servicio';

/**
 * Certificado: el diploma y sus acciones.
 *
 * <p>El diploma se dibuja con HTML y tokens, no como imagen. Asi el nombre se puede
 * seleccionar y copiar, escala sin pixelarse, lo lee un lector de pantalla y el codigo de
 * verificacion se puede buscar con el navegador. Un PNG generado en el servidor no da nada
 * de eso, y el PDF descargable es otra cosa que se genera aparte.
 *
 * <p>El certificado NO se pierde al vencer la suscripcion (no negociable 5). Se dice en la
 * pantalla, porque es justo lo que el alumno teme al cancelar.
 */
@Component({
  selector: 'adr-certificado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Icono, RouterLink],
  templateUrl: './certificado.html',
  styleUrl: './certificado.scss',
})
export class CertificadoPantalla {
  private readonly ruta = inject(ActivatedRoute);
  private readonly comercio = inject(ComercioServicio);

  protected readonly logotipo = ACTIVOS.logotipo;

  protected readonly certificado = toSignal(
    this.ruta.paramMap.pipe(switchMap((p) => this.comercio.certificado(p.get('id') ?? ''))),
    { initialValue: null },
  );

  /**
   * Enlace publico de verificacion.
   *
   * <p>Sale de `entorno` y no escrito a mano: el dominio cambia entre local, demostracion y
   * produccion, y un enlace de verificacion que apunte al sitio equivocado convierte el
   * certificado en papel mojado justo cuando alguien lo comprueba.
   */
  protected readonly enlaceVerificacion = computed(() => {
    const codigo = this.certificado()?.codigo;
    return codigo ? `${entorno.urlVerificacionCertificado}/${codigo}` : '';
  });
}
