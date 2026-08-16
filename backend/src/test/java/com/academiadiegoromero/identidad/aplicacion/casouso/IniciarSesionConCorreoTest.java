package com.academiadiegoromero.identidad.aplicacion.casouso;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.excepcion.CorreoNoVerificadoExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CredencialesInvalidasExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CuentaBloqueadaExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.EstadoCuenta;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import com.academiadiegoromero.identidad.dominio.servicio.ControlDeIntentos;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Ingreso con correo y contrasena.
 *
 * <p>Lo que mas se prueba aqui no es el camino feliz: es que los fallos NO cuenten de mas.
 * Un formulario de acceso que distingue «ese correo no existe» de «esa contrasena esta mal»
 * es un buscador de cuentas registradas.
 */
class IniciarSesionConCorreoTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Correo CORREO = new Correo("alumno@ejemplo.com");
    private static final String BUENA = "contrasena-larga-y-buena";
    private static final String MALA = "otra-cosa-cualquiera";
    private static final int INTENTOS = 5;
    private static final Duration BLOQUEO = Duration.ofMinutes(15);

    private RepositorioUsuarioEnMemoria usuarios;
    private RepositorioCredencialEnMemoria credenciales;
    private IniciarSesionConCorreo iniciar;

    /** Cifrador de mentira: BCrypt real tarda cientos de ms por diseno y aqui no aporta nada. */
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

    @BeforeEach
    void prepararCasoDeUso() {
        usuarios = new RepositorioUsuarioEnMemoria();
        credenciales = new RepositorioCredencialEnMemoria();
        iniciar = new IniciarSesionConCorreo(usuarios, credenciales, CIFRADOR, control(AHORA));
    }

    @Test
    @DisplayName("deja entrar con la contrasena correcta")
    void debeDejarEntrar() {
        Usuario usuario = darDeAlta(EstadoCuenta.verificada());

        assertThat(iniciar.ejecutar(CORREO, BUENA).id()).isEqualTo(usuario.id());
    }

    @Test
    @DisplayName("da el MISMO error si el correo no existe que si la contrasena esta mal")
    void noDebePermitirEnumerarCuentas() {
        darDeAlta(EstadoCuenta.verificada());

        // Si estos dos errores fueran distinguibles, probar direcciones revelaria cuales
        // tienen cuenta — una lista para atacar o para vender.
        assertThatThrownBy(() -> iniciar.ejecutar(new Correo("nadie@ejemplo.com"), BUENA))
                .isInstanceOf(CredencialesInvalidasExcepcion.class);
        assertThatThrownBy(() -> iniciar.ejecutar(CORREO, MALA))
                .isInstanceOf(CredencialesInvalidasExcepcion.class);
    }

    @Test
    @DisplayName("bloquea la cuenta tras cinco intentos fallidos seguidos")
    void debeBloquearTrasCincoFallos() {
        darDeAlta(EstadoCuenta.verificada());

        for (int intento = 0; intento < INTENTOS; intento++) {
            assertThatThrownBy(() -> iniciar.ejecutar(CORREO, MALA))
                    .isInstanceOf(CredencialesInvalidasExcepcion.class);
        }

        // A partir de aqui ni siquiera la contrasena correcta entra: es el freno de fuerza
        // bruta que exige la especificacion §5.3.
        assertThatThrownBy(() -> iniciar.ejecutar(CORREO, BUENA))
                .isInstanceOf(CuentaBloqueadaExcepcion.class);
    }

    @Test
    @DisplayName("el bloqueo caduca solo, para no dejar al alumno fuera para siempre")
    void debeCaducarElBloqueo() {
        darDeAlta(EstadoCuenta.verificada());
        for (int intento = 0; intento < INTENTOS; intento++) {
            assertThatThrownBy(() -> iniciar.ejecutar(CORREO, MALA)).isInstanceOf(RuntimeException.class);
        }

        IniciarSesionConCorreo despues = new IniciarSesionConCorreo(
                usuarios, credenciales, CIFRADOR, control(AHORA.plus(BLOQUEO).plusSeconds(1)));

        assertThat(despues.ejecutar(CORREO, BUENA).datos().correo()).isEqualTo(CORREO);
    }

    @Test
    @DisplayName("un ingreso correcto borra el historial de fallos")
    void debeOlvidarLosFallosAlAcertar() {
        darDeAlta(EstadoCuenta.verificada());
        assertThatThrownBy(() -> iniciar.ejecutar(CORREO, MALA)).isInstanceOf(RuntimeException.class);

        iniciar.ejecutar(CORREO, BUENA);

        assertThat(credenciales.buscarPorUsuario(usuarios.unico().id()).orElseThrow().fallosSeguidos())
                .isZero();
    }

    @Test
    @DisplayName("NO deja entrar si nadie probo que el correo sea suyo")
    void debeExigirCorreoVerificado() {
        darDeAlta(EstadoCuenta.sinVerificar());

        // Sin esta regla, registrar el correo de otra persona bastaria para quedarse con su
        // cuenta cuando esa persona entrara por Google.
        assertThatThrownBy(() -> iniciar.ejecutar(CORREO, BUENA))
                .isInstanceOf(CorreoNoVerificadoExcepcion.class);
    }

    @Test
    @DisplayName("una cuenta sin contrasena no entra, aunque exista")
    void debeRechazarCuentaSinCredencial() {
        usuarios.guardar(Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(CORREO, "Alumno", Rol.ALUMNO, EstadoCuenta.verificada()),
                AHORA,
                List.of()));

        assertThatThrownBy(() -> iniciar.ejecutar(CORREO, BUENA))
                .isInstanceOf(CredencialesInvalidasExcepcion.class);
    }

    /** El control de intentos con el reloj fijado en el instante que pide cada prueba. */
    private ControlDeIntentos control(Instant cuando) {
        return new ControlDeIntentos(
                credenciales, Clock.fixed(cuando, ZoneOffset.UTC), INTENTOS, BLOQUEO);
    }

    private Usuario darDeAlta(EstadoCuenta estado) {
        Usuario usuario = usuarios.guardar(Usuario.rehidratar(
                UUID.randomUUID(),
                new DatosUsuario(CORREO, "Alumno", Rol.ALUMNO, estado),
                AHORA,
                List.of()));
        credenciales.guardar(Credencial.establecer(usuario.id(), CIFRADOR.cifrar(BUENA)));
        return usuario;
    }
}
