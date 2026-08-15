/**
 * Configuracion de entorno — PRODUCCION.
 *
 * <p>Regla 5: nada de esto se escribe dentro de un componente. Y nunca un secreto: todo lo
 * que llega al navegador es publico, aunque este minificado (docs/03 §7).
 *
 * <p>Las banderas de funcionalidad NO viven aqui: llegan desde el backend al iniciar
 * sesion, para que exista una sola fuente de verdad entre las dos puntas.
 */
export const entorno = {
  produccion: true,
  urlApi: '/api',
  urlVerificacionCertificado: 'https://diegoromeroacordeon.com/verificar',
} as const;
