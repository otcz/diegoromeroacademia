package com.academiadiegoromero.identidad.dominio.modelo;

/**
 * Por donde entro un usuario.
 *
 * <p>Es un dato de PROCEDENCIA, no de identidad. Quien manda es el correo: el no negociable
 * #1 dice que una misma direccion resuelve siempre al mismo {@link Usuario}, entre por donde
 * entre. Este enum solo registra el camino, para poder volver a reconocer al mismo usuario
 * sin pedirle contrasena y para saber que metodos tiene disponibles.
 */
public enum ProveedorIdentidad {

    /** OAuth 2.0 de Google. Prioridad alta en la especificacion §5.1. */
    GOOGLE,

    /** OAuth 2.0 de Facebook. Detras de bandera, todavia apagada. */
    FACEBOOK,

    /** Correo y contrasena. Obligatorio como respaldo: no todos tienen los otros dos. */
    CORREO
}
