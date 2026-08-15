/**
 * Configuracion de entorno — DESARROLLO LOCAL.
 *
 * <p>Reemplaza a `entorno.ts` mediante fileReplacements en la configuracion `development`
 * de angular.json. Apunta al backend levantado con `./mvnw spring-boot:run`.
 */
export const entorno = {
  produccion: false,
  urlApi: 'http://localhost:8080/api',
  urlVerificacionCertificado: 'http://localhost:4200/verificar',
} as const;
