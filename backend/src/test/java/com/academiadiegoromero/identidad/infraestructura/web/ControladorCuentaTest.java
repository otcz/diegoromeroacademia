package com.academiadiegoromero.identidad.infraestructura.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.aplicacion.casouso.EstablecerContrasena;
import com.academiadiegoromero.identidad.aplicacion.dto.SolicitudContrasena;
import com.academiadiegoromero.identidad.aplicacion.dto.UsuarioSesion;
import com.academiadiegoromero.identidad.dominio.excepcion.CredencialesInvalidasExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.EstadoCuenta;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

/**
 * Lo que un alumno hace sobre SU cuenta.
 *
 * <p>Aqui la pregunta no es «quien eres» sino «puedes tocar esta cuenta». Por eso lo que mas
 * se prueba es de donde sale el usuario: de la SESION y nunca del cuerpo de la peticion.
 */
class ControladorCuentaTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Correo CORREO = new Correo("alumno@ejemplo.com");

    private RepositorioUsuarioFalso usuarios;
    private RepositorioCredencialFalso credenciales;
    private ControladorCuenta controlador;

    @BeforeEach
    void prepararControlador() {
        usuarios = new RepositorioUsuarioFalso();
        credenciales = new RepositorioCredencialFalso();
        controlador = new ControladorCuenta(
                new EstablecerContrasena(usuarios, credenciales, new CifradorFalso()), usuarios);
    }

    @Test
    @DisplayName("devuelve 401 cuando no hay sesion, en vez de reventar")
    void debeDevolver401SinSesion() {
        assertThat(controlador.sesionActual(null).getStatusCode())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("devuelve quien tiene la sesion abierta")
    void debeDevolverElUsuarioDeLaSesion() {
        Usuario usuario = usuarios.poner(usuario(EstadoCuenta.verificada()));

        var respuesta = controlador.sesionActual(sesionDe(usuario));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(respuesta.getBody()).isEqualTo(UsuarioSesion.de(usuario));
    }

    @Test
    @DisplayName("guarda la contrasena del usuario de la SESION, no de uno que venga en el cuerpo")
    void debeGuardarLaContrasenaDelUsuarioDeLaSesion() {
        Usuario usuario = usuarios.poner(usuario(EstadoCuenta.verificada()));

        var respuesta = controlador.establecerContrasena(
                new SolicitudContrasena("una-contrasena-larga"), sesionDe(usuario));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(credenciales.buscarPorUsuario(usuario.id())).isPresent();
    }

    @Test
    @DisplayName("no deja poner contrasena sin sesion")
    void debeRechazarSinSesion() {
        // Si el usuario saliera del cuerpo de la peticion, cualquiera cambiaria la contrasena
        // de otro con solo saber su identificador.
        assertThatThrownBy(() -> controlador.establecerContrasena(
                        new SolicitudContrasena("una-contrasena-larga"), null))
                .isInstanceOf(CredencialesInvalidasExcepcion.class);
    }

    private Authentication sesionDe(Usuario usuario) {
        return new UsernamePasswordAuthenticationToken(usuario.id().toString(), null, List.of());
    }

    private Usuario usuario(EstadoCuenta estado) {
        return Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(CORREO, "Alumno", Rol.ALUMNO, estado),
                AHORA,
                List.of());
    }

    private static final class CifradorFalso implements CifradorContrasena {
        @Override
        public String cifrar(String enClaro) {
            return "cifrado:" + enClaro;
        }

        @Override
        public boolean coincide(String enClaro, String cifrada) {
            return cifrada.equals("cifrado:" + enClaro);
        }
    }

    private static final class RepositorioUsuarioFalso implements RepositorioUsuario {
        private final List<Usuario> guardados = new ArrayList<>();

        Usuario poner(Usuario usuario) {
            guardados.add(usuario);
            return usuario;
        }

        @Override
        public Optional<Usuario> buscarPorIdentidad(ProveedorIdentidad proveedor, String sujeto) {
            return Optional.empty();
        }

        @Override
        public Optional<Usuario> buscarPorCorreo(Correo correo) {
            return guardados.stream().filter(u -> u.datos().correo().equals(correo)).findFirst();
        }

        @Override
        public Optional<Usuario> buscarPorId(UUID id) {
            return guardados.stream().filter(u -> u.id().equals(id)).findFirst();
        }

        @Override
        public Usuario guardar(Usuario usuario) {
            return poner(usuario);
        }

        @Override
        public void vincularIdentidad(Usuario usuario, IdentidadExterna identidad) {
            // Nada que persistir en memoria.
        }
    }

    private static final class RepositorioCredencialFalso implements RepositorioCredencial {
        private final Map<UUID, Credencial> guardadas = new HashMap<>();

        @Override
        public Optional<Credencial> buscarPorUsuario(UUID usuarioId) {
            return Optional.ofNullable(guardadas.get(usuarioId));
        }

        @Override
        public Credencial guardar(Credencial credencial) {
            guardadas.put(credencial.usuarioId(), credencial);
            return credencial;
        }

        @Override
        public void borrarDe(UUID usuarioId) {
            guardadas.remove(usuarioId);
        }
    }
}
