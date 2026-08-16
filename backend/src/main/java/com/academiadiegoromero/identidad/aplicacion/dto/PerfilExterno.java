package com.academiadiegoromero.identidad.aplicacion.dto;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;

/**
 * Lo que un proveedor externo cuenta sobre quien acaba de entrar.
 *
 * <p>Es la frontera entre el mundo de OAuth y el dominio: aqui llega ya traducido, sin
 * ningun tipo de Spring ni del proveedor, para que el caso de uso se pueda probar sin
 * levantar nada.
 *
 * @param proveedor por donde entro
 * @param sujeto identificador estable del proveedor (el {@code sub} de Google)
 * @param correo direccion que reporta el proveedor, ya normalizada
 * @param nombre nombre visible
 * @param correoVerificado si el proveedor AFIRMA haber verificado esa direccion
 */
public record PerfilExterno(
        ProveedorIdentidad proveedor,
        String sujeto,
        Correo correo,
        String nombre,
        boolean correoVerificado) {
}
