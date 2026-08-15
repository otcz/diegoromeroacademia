package com.academiadiegoromero.compartido.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import java.math.BigDecimal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@DisplayName("Dinero")
class DineroTest {

    private static final String COP = "COP";

    @Test
    void debeRedondearSiempreADosDecimales() {
        assertThat(Dinero.de("39900.005", COP).monto()).isEqualByComparingTo("39900.01");
        assertThat(Dinero.de("39900", COP).monto()).isEqualByComparingTo("39900.00");
    }

    @Test
    void debeConsiderarIgualesDosImportesConDistintaEscalaDeEntrada() {
        assertThat(Dinero.de("34900", COP)).isEqualTo(Dinero.de("34900.00", COP));
    }

    @Test
    void debeNormalizarLaMonedaAMayusculas() {
        assertThat(Dinero.de("1000", "cop").moneda()).isEqualTo(COP);
    }

    @Test
    void debeRechazarElMontoNulo() {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Dinero(null, COP))
                .withMessageContaining("obligatorio");
    }

    @Test
    void debeRechazarElMontoNegativo() {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> Dinero.de("-1", COP))
                .withMessageContaining("negativo");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "CO", "PESOS"})
    void debeRechazarUnCodigoDeMonedaInvalido(String moneda) {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> Dinero.de("1000", moneda))
                .withMessageContaining("ISO");
    }

    @Test
    void debeRechazarLaMonedaNula() {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Dinero(BigDecimal.TEN, null));
    }

    @Test
    void debeSumarImportesDeLaMismaMoneda() {
        var total = Dinero.de("39900", COP).mas(Dinero.de("34900", COP));

        assertThat(total.monto()).isEqualByComparingTo("74800.00");
        assertThat(total.moneda()).isEqualTo(COP);
    }

    @Test
    void debeRechazarLaSumaDeMonedasDistintasEnVezDeProducirUnTotalFalso() {
        var enPesos = Dinero.de("39900", COP);
        var enDolares = Dinero.de("10", "USD");

        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> enPesos.mas(enDolares))
                .withMessageContaining("monedas distintas");
    }

    @Test
    void debeRechazarOperarConUnImporteNulo() {
        var enPesos = Dinero.de("39900", COP);

        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> enPesos.mas(null));
    }

    @Test
    void debeMultiplicarPorLaCantidadDeUnidadesDelPedido() {
        assertThat(Dinero.de("34900", COP).por(3).monto()).isEqualByComparingTo("104700.00");
        assertThat(Dinero.de("34900", COP).por(0).esCero()).isTrue();
    }

    @Test
    void debeRechazarUnaCantidadNegativa() {
        var precio = Dinero.de("34900", COP);

        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> precio.por(-1))
                .withMessageContaining("negativa");
    }

    @Test
    void debeCompararImportesPorValorIgnorandoLaEscala() {
        assertThat(Dinero.de("39900", COP).esMayorQue(Dinero.de("34900.00", COP))).isTrue();
        assertThat(Dinero.de("34900", COP).esMayorQue(Dinero.de("39900", COP))).isFalse();
        assertThat(Dinero.de("34900", COP).esMayorQue(Dinero.de("34900.00", COP))).isFalse();
    }

    @Test
    void debeReconocerElImporteCero() {
        assertThat(Dinero.de("0", COP).esCero()).isTrue();
        assertThat(Dinero.de("0.01", COP).esCero()).isFalse();
    }
}
