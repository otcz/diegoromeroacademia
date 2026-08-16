package com.academiadiegoromero.identidad.dominio.excepcion;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;

/**
 * La cuenta existe pero esta dada de baja.
 *
 * <p>Se comprueba ANTES de vincular una identidad nueva: si no, un ingreso por Google
 * reactivaria de hecho una cuenta suspendida sin pasar por ninguna decision.
 *
 * <p>El mensaje no dice por que esta desactivada. Distinguir «suspendida por impago» de
 * «cerrada a peticion» le daria a un tercero informacion sobre una cuenta que no es suya.
 */
public class CuentaDesactivadaExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    public CuentaDesactivadaExcepcion() {
        super("CUENTA_DESACTIVADA", "Esta cuenta no esta disponible. Escribe a soporte.");
    }
}
