package com.academiadiegoromero.identidad.infraestructura.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.EstadoCuenta;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

/** Que el ingreso por correo deje al usuario en el mismo estado que el de Google. */
class AbridorDeSesionTest {

    private final AbridorDeSesion abridor = new AbridorDeSesion();

    @AfterEach
    void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("deja al usuario autenticado con su rol")
    void debeAutenticarConSuRol() {
        MockHttpServletRequest peticion = new MockHttpServletRequest();

        abridor.abrir(peticion, new MockHttpServletResponse(), usuario(Rol.INSTRUCTOR));

        var autenticacion = SecurityContextHolder.getContext().getAuthentication();
        assertThat(autenticacion.isAuthenticated()).isTrue();
        assertThat(autenticacion.getAuthorities())
                .extracting(Object::toString)
                .containsExactly("ROLE_INSTRUCTOR");
    }

    @Test
    @DisplayName("RENUEVA la sesion al entrar, contra la fijacion de sesion")
    void debeRenovarLaSesion() {
        MockHttpServletRequest peticion = new MockHttpServletRequest();
        String antes = peticion.getSession(true).getId();

        abridor.abrir(peticion, new MockHttpServletResponse(), usuario(Rol.ALUMNO));

        // Si el identificador no cambiara, quien lograra imponerselo a la victima ANTES del
        // ingreso quedaria dentro de su sesion despues.
        assertThat(peticion.getSession(false).getId()).isNotEqualTo(antes);
    }

    private Usuario usuario(Rol rol) {
        return Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(
                        new Correo("alumno@ejemplo.com"), "Alumno", rol, EstadoCuenta.verificada()),
                Instant.parse("2026-08-15T12:00:00Z"),
                List.of());
    }
}
