package com.academiadiegoromero.identidad.aplicacion.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Lo que envia el formulario de acceso. Espejo de `SolicitudAcceso` del frontend.
 *
 * <p>Solo comprueba PRESENCIA. La forma del correo y la fortaleza de la contrasena las
 * validan los objetos de valor del dominio, y aqui exigir mas seria contarle al atacante que
 * reglas cumple una contrasena valida antes siquiera de mirar si la cuenta existe.
 */
public record SolicitudAcceso(@NotBlank String correo, @NotBlank String contrasena) {

    /** No revela la contrasena si alguien registra el objeto o lo mete en un mensaje de error. */
    @Override
    public String toString() {
        return "SolicitudAcceso[correo=%s, contrasena=oculta]".formatted(correo);
    }
}
