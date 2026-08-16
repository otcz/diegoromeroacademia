package com.academiadiegoromero.identidad.aplicacion.casouso;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.excepcion.CorreoNoVerificadoExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Contrasena;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.EstadoCuenta;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Poner contrasena a una cuenta que ya existe.
 *
 * <p>La regla que importa aqui es la de arriba del todo: <b>solo sobre un correo verificado</b>.
 * Es lo que impide que registrar el correo de otra persona sirva para quedarse con su cuenta.
 */
class EstablecerContrasenaTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Correo CORREO = new Correo("alumno@ejemplo.com");
    private static final Contrasena CONTRASENA = new Contrasena("una-contrasena-larga");

    private static final CifradorContrasena CIFRADOR = new CifradorContrasena() {
        @Override
        public String cifrar(String enClaro) {
            return "cifrado:" + enClaro;
        }

        @Override
        public boolean coincide(String enClaro, String cifrada) {
            return cifrada.equals("cifrado:" + enClaro);
        }
    };

    private RepositorioUsuarioEnMemoria usuarios;
    private RepositorioCredencialEnMemoria credenciales;
    private EstablecerContrasena establecer;

    @BeforeEach
    void prepararCasoDeUso() {
        usuarios = new RepositorioUsuarioEnMemoria();
        credenciales = new RepositorioCredencialEnMemoria();
        establecer = new EstablecerContrasena(usuarios, credenciales, CIFRADOR);
    }

    @Test
    @DisplayName("guarda la contrasena cifrada, nunca en claro")
    void debeGuardarlaCifrada() {
        Usuario usuario = usuario(EstadoCuenta.verificada());

        establecer.ejecutar(usuario, CONTRASENA);

        String guardada = credenciales.buscarPorUsuario(usuario.id()).orElseThrow().cifrada();
        assertThat(guardada).isNotEqualTo(CONTRASENA.valor()).startsWith("cifrado:");
    }

    @Test
    @DisplayName("deja el correo como una forma mas de entrar")
    void debeVincularLaIdentidadPorCorreo() {
        Usuario usuario = usuario(EstadoCuenta.verificada());

        establecer.ejecutar(usuario, CONTRASENA);

        // `identidades()` responde a «por donde puede entrar esta persona», y es lo que
        // consulta la unificacion de cuentas.
        assertThat(usuario.identidadDe(ProveedorIdentidad.CORREO)).isPresent();
    }

    @Test
    @DisplayName("RECHAZA poner contrasena si nadie probo que el correo sea suyo")
    void debeExigirCorreoVerificado() {
        Usuario usuario = usuario(EstadoCuenta.sinVerificar());

        assertThatThrownBy(() -> establecer.ejecutar(usuario, CONTRASENA))
                .isInstanceOf(CorreoNoVerificadoExcepcion.class);

        assertThat(credenciales.tieneContrasena(usuario.id())).isFalse();
    }

    @Test
    @DisplayName("cambiarla dos veces no duplica la forma de entrar")
    void debeSerIdempotenteAlVincular() {
        Usuario usuario = usuario(EstadoCuenta.verificada());

        establecer.ejecutar(usuario, CONTRASENA);
        establecer.ejecutar(usuario, new Contrasena("otra-contrasena-larga"));

        assertThat(usuario.identidades()).hasSize(1);
    }

    @Test
    @DisplayName("una contrasena corta no llega siquiera al caso de uso")
    void debeRechazarContrasenaDebil() {
        // La politica vive en el objeto de valor: una contrasena invalida no existe.
        assertThatThrownBy(() -> new Contrasena("corta"))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }

    @Test
    @DisplayName("no revela la contrasena al imprimirla")
    void noDebeImprimirLaContrasena() {
        // Un registro de bitacora descuidado o un volcado de excepcion no debe filtrarla.
        assertThat(CONTRASENA.toString()).doesNotContain(CONTRASENA.valor());
    }

    private Usuario usuario(EstadoCuenta estado) {
        return usuarios.guardar(Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(CORREO, "Alumno", Rol.ALUMNO, estado),
                AHORA,
                List.of()));
    }
}
