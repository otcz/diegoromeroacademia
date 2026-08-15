/**
 * Contrato de la API de autenticacion.
 *
 * <p>Estos tipos son el espejo de los DTO del modulo `identidad` del backend, y deben
 * cambiar en el MISMO commit que ellos. Es el precio de mantener el contrato a mano entre
 * Java y TypeScript, y la razon por la que el proyecto es un monorepo (ADR 0004).
 */

export type ProveedorExterno = 'google' | 'facebook';

export interface SolicitudAcceso {
  readonly correo: string;
  readonly contrasena: string;
}

export interface UsuarioSesion {
  readonly id: string;
  readonly nombre: string;
  readonly correo: string;
  readonly rol: 'estudiante' | 'instructor' | 'administrador';
}

export interface RespuestaAcceso {
  readonly tokenAcceso: string;
  readonly expiraEn: string;
  readonly usuario: UsuarioSesion;
}

/**
 * Codigos de error estables que devuelve el backend en `codigoError` (docs/01 §9).
 *
 * <p>El frontend reacciona al codigo, nunca al mensaje: el mensaje se puede reescribir
 * para que sea mas claro sin romper nada, el codigo no.
 */
export const CODIGOS_ERROR_ACCESO = {
  credencialesInvalidas: 'CREDENCIALES_INVALIDAS',
  cuentaBloqueada: 'CUENTA_BLOQUEADA',
  correoNoVerificado: 'CORREO_NO_VERIFICADO',
  limiteDispositivos: 'LIMITE_DISPOSITIVOS',
} as const;
