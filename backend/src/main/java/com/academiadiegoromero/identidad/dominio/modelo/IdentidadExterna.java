package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;

/**
 * La forma en que un proveedor externo nombra a un usuario.
 *
 * <p>El {@code sujeto} es el identificador estable que da el proveedor —el {@code sub} del
 * token de Google—, no el correo. Es importante: una persona puede cambiar de correo en
 * Google conservando su cuenta, y en ese caso el sujeto sigue apuntando a la misma persona.
 * El correo sirve para UNIFICAR cuentas al vincular; el sujeto, para RECONOCER al que vuelve.
 *
 * @param proveedor por donde entro
 * @param sujeto identificador estable dentro de ese proveedor
 */
public record IdentidadExterna(ProveedorIdentidad proveedor, String sujeto) {

    private static final int LONGITUD_MAXIMA_SUJETO = 255;

    public IdentidadExterna {
        if (proveedor == null) {
            throw new DatoInvalidoExcepcion("proveedor", "El proveedor es obligatorio");
        }
        if (sujeto == null || sujeto.isBlank()) {
            throw new DatoInvalidoExcepcion("sujeto", "El identificador del proveedor es obligatorio");
        }
        sujeto = sujeto.trim();
        if (sujeto.length() > LONGITUD_MAXIMA_SUJETO) {
            throw new DatoInvalidoExcepcion("sujeto", "El identificador del proveedor es demasiado largo");
        }
    }
}
