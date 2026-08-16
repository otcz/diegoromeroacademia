package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;

/**
 * Los datos que describen a un usuario, sin su identidad tecnica ni sus formas de entrar.
 *
 * <p>Nace de una senial del linter —{@link Usuario} pedia siete parametros— y resulto ser la
 * agrupacion correcta: estos campos son lo que cambia cuando una persona edita su cuenta,
 * mientras que el identificador, la fecha de alta y las identidades vinculadas los gobierna
 * el sistema. Separarlos hace que la firma diga cual de las dos cosas se esta tocando.
 *
 * @param correo la identidad real: el no negociable #1 resuelve por aqui
 * @param nombre nombre visible
 * @param rol que puede hacer
 * @param estado si puede entrar, y si alguien probo que el correo es suyo
 */
public record DatosUsuario(Correo correo, String nombre, Rol rol, EstadoCuenta estado) {

    public DatosUsuario {
        if (correo == null) {
            throw new DatoInvalidoExcepcion("correo", "El correo es obligatorio");
        }
        if (rol == null) {
            throw new DatoInvalidoExcepcion("rol", "El rol es obligatorio");
        }
        if (estado == null) {
            throw new DatoInvalidoExcepcion("estado", "El estado de la cuenta es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new DatoInvalidoExcepcion("nombre", "El nombre es obligatorio");
        }
        nombre = nombre.trim();
    }

    /** Atajo de lectura: lo consultan casi todos los casos de uso. */
    public boolean activo() {
        return estado.activa();
    }

    /** Copia con el correo ya probado por un proveedor o por un enlace de verificacion. */
    public DatosUsuario conCorreoVerificado() {
        return new DatosUsuario(correo, nombre, rol, estado.conCorreoVerificado());
    }
}
