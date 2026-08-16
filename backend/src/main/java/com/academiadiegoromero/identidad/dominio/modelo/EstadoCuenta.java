package com.academiadiegoromero.identidad.dominio.modelo;

/**
 * En que situacion esta una cuenta.
 *
 * <p>Los dos campos van juntos porque responden a la misma pregunta —«¿puede entrar esta
 * persona?»— y separarlos invita a comprobar uno y olvidar el otro.
 *
 * @param activa si no esta dada de baja ni suspendida
 * @param correoVerificado si alguien PROBO que el correo es suyo, y no solo lo escribio
 */
public record EstadoCuenta(boolean activa, boolean correoVerificado) {

    /** Quien entra por un proveedor externo llega con el correo ya probado por el proveedor. */
    public static EstadoCuenta verificada() {
        return new EstadoCuenta(true, true);
    }

    /**
     * Quien se registra con contrasena empieza SIN verificar.
     *
     * <p>No es un tramite: es lo que impide que alguien registre el correo de otra persona y
     * se quede con su cuenta cuando esa persona entre por Google. Ver
     * {@code IngresarConProveedorExterno}.
     */
    public static EstadoCuenta sinVerificar() {
        return new EstadoCuenta(true, false);
    }

    /** Copia con el correo ya probado. */
    public EstadoCuenta conCorreoVerificado() {
        return new EstadoCuenta(activa, true);
    }
}
