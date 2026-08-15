package com.academiadiegoromero.compartido.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@DisplayName("Correo")
class CorreoTest {

    @Test
    void debeNormalizarAMinusculasParaQueUnMismoCorreoResuelvaSiempreALaMismaCuenta() {
        // Dado
        var escritoConMayusculas = "Diego.Romero@Gmail.COM";

        // Cuando
        var correo = new Correo(escritoConMayusculas);

        // Entonces
        assertThat(correo.valor()).isEqualTo("diego.romero@gmail.com");
        assertThat(correo).isEqualTo(new Correo("diego.romero@gmail.com"));
    }

    @Test
    void debeQuitarLosEspaciosAlrededorDelCorreo() {
        assertThat(new Correo("   alumno@correo.com  ").valor()).isEqualTo("alumno@correo.com");
    }

    @Test
    void debeExponerElDominioDelCorreo() {
        assertThat(new Correo("alumno@academia.com").dominio()).isEqualTo("academia.com");
    }

    @Test
    void debeRechazarElCorreoNulo() {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Correo(null))
                .withMessageContaining("obligatorio");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    void debeRechazarElCorreoVacio(String vacio) {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Correo(vacio));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "sinarroba.com",
        "sin@dominio",
        "@sinusuario.com",
        "con espacio@correo.com",
        "doble@@correo.com"
    })
    void debeRechazarUnFormatoInvalido(String invalido) {
        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Correo(invalido))
                .withMessageContaining("formato");
    }

    @Test
    void debeRechazarUnCorreoDemasiadoLargo() {
        var demasiadoLargo = "a".repeat(250) + "@correo.com";

        assertThatExceptionOfType(DatoInvalidoExcepcion.class)
                .isThrownBy(() -> new Correo(demasiadoLargo))
                .withMessageContaining("longitud");
    }

    @Test
    void debeInformarElCampoYElCodigoParaQueElFrontPuedaReaccionar() {
        var excepcion = org.junit.jupiter.api.Assertions.assertThrows(
                DatoInvalidoExcepcion.class, () -> new Correo("invalido"));

        assertThat(excepcion.campo()).isEqualTo("correo");
        assertThat(excepcion.codigo()).isEqualTo("DATO_INVALIDO");
    }
}
