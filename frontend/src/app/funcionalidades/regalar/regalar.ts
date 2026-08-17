import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Boton } from '../../compartido/componentes/boton/boton';
import { Chip } from '../../compartido/componentes/chip/chip';
import { Icono } from '../../compartido/componentes/icono/icono';
import { TarjetaRegalo } from '../../compartido/componentes/tarjeta-regalo/tarjeta-regalo';
import { PesosPipe } from '../../compartido/formato/pesos-pipe';
import { EntregaRegalo, TipoRegalo } from '../../nucleo/modelos/comercio';
import { ComercioServicio } from '../../nucleo/servicios/comercio-servicio';

/** Tope del mensaje de la tarjeta. Del handoff: 200 caracteres. */
export const LIMITE_MENSAJE = 200;

/**
 * Regalar: tres pasos con vista previa en vivo de la tarjeta.
 *
 * <p><b>La vista previa se actualiza mientras se escribe, y ese es el punto.</b> Quien regala
 * no esta comprando un producto: esta mandando un gesto, y lo que quiere ver antes de pagar
 * es como le va a llegar. Un resumen de texto no cumple esa funcion.
 *
 * <p>La suscripcion de regalo NO se renueva sola. Se dice en la pantalla porque es lo
 * contrario de lo que espera quien conoce las suscripciones, y descubrirlo con un cobro es
 * la peor forma de enterarse.
 */
@Component({
  selector: 'adr-regalar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Boton, Chip, Icono, PesosPipe, ReactiveFormsModule, RouterLink, TarjetaRegalo],
  templateUrl: './regalar.html',
  styleUrl: './regalar.scss',
})
export class Regalar {
  private readonly comercio = inject(ComercioServicio);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly limiteMensaje = LIMITE_MENSAJE;

  protected readonly tipos: readonly TipoRegalo[] = [
    'Suscripción',
    'Bono de valor',
    'Producto de la tienda',
  ];

  protected readonly entregas: readonly EntregaRegalo[] = [
    'Ahora mismo',
    'En una fecha',
    'La entrego yo',
  ];

  protected readonly tipo = signal<TipoRegalo>('Suscripción');
  protected readonly entrega = signal<EntregaRegalo>('Ahora mismo');
  protected readonly canjeAbierto = signal(false);

  protected readonly nombre = new FormControl('', { nonNullable: true });
  protected readonly contacto = new FormControl('', { nonNullable: true });
  protected readonly mensaje = new FormControl('', { nonNullable: true });

  /** Lo que se escribe, como signal, para que la vista previa reaccione tecla a tecla. */
  protected readonly nombreEscrito = toSignal(this.nombre.valueChanges.pipe(map((v) => v ?? '')), {
    initialValue: '',
  });

  protected readonly mensajeEscrito = toSignal(
    // Se recorta AQUI y no solo en el atributo `maxlength`: `maxlength` no impide pegar
    // texto por programa ni protege de un valor que llegue restaurado, y la vista previa
    // no puede enseniar mas de lo que se va a enviar.
    this.mensaje.valueChanges.pipe(map((v) => (v ?? '').slice(0, LIMITE_MENSAJE))),
    { initialValue: '' },
  );

  /** Opciones del tipo elegido. Se recalculan al cambiar de tipo. */
  protected readonly opciones = computed(() => this.comercio.opcionesDeRegalo(this.tipo()));

  private readonly opcionElegida = signal<string | null>(null);

  /**
   * La opcion vigente.
   *
   * <p>Cae en la primera de la lista cuando no hay ninguna elegida o cuando la elegida no
   * pertenece al tipo actual. Sin ese respaldo, cambiar de «Suscripción» a «Bono» dejaria
   * seleccionado «1 mes de Intermedio», que ya no esta en la lista, y el resumen mostraria
   * un precio que no corresponde a nada visible.
   */
  protected readonly opcion = computed(() => {
    const lista = this.opciones();
    const elegida = lista.find((o) => o.etiqueta === this.opcionElegida());
    return elegida ?? lista[0];
  });

  protected readonly nombreParaTarjeta = computed(
    () => this.nombreEscrito().trim() || 'Quien lo recibe',
  );

  protected readonly mensajeParaTarjeta = computed(
    () => this.mensajeEscrito().trim() || 'Para que por fin aprendas ese paseo que tanto te gusta.',
  );

  constructor() {
    // Si se llega desde la tienda con `?producto=`, el flujo arranca en ese producto: quien
    // pulsó el regalo en una tarjeta ya eligió qué regala, y hacerle repetir la elección en
    // una lista de nueve es perder el gesto que acaba de hacer.
    //
    // Un identificador que no exista se ignora en silencio y el flujo arranca por defecto.
    // El parámetro viene de la URL, así que puede traer cualquier cosa.
    const productoId = this.ruta.snapshot.queryParamMap.get('producto');
    if (!productoId) {
      return;
    }

    this.comercio.productos().subscribe((productos) => {
      const producto = productos.find((p) => p.id === productoId);
      if (producto) {
        this.tipo.set('Producto de la tienda');
        this.opcionElegida.set(producto.nombre);
      }
    });
  }

  protected elegirTipo(tipo: TipoRegalo): void {
    this.tipo.set(tipo);
    this.opcionElegida.set(null);
  }

  protected elegirOpcion(etiqueta: string): void {
    this.opcionElegida.set(etiqueta);
  }

  /** Explicacion que cambia con el tipo. Es donde se dice lo de la renovacion. */
  protected readonly aviso = computed(() => {
    switch (this.tipo()) {
      case 'Suscripción':
        return 'La suscripción de regalo no se renueva automáticamente: al terminar, quien la recibe decide si sigue.';
      case 'Bono de valor':
        return 'El bono se puede usar en cursos, tutoriales o tienda, y no caduca.';
      default:
        return 'Los productos físicos se envían a la dirección que indique quien lo recibe al canjear.';
    }
  });
}
