package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;

/**
 * Los datos que describen a un usuario, sin su identidad tecnica ni sus formas de entrar.
 *
 * <p>Nace de una senial del linter —{@link Usuario} pedia siete parametros— y resulto ser la
 * agrupacion correcta: estos cuatro campos son lo que cambia cuando una persona edita su
 * cuenta, mientras que el identificador, la fecha de alta y las identidades vinculadas los
 * gobierna el sistema. Separarlos hace que la firma diga cual de las dos cosas se esta tocando.
 *
 * <p>Valida al construirse, asi que un usuario sin nombre no llega a existir.
 *
 * @param correo la identidad real: el no negociable #1 resuelve por aqui
 * @param nombre nombre visible
 * @param rol que puede hacer
 * @param activo si la cuenta esta disponible
 */
public record DatosUsuario(Correo correo, String nombre, Rol rol, boolean activo) {

    public DatosUsuario {
        if (correo == null) {
            throw new DatoInvalidoExcepcion("correo", "El correo es obligatorio");
        }
        if (rol == null) {
            throw new DatoInvalidoExcepcion("rol", "El rol es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new DatoInvalidoExcepcion("nombre", "El nombre es obligatorio");
        }
        nombre = nombre.trim();
    }

    /** Copia con el mismo perfil pero dado de baja. */
    public DatosUsuario desactivado() {
        return new DatosUsuario(correo, nombre, rol, false);
    }
}
