package com.academiadiegoromero.identidad.dominio.excepcion;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;

/**
 * Demasiados intentos fallidos seguidos. Freno temporal (especificacion §5.3, docs/06).
 *
 * <p>El bloqueo caduca solo: uno permanente convertiria cualquier ataque en una denegacion de
 * servicio contra el alumno, que es peor que el ataque que intenta frenar.
 */
public class CuentaBloqueadaExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    public CuentaBloqueadaExcepcion() {
        super("CUENTA_BLOQUEADA", "Cuenta bloqueada temporalmente por intentos fallidos");
    }
}
