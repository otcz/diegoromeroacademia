package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;

/**
 * Contrasena en claro, validada. Solo existe entre que el alumno la escribe y se cifra.
 *
 * <p>Es un objeto de valor y no un {@code String} suelto por dos motivos. El primero es que
 * la politica de fortaleza se comprueba al construirlo, asi que una contrasena debil no llega
 * nunca al cifrador. El segundo es que el tipo hace imposible confundir en una firma la
 * contrasena en claro con la ya cifrada — un intercambio que guardaria texto plano en la base
 * y no daria ningun error.
 *
 * <p><b>No expone {@code toString}.</b> Se sobrescribe a proposito para que un registro de
 * bitacora descuidado, o un volcado de excepcion, no imprima la contrasena de nadie.
 *
 * <p><b>Sobre la politica.</b> Se exige longitud y nada mas. Obligar a mayusculas, numeros y
 * simbolos produce contrasenas mas cortas y mas predecibles —la gente escribe Pepito1! — y
 * empuja a reutilizarlas. Las guias actuales del NIST recomiendan longitud y comprobacion
 * contra listas de filtradas, no composicion forzada. La lista queda pendiente de un servicio
 * externo; el minimo de longitud no.
 */
public record Contrasena(String valor) {

    /** Doce caracteres. Por encima del minimo habitual, y sin exigir composicion. */
    public static final int LONGITUD_MINIMA = 12;

    /**
     * Tope alto, pero tope. BCrypt solo considera los primeros 72 bytes, y sin limite propio
     * una cadena de megabytes serian megabytes de trabajo de cifrado por cada intento.
     */
    public static final int LONGITUD_MAXIMA = 72;

    public Contrasena {
        if (valor == null || valor.isEmpty()) {
            throw new DatoInvalidoExcepcion("contrasena", "La contrasena es obligatoria");
        }
        if (valor.length() < LONGITUD_MINIMA) {
            throw new DatoInvalidoExcepcion(
                    "contrasena",
                    "La contrasena debe tener al menos %d caracteres".formatted(LONGITUD_MINIMA));
        }
        if (valor.length() > LONGITUD_MAXIMA) {
            throw new DatoInvalidoExcepcion(
                    "contrasena",
                    "La contrasena no puede pasar de %d caracteres".formatted(LONGITUD_MAXIMA));
        }
    }

    /** Nunca revela el valor: es lo que evita que aparezca en una bitacora o en un volcado. */
    @Override
    public String toString() {
        return "Contrasena[oculta]";
    }
}
