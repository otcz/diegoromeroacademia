package com.academiadiegoromero.compartido.dominio.excepcion;

/**
 * Base de todas las excepciones de negocio (docs/01 §9).
 *
 * <p>Lleva un codigo estable ademas del mensaje: el mensaje se puede reescribir para que sea
 * mas claro al alumno, pero el codigo es lo que el frontend y los tests usan para reaccionar,
 * asi que no cambia.
 */
public abstract class DominioExcepcion extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final String codigo;

    protected DominioExcepcion(String codigo, String mensaje) {
        super(mensaje);
        this.codigo = codigo;
    }

    /** Identificador estable del error, apto para que el cliente reaccione a el. */
    public String codigo() {
        return codigo;
    }
}
