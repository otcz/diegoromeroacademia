package com.academiadiegoromero.compartido.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Correo electronico de un usuario, ya normalizado.
 *
 * <p>La normalizacion a minusculas ocurre al construirse y no al guardar, porque el no
 * negociable #1 —un correo resuelve siempre a la misma cuenta— depende de que la misma
 * direccion produzca siempre exactamente la misma clave. Si la normalizacion viviera en la
 * capa de persistencia, un ingreso por Google podria crear una cuenta duplicada de alguien
 * que ya pago.
 */
public record Correo(String valor) {

    private static final Pattern PATRON = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$");

    private static final int LONGITUD_MAXIMA = 254;

    public Correo {
        if (valor == null || valor.isBlank()) {
            throw new DatoInvalidoExcepcion("correo", "El correo es obligatorio");
        }

        valor = valor.trim().toLowerCase(Locale.ROOT);

        if (valor.length() > LONGITUD_MAXIMA) {
            throw new DatoInvalidoExcepcion("correo", "El correo supera la longitud permitida");
        }
        if (!PATRON.matcher(valor).matches()) {
            throw new DatoInvalidoExcepcion("correo", "El correo no tiene un formato valido");
        }
    }

    /** Parte de dominio del correo. Sirve para metricas y para detectar correos desechables. */
    public String dominio() {
        return valor.substring(valor.indexOf('@') + 1);
    }
}
