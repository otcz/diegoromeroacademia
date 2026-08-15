package com.academiadiegoromero.compartido.dominio.excepcion;

/**
 * Un valor no cumple la invariante del objeto que lo recibe.
 *
 * <p>Se lanza desde los objetos de valor al construirse, para que un dato invalido no llegue
 * nunca a existir dentro del dominio.
 */
public class DatoInvalidoExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    private final String campo;

    public DatoInvalidoExcepcion(String campo, String mensaje) {
        super("DATO_INVALIDO", mensaje);
        this.campo = campo;
    }

    /** Nombre del campo que fallo, para que el frontend lo resalte en el formulario. */
    public String campo() {
        return campo;
    }
}
