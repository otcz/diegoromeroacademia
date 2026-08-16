package com.academiadiegoromero.identidad.aplicacion.dto;

import jakarta.validation.constraints.NotBlank;

/** Cuerpo para poner o cambiar la contrasena de la cuenta con sesion abierta. */
public record SolicitudContrasena(@NotBlank String contrasena) {

    /** No revela la contrasena si el objeto acaba en una bitacora o en un mensaje de error. */
    @Override
    public String toString() {
        return "SolicitudContrasena[contrasena=oculta]";
    }
}
