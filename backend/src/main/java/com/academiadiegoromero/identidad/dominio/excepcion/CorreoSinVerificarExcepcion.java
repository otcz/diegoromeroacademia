package com.academiadiegoromero.identidad.dominio.excepcion;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;

/**
 * El proveedor externo entrego un correo que el mismo no ha verificado.
 *
 * <p><b>Por que esto detiene el ingreso.</b> La unificacion de cuentas del no negociable #1
 * confia en el correo: si alguien llega con el correo de otra persona, se le engancha a SU
 * cuenta y hereda sus compras. Google verifica siempre las direcciones {@code @gmail.com},
 * pero en cuentas de Workspace con dominio propio el campo {@code email_verified} puede
 * llegar en falso — y ahi la direccion es una afirmacion, no una prueba.
 *
 * <p>Vincular sobre una afirmacion sin verificar es una via directa de apropiacion de cuenta.
 * Preferimos rechazar el ingreso: es un caso rarisimo y la alternativa se paga con la cuenta
 * de un alumno que ya pago.
 */
public class CorreoSinVerificarExcepcion extends DominioExcepcion {

    private static final long serialVersionUID = 1L;

    public CorreoSinVerificarExcepcion(String proveedor) {
        super(
                "CORREO_SIN_VERIFICAR",
                "El proveedor %s no confirmo que el correo pertenezca a quien intenta entrar"
                        .formatted(proveedor));
    }
}
