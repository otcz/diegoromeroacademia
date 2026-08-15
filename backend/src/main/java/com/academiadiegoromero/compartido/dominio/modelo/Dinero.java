package com.academiadiegoromero.compartido.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

/**
 * Importe con moneda explicita.
 *
 * <p>Nunca se usa {@code double} para dinero: su representacion binaria no puede expresar
 * exactamente valores como 0,1, asi que los redondeos se acumulan y las sumas dejan de
 * cuadrar. Con suscripciones recurrentes ese error termina en una factura equivocada.
 *
 * <p>La moneda forma parte del tipo para que sumar pesos con dolares sea imposible por
 * construccion, no algo que haya que recordar revisar.
 */
public record Dinero(BigDecimal monto, String moneda) {

    private static final int ESCALA = 2;
    private static final int LONGITUD_CODIGO_MONEDA = 3;

    public Dinero {
        if (monto == null) {
            throw new DatoInvalidoExcepcion("monto", "El monto es obligatorio");
        }
        if (moneda == null || moneda.trim().length() != LONGITUD_CODIGO_MONEDA) {
            throw new DatoInvalidoExcepcion("moneda", "La moneda debe ser un codigo ISO de tres letras");
        }
        if (monto.signum() < 0) {
            throw new DatoInvalidoExcepcion("monto", "El monto no puede ser negativo");
        }

        monto = monto.setScale(ESCALA, RoundingMode.HALF_UP);
        moneda = moneda.trim().toUpperCase(Locale.ROOT);
    }

    /** Construye un importe desde texto, para leer valores de configuracion o de la base. */
    public static Dinero de(String monto, String moneda) {
        return new Dinero(new BigDecimal(monto), moneda);
    }

    /** Suma dos importes. Falla si no comparten moneda, en vez de producir un total falso. */
    public Dinero mas(Dinero otro) {
        validarMismaMoneda(otro);
        return new Dinero(monto.add(otro.monto), moneda);
    }

    /** Multiplica por una cantidad de unidades, como los items de un pedido. */
    public Dinero por(int cantidad) {
        if (cantidad < 0) {
            throw new DatoInvalidoExcepcion("cantidad", "La cantidad no puede ser negativa");
        }
        return new Dinero(monto.multiply(BigDecimal.valueOf(cantidad)), moneda);
    }

    /** Comparacion por valor, ignorando diferencias de escala de BigDecimal. */
    public boolean esMayorQue(Dinero otro) {
        validarMismaMoneda(otro);
        return monto.compareTo(otro.monto) > 0;
    }

    public boolean esCero() {
        return monto.signum() == 0;
    }

    private void validarMismaMoneda(Dinero otro) {
        if (otro == null || !moneda.equals(otro.moneda)) {
            throw new DatoInvalidoExcepcion("moneda", "No se pueden operar importes de monedas distintas");
        }
    }
}
