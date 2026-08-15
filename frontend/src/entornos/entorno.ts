/**
 * Configuracion de entorno — PRODUCCION.
 *
 * <p>Regla 5: nada de esto se escribe dentro de un componente. Y nunca un secreto: todo lo
 * que llega al navegador es publico, aunque este minificado (docs/03 §7).
 */
export const entorno = {
  produccion: true,
  urlApi: '/api',
  urlVerificacionCertificado: 'https://diegoromeroacordeon.com/verificar',

  /**
   * Bandera visible ANTES de iniciar sesion.
   *
   * <p>Las banderas de funcionalidad llegan del backend al abrir sesion (docs/03 §7), pero
   * la pantalla de acceso se dibuja cuando todavia no hay sesion. Mientras el backend no
   * exponga un endpoint publico de configuracion, esta copia local es el puente — y hay que
   * mantenerla igual a `academia.funcionalidades.login-facebook-habilitado`.
   */
  loginFacebookHabilitado: false,
} as const;
