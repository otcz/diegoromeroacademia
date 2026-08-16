package com.academiadiegoromero.identidad.dominio.excepcion;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;

/**
 * El proveedor externo no entrego un dato imprescindible para identificar a la persona.
 *
 * <p>Se lanza en la aduana, antes de que un nulo entre al dominio. Sin esto, un correo
 * ausente viajaria tres capas y reventaria donde ya nadie sabria que vino de Google.
 */
public class PerfilExternoIncompletoExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    public PerfilExternoIncompletoExcepcion(String campo) {
        super(
                "PERFIL_EXTERNO_INCOMPLETO",
                "El proveedor no entrego el dato obligatorio: %s".formatted(campo));
    }
}
