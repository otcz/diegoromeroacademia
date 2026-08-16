package com.academiadiegoromero.identidad.infraestructura.seguridad;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * El cifrado real. Es la unica prueba del modulo que usa BCrypt de verdad, y por eso tarda
 * unos cientos de milisegundos: esa lentitud es la caracteristica, no un defecto.
 */
class CifradorBcryptTest {

    private final CifradorBcrypt cifrador = new CifradorBcrypt();

    @Test
    @DisplayName("nunca devuelve la contrasena en claro")
    void noDebeGuardarTextoPlano() {
        String hash = cifrador.cifrar("una-contrasena-larga");

        assertThat(hash).doesNotContain("una-contrasena-larga");
    }

    @Test
    @DisplayName("usa factor 12, como exige docs/06")
    void debeUsarFactorDoce() {
        // El formato de BCrypt lleva el coste dentro: $2a$12$... Comprobarlo aqui evita que
        // alguien lo baje «para que las pruebas corran mas rapido» y nadie se entere.
        assertThat(cifrador.cifrar("una-contrasena-larga")).startsWith("$2a$12$");
    }

    @Test
    @DisplayName("dos cifrados de la misma contrasena son distintos, y los dos validan")
    void debeSalarCadaHash() {
        String primero = cifrador.cifrar("una-contrasena-larga");
        String segundo = cifrador.cifrar("una-contrasena-larga");

        // Sin sal, dos cuentas con la misma contrasena tendrian el mismo hash y una tabla
        // precalculada las abriria todas de golpe.
        assertThat(primero).isNotEqualTo(segundo);
        assertThat(cifrador.coincide("una-contrasena-larga", primero)).isTrue();
        assertThat(cifrador.coincide("una-contrasena-larga", segundo)).isTrue();
    }

    @Test
    @DisplayName("rechaza la contrasena equivocada")
    void debeRechazarLaEquivocada() {
        assertThat(cifrador.coincide("otra-cosa", cifrador.cifrar("una-contrasena-larga")))
                .isFalse();
    }
}
