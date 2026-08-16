package com.academiadiegoromero.identidad.aplicacion.dto;

import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import java.util.Locale;

/**
 * El usuario tal como lo ve el frontend. Espejo de `UsuarioSesion` en TypeScript.
 *
 * <p>Se envia lo minimo para pintar la interfaz. Nada de fechas internas, contadores de
 * fallos ni la lista de identidades: lo que no sale, no se filtra.
 *
 * <p>El rol viaja en minusculas porque asi lo declara el contrato del frontend.
 */
public record UsuarioSesion(String id, String nombre, String correo, String rol) {

    public static UsuarioSesion de(Usuario usuario) {
        return new UsuarioSesion(
                usuario.id().toString(),
                usuario.datos().nombre(),
                usuario.datos().correo().valor(),
                usuario.datos().rol().name().toLowerCase(Locale.ROOT));
    }
}
