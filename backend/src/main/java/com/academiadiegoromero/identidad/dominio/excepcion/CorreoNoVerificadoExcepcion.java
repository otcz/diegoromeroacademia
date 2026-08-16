package com.academiadiegoromero.identidad.dominio.excepcion;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;

/**
 * La contrasena era correcta, pero nadie ha PROBADO que el correo sea de quien entra.
 *
 * <p>Se comprueba despues de la contrasena, no antes: revelarlo a quien no la sabe diria que
 * ese correo tiene cuenta.
 *
 * <p>Es lo que sostiene la unificacion del no negociable #1. Si una cuenta creada con
 * contrasena sin verificar pudiera usarse, cualquiera registraria el correo de otra persona y
 * se quedaria con su cuenta —y con sus compras— en cuanto esa persona entrara por Google.
 */
public class CorreoNoVerificadoExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    public CorreoNoVerificadoExcepcion() {
        super("CORREO_NO_VERIFICADO", "Falta confirmar que el correo es tuyo");
    }
}
