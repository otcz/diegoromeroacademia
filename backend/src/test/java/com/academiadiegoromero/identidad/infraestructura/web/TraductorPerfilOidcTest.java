package com.academiadiegoromero.identidad.infraestructura.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.identidad.aplicacion.dto.PerfilExterno;
import com.academiadiegoromero.identidad.dominio.excepcion.PerfilExternoIncompletoExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

/**
 * La aduana entre OAuth y el dominio.
 *
 * <p>Nada de lo que llega del proveedor se da por bueno: es un tercero, y un nulo suyo no
 * puede viajar tres capas para reventar donde ya nadie sepa de donde vino.
 */
class TraductorPerfilOidcTest {

    private final TraductorPerfilOidc traductor = new TraductorPerfilOidc();

    @Test
    @DisplayName("traduce lo que devuelve Google a un perfil del dominio")
    void debeTraducirUnPerfilCompleto() {
        PerfilExterno perfil = traductor.traducir("google", usuarioCon(Map.of(
                "sub", "117...",
                "email", "Alumno@Ejemplo.COM",
                "email_verified", true,
                "name", "Diego Romero")));

        assertThat(perfil.proveedor()).isEqualTo(ProveedorIdentidad.GOOGLE);
        assertThat(perfil.sujeto()).isEqualTo("117...");
        // Normalizado por el objeto de valor Correo: de esto depende el no negociable #1.
        assertThat(perfil.correo().valor()).isEqualTo("alumno@ejemplo.com");
        assertThat(perfil.nombre()).isEqualTo("Diego Romero");
        assertThat(perfil.correoVerificado()).isTrue();
    }

    @Test
    @DisplayName("sin nombre usa la parte local del correo, en vez de rechazar el ingreso")
    void debeDeducirElNombreDelCorreo() {
        PerfilExterno perfil = traductor.traducir("google", usuarioCon(Map.of(
                "sub", "117...", "email", "alumno@ejemplo.com", "email_verified", true)));

        assertThat(perfil.nombre()).isEqualTo("alumno");
    }

    @Test
    @DisplayName("marca como NO verificado cuando el proveedor no lo afirma")
    void debeTratarLaAusenciaComoNoVerificado() {
        PerfilExterno perfil = traductor.traducir("google", usuarioCon(Map.of(
                "sub", "117...", "email", "alumno@ejemplo.com")));

        // La ausencia del campo NO es un si. Tratarla como verdadera abriria la via de
        // apropiacion de cuenta que el caso de uso corta.
        assertThat(perfil.correoVerificado()).isFalse();
    }

    @Test
    @DisplayName("corta si falta el identificador o el correo")
    void debeCortarSiFaltaUnDatoImprescindible() {
        assertThatThrownBy(() -> traductor.traducir(
                        "google", usuarioCon(Map.of("email", "alumno@ejemplo.com"))))
                .isInstanceOf(PerfilExternoIncompletoExcepcion.class);

        assertThatThrownBy(() -> traductor.traducir("google", usuarioCon(Map.of("sub", "117..."))))
                .isInstanceOf(PerfilExternoIncompletoExcepcion.class);
    }

    @Test
    @DisplayName("corta si el proveedor no es uno de los que conocemos")
    void debeCortarConProveedorDesconocido() {
        assertThatThrownBy(() -> traductor.traducir("apple", usuarioCon(Map.of(
                        "sub", "117...", "email", "alumno@ejemplo.com"))))
                .isInstanceOf(PerfilExternoIncompletoExcepcion.class);
    }

    private OAuth2User usuarioCon(Map<String, Object> atributos) {
        Map<String, Object> conClave = new HashMap<>(atributos);
        // DefaultOAuth2User exige que el atributo del nombre exista; se usa el que haya.
        String clave = conClave.containsKey("sub") ? "sub" : "email";
        conClave.putIfAbsent(clave, "desconocido");
        return new DefaultOAuth2User(
                AuthorityUtils.createAuthorityList(List.of("ROLE_USER").toArray(String[]::new)),
                conClave,
                clave);
    }
}
