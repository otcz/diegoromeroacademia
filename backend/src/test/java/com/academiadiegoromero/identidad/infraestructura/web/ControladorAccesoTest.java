package com.academiadiegoromero.identidad.infraestructura.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.aplicacion.casouso.EstablecerContrasena;
import com.academiadiegoromero.identidad.aplicacion.casouso.IniciarSesionConCorreo;
import com.academiadiegoromero.identidad.aplicacion.dto.RespuestaAcceso;
import com.academiadiegoromero.identidad.aplicacion.dto.SolicitudAcceso;
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
import com.academiadiegoromero.identidad.dominio.servicio.ControlDeIntentos;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
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
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

/**
 * La frontera HTTP del ingreso, probada SIN contexto de Spring.
 *
 * <p>Una rebanada web arrastraria media autoconfiguracion de seguridad —incluida la de OAuth2,
 * que exige credenciales de Google validas solo para levantarse— y tardaria segundos. Aqui se
 * instancia el controlador con dobles y se le llama: se comprueba lo que de verdad es suyo, en
 * milisegundos.
 *
 * <p>Que cada excepcion salga con su codigo estable lo garantiza el manejador global, que es
 * una sola clase con su propio sitio.
 */
class ControladorAccesoTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Correo CORREO = new Correo("alumno@ejemplo.com");
    private static final String CONTRASENA = "una-contrasena-larga";

    private RepositorioUsuarioFalso usuarios;
    private ControladorAcceso controlador;

    @BeforeEach
    void prepararControlador() {
        usuarios = new RepositorioUsuarioFalso();
        RepositorioCredencial credenciales = new RepositorioCredencialFalso();
        CifradorContrasena cifrador = new CifradorFalso();
        ControlDeIntentos intentos = new ControlDeIntentos(
                credenciales, Clock.fixed(AHORA, ZoneOffset.UTC), 5, Duration.ofMinutes(15));

        controlador = new ControladorAcceso(
                new IniciarSesionConCorreo(usuarios, credenciales, cifrador, intentos),
                new EstablecerContrasena(usuarios, credenciales, cifrador),
                usuarios,
                new AbridorDeSesion());

        Usuario usuario = usuarios.poner(usuario());
        credenciales.guardar(Credencial.establecer(usuario.id(), cifrador.cifrar(CONTRASENA)));
    }

    @Test
    @DisplayName("devuelve el usuario, con el rol en el formato que espera el frontend")
    void debeDevolverElUsuario() {
        ResponseEntity<RespuestaAcceso> respuesta = controlador.iniciarSesion(
                new SolicitudAcceso(CORREO.valor(), CONTRASENA),
                new MockHttpServletRequest(),
                new MockHttpServletResponse());

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(respuesta.getBody().usuario().correo()).isEqualTo(CORREO.valor());
        // En minusculas: asi lo declara el contrato de TypeScript.
        assertThat(respuesta.getBody().usuario().rol()).isEqualTo("alumno");
    }

    @Test
    @DisplayName("un correo con formato invalido NO se distingue de una credencial mala")
    void noDebeDelatarElFormatoDelCorreo() {
        // Responder distinto empezaria a describir que forma tiene un correo aceptado, que es
        // el primer paso para enumerar cuentas.
        assertThatThrownBy(() -> controlador.iniciarSesion(
                        new SolicitudAcceso("esto-no-es-un-correo", CONTRASENA),
                        new MockHttpServletRequest(),
                        new MockHttpServletResponse()))
                .isInstanceOf(CredencialesInvalidasExcepcion.class);
    }

    @Test
    @DisplayName("deja el token vacio mientras no exista, en vez de inventar uno")
    void debeDejarElTokenVacio() {
        RespuestaAcceso respuesta = controlador.iniciarSesion(
                        new SolicitudAcceso(CORREO.valor(), CONTRASENA),
                        new MockHttpServletRequest(),
                        new MockHttpServletResponse())
                .getBody();

        // La sesion viaja en cookie HttpOnly; el campo existe solo porque el contrato del
        // frontend lo declara. Si algun dia se rellena, esta prueba obliga a decidirlo.
        assertThat(respuesta.tokenAcceso()).isEmpty();
    }

    @Test
    @DisplayName("no revela la contrasena al imprimir la solicitud")
    void noDebeImprimirLaContrasena() {
        // Un volcado de excepcion o una bitacora descuidada no debe filtrarla.
        assertThat(new SolicitudAcceso(CORREO.valor(), CONTRASENA).toString())
                .doesNotContain(CONTRASENA)
                .contains(CORREO.valor());
    }

    private Usuario usuario() {
        return Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(CORREO, "Alumno", Rol.ALUMNO, EstadoCuenta.verificada()),
                AHORA,
                List.of());
    }

    /** Cifrador de mentira: BCrypt real tarda cientos de milisegundos por diseno. */
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
