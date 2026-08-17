/**
 * Formateadores compartidos.
 *
 * <p>Son funciones puras y no metodos de un servicio: no dependen de nada, se prueban sin
 * montar un componente y las pueden usar tanto las tuberias de plantilla como el codigo que
 * arma una etiqueta. Un `FormateadorServicio` inyectable seria ceremonia sin beneficio.
 *
 * <p>Estan aqui y no en cada pantalla porque el precio aparece en la tienda, en el carrito,
 * en el resumen del regalo, en los planes y en el historial de pagos. Cinco sitios
 * formateando a su manera es como acaban conviviendo «$59.900» y «$ 59900,00».
 */

/**
 * Localizacion de todos los formatos de la aplicacion.
 *
 * <p>Fija y no tomada del navegador: los precios son en pesos colombianos y las fechas del
 * curso son de Colombia. Con la del navegador, un alumno en Espana veria «59.900 ₡» o el
 * separador cambiado, y el numero dejaria de coincidir con lo que cobra la pasarela.
 */
const LOCALIZACION = 'es-CO';

/** Cuantos centavos hay en un peso. El dinero se guarda en entero (ver modelos/comercio). */
const CENTAVOS_POR_PESO = 100;

const SEGUNDOS_POR_MINUTO = 60;

/**
 * Convierte centavos a pesos con separador de miles: 5990000 → «$59.900».
 *
 * <p>Sin decimales a proposito: en pesos colombianos no se cobran centavos, y arrastrar
 * «,00» en cada precio de la tienda solo hace ruido.
 */
export function formatearPesos(centavos: number): string {
  const pesos = Math.round(centavos / CENTAVOS_POR_PESO);
  return `$${pesos.toLocaleString(LOCALIZACION)}`;
}

/**
 * Convierte segundos a «m:ss» o «h:mm:ss» cuando pasa de la hora.
 *
 * <p>Los segundos van siempre a dos digitos: sin el relleno, la barra de tiempo salta de
 * ancho en cada tic —«7:9» y luego «7:10»— y el numero baila mientras se ve el video.
 */
export function formatearDuracion(segundos: number): string {
  const total = Math.max(0, Math.floor(segundos));
  const horas = Math.floor(total / (SEGUNDOS_POR_MINUTO * SEGUNDOS_POR_MINUTO));
  const minutos = Math.floor(total / SEGUNDOS_POR_MINUTO) % SEGUNDOS_POR_MINUTO;
  const resto = total % SEGUNDOS_POR_MINUTO;
  const ss = String(resto).padStart(2, '0');

  return horas > 0 ? `${horas}:${String(minutos).padStart(2, '0')}:${ss}` : `${minutos}:${ss}`;
}

/** Duracion en la forma larga que usan las tarjetas: «42 min». */
export function formatearMinutos(segundos: number): string {
  return `${Math.round(segundos / SEGUNDOS_POR_MINUTO)} min`;
}

/**
 * Iniciales para un avatar sin foto: «Andrés Villa Restrepo» → «AV».
 *
 * <p>Dos letras como maximo: tres ya no caben en un circulo de 32 px sin encogerlas hasta
 * volverlas ilegibles.
 */
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) {
    return '';
  }
  const primera = palabras[0][0];
  const segunda = palabras.length > 1 ? palabras[1][0] : '';
  return (primera + segunda).toUpperCase();
}
