package com.academiadiegoromero.identidad.dominio.modelo;

/**
 * Que puede hacer un usuario. Especificacion §4.
 *
 * <p>El rol vive en el dominio y no en el token: quien decide si alguien puede revisar un
 * examen es el backend consultando esto, nunca una afirmacion que venga del navegador
 * (no negociable #4 y docs/06 §2).
 */
public enum Rol {

    /** Quien compra y estudia. Es el rol por defecto de todo registro. */
    ALUMNO,

    /**
     * Quien revisa examenes. La especificacion §4 lo define como «Diego u otros profesores»:
     * por eso es un rol y no una comprobacion contra una persona concreta.
     */
    INSTRUCTOR,

    /** Gestiona catalogo, precios e inventario. */
    ADMINISTRADOR
}
