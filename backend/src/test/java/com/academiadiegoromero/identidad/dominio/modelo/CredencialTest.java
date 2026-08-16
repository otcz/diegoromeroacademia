package com.academiadiegoromero.identidad.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** El freno de fuerza bruta, probado sin reloj del sistema ni base de datos. */
class CredencialTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Duration BLOQUEO = Duration.ofMinutes(15);
    private static final int MAXIMO = 5;
    private static final UUID USUARIO = UUID.randomUUID();

    @Test
    @DisplayName("nace sin fallos y sin bloqueo")
    void debeNacerLimpia() {
        Credencial credencial = Credencial.establecer(USUARIO, "$2a$12$hash");

        assertThat(credencial.fallosSeguidos()).isZero();
        assertThat(credencial.estaBloqueada(AHORA)).isFalse();
    }

    @Test
    @DisplayName("exige usuario y hash")
    void debeExigirSusDatos() {
        assertThatThrownBy(() -> Credencial.establecer(null, "$2a$12$hash"))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> Credencial.establecer(USUARIO, "  "))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }

    @Test
    @DisplayName("bloquea justo al alcanzar el limite, ni antes ni despues")
    void debeBloquearEnElLimite() {
        Credencial credencial = Credencial.establecer(USUARIO, "$2a$12$hash");

        for (int fallo = 1; fallo < MAXIMO; fallo++) {
            credencial.registrarFallo(MAXIMO, BLOQUEO, AHORA);
            assertThat(credencial.estaBloqueada(AHORA)).isFalse();
        }

        credencial.registrarFallo(MAXIMO, BLOQUEO, AHORA);
        assertThat(credencial.estaBloqueada(AHORA)).isTrue();
    }

    @Test
    @DisplayName("el bloqueo caduca al pasar su duracion")
    void debeCaducarElBloqueo() {
        Credencial credencial = Credencial.establecer(USUARIO, "$2a$12$hash");
        for (int fallo = 0; fallo < MAXIMO; fallo++) {
            credencial.registrarFallo(MAXIMO, BLOQUEO, AHORA);
        }

        assertThat(credencial.estaBloqueada(AHORA.plus(BLOQUEO).minusSeconds(1))).isTrue();
        assertThat(credencial.estaBloqueada(AHORA.plus(BLOQUEO))).isFalse();
    }

    @Test
    @DisplayName("al bloquear reinicia el contador, para no volver a bloquear al primer fallo")
    void debeReiniciarElContadorAlBloquear() {
        Credencial credencial = Credencial.establecer(USUARIO, "$2a$12$hash");
        for (int fallo = 0; fallo < MAXIMO; fallo++) {
            credencial.registrarFallo(MAXIMO, BLOQUEO, AHORA);
        }

        // Sin este reinicio, en cuanto expira el freno el siguiente fallo volveria a bloquear
        // de inmediato y la cuenta quedaria practicamente inservible.
        assertThat(credencial.fallosSeguidos()).isZero();
    }

    @Test
    @DisplayName("un acierto borra fallos y bloqueo")
    void debeOlvidarAlAcertar() {
        Credencial credencial = Credencial.establecer(USUARIO, "$2a$12$hash");
        for (int fallo = 0; fallo < MAXIMO; fallo++) {
            credencial.registrarFallo(MAXIMO, BLOQUEO, AHORA);
        }

        credencial.registrarExito();

        assertThat(credencial.fallosSeguidos()).isZero();
        assertThat(credencial.bloqueadaHasta()).isNull();
        assertThat(credencial.estaBloqueada(AHORA)).isFalse();
    }

    @Test
    @DisplayName("se rehidrata con su contador y su bloqueo")
    void debeRehidratarse() {
        Instant hasta = AHORA.plus(BLOQUEO);

        Credencial credencial = Credencial.rehidratar(USUARIO, "$2a$12$hash", 3, hasta);

        assertThat(credencial.usuarioId()).isEqualTo(USUARIO);
        assertThat(credencial.fallosSeguidos()).isEqualTo(3);
        assertThat(credencial.bloqueadaHasta()).isEqualTo(hasta);
    }
}
