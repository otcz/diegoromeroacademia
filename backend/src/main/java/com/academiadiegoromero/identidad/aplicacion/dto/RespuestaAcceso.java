package com.academiadiegoromero.identidad.aplicacion.dto;

/**
 * Respuesta de un ingreso correcto. Espejo de `RespuestaAcceso` en TypeScript.
 *
 * <p>`tokenAcceso` va VACIO por ahora: la sesion viaja en una cookie `HttpOnly`, que es mas
 * segura que un token en manos de JavaScript —un script inyectado no puede leerla—. El campo
 * se conserva porque el contrato del frontend lo declara y la especificacion §5.3 preve JWT
 * con refresco; se rellenara cuando exista esa pieza, sin romper el contrato hoy.
 */
public record RespuestaAcceso(String tokenAcceso, String expiraEn, UsuarioSesion usuario) {

    public static RespuestaAcceso deSesion(UsuarioSesion usuario) {
        return new RespuestaAcceso("", "", usuario);
    }
}
