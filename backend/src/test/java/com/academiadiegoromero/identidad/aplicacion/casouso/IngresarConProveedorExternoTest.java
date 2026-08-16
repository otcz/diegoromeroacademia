package com.academiadiegoromero.identidad.aplicacion.casouso;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.aplicacion.dto.PerfilExterno;
import com.academiadiegoromero.identidad.dominio.excepcion.CorreoSinVerificarExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CuentaDesactivadaExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.EstadoCuenta;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Pruebas del no negociable #1: un correo resuelve siempre a la misma cuenta.
 *
 * <p>Corren sin Spring y sin base de datos, con un repositorio en memoria y un reloj fijo.
 * Es lo que permite que esta regla —la mas cara de romper de todo el negocio— tenga pruebas
 * que se ejecutan en milisegundos y que nadie tenga la tentacion de saltarse.
 */
class IngresarConProveedorExternoTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final String CORREO = "alumno@ejemplo.com";

    private RepositorioUsuarioEnMemoria repositorio;
    private RepositorioCredencialEnMemoria credenciales;
    private IngresarConProveedorExterno ingresar;

    @BeforeEach
    void prepararCasoDeUso() {
        repositorio = new RepositorioUsuarioEnMemoria();
        credenciales = new RepositorioCredencialEnMemoria();
        ingresar = new IngresarConProveedorExterno(
                repositorio, credenciales, Clock.fixed(AHORA, ZoneOffset.UTC));
    }

    @Test
    @DisplayName("da de alta a quien entra por primera vez")
    void debeRegistrarAlQueEntraPorPrimeraVez() {
        Usuario usuario = ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-google-1"));

        assertThat(repositorio.cuantos()).isEqualTo(1);
        assertThat(usuario.datos().correo().valor()).isEqualTo(CORREO);
        assertThat(usuario.datos().rol()).isEqualTo(Rol.ALUMNO);
        assertThat(usuario.datos().activo()).isTrue();
        assertThat(usuario.registradoEn()).isEqualTo(AHORA);
        assertThat(usuario.identidadDe(ProveedorIdentidad.GOOGLE)).isPresent();
    }

    @Test
    @DisplayName("NO crea una cuenta nueva cuando el mismo correo llega por otro proveedor")
    void debeVincularEnVezDeDuplicar() {
        // Se registro con correo y contrasena...
        Usuario original = ingresar.ejecutar(perfil(ProveedorIdentidad.CORREO, "sub-correo-1"));

        // ...y despues vuelve pulsando «Continuar con Google».
        Usuario alVolver = ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-google-1"));

        // ES la misma cuenta. Si fueran dos, el alumno veria su curso comprado desaparecer:
        // es el reclamo de soporte mas caro de una plataforma de suscripcion.
        assertThat(alVolver.id()).isEqualTo(original.id());
        assertThat(repositorio.cuantos()).isEqualTo(1);
        assertThat(alVolver.identidadDe(ProveedorIdentidad.CORREO)).isPresent();
        assertThat(alVolver.identidadDe(ProveedorIdentidad.GOOGLE)).isPresent();
    }

    @Test
    @DisplayName("reconoce a quien vuelve aunque haya cambiado de correo en el proveedor")
    void debeReconocerPorSujetoAunqueCambieElCorreo() {
        Usuario original = ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-google-1"));

        // Misma persona, mismo `sub` de Google, correo nuevo. Se busca primero por sujeto
        // justamente para esto: el sujeto es estable, el correo no.
        Usuario alVolver = ingresar.ejecutar(new PerfilExterno(
                ProveedorIdentidad.GOOGLE,
                "sub-google-1",
                new Correo("otro@ejemplo.com"),
                "Alumno",
                true));

        assertThat(alVolver.id()).isEqualTo(original.id());
        assertThat(repositorio.cuantos()).isEqualTo(1);
    }

    @Test
    @DisplayName("unifica aunque el proveedor escriba el correo en mayusculas")
    void debeUnificarIgnorandoMayusculas() {
        Usuario original = ingresar.ejecutar(perfil(ProveedorIdentidad.CORREO, "sub-correo-1"));

        Usuario alVolver = ingresar.ejecutar(new PerfilExterno(
                ProveedorIdentidad.GOOGLE,
                "sub-google-1",
                new Correo("ALUMNO@Ejemplo.COM"),
                "Alumno",
                true));

        assertThat(alVolver.id()).isEqualTo(original.id());
        assertThat(repositorio.cuantos()).isEqualTo(1);
    }

    @Test
    @DisplayName("repetir el ingreso no acumula identidades")
    void debeSerIdempotente() {
        ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-google-1"));
        Usuario segunda = ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-google-1"));

        assertThat(repositorio.cuantos()).isEqualTo(1);
        assertThat(segunda.identidades()).hasSize(1);
    }

    @Test
    @DisplayName("RECHAZA el ingreso si el proveedor no verifico el correo")
    void debeRechazarCorreoSinVerificar() {
        // Es la via de apropiacion de cuenta: si se aceptara, cualquiera con un correo ajeno
        // sin verificar quedaria enganchado a la cuenta de otra persona y heredaria sus compras.
        PerfilExterno sinVerificar = new PerfilExterno(
                ProveedorIdentidad.GOOGLE, "sub-google-1", new Correo(CORREO), "Alumno", false);

        assertThatThrownBy(() -> ingresar.ejecutar(sinVerificar))
                .isInstanceOf(CorreoSinVerificarExcepcion.class);

        assertThat(repositorio.cuantos()).isZero();
    }

    @Test
    @DisplayName("no reactiva de hecho una cuenta desactivada")
    void debeRechazarCuentaDesactivada() {
        repositorio.guardar(Usuario.rehidratar(
                java.util.UUID.randomUUID(),
                new DatosUsuario(new Correo(CORREO), "Alumno", Rol.ALUMNO, new EstadoCuenta(false, true)),
                AHORA,
                List.of()));

        assertThatThrownBy(() -> ingresar.ejecutar(perfil(ProveedorIdentidad.GOOGLE, "sub-1")))
                .isInstanceOf(CuentaDesactivadaExcepcion.class);
    }

    private PerfilExterno perfil(ProveedorIdentidad proveedor, String sujeto) {
        return new PerfilExterno(proveedor, sujeto, new Correo(CORREO), "Alumno", true);
    }

}
