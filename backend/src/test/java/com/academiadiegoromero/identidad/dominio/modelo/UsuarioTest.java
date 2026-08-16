package com.academiadiegoromero.identidad.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

/** Invariantes del agregado de identidad. Sin Spring: son reglas, no cableado. */
class UsuarioTest {

    private static final Instant AHORA = Instant.parse("2026-08-15T12:00:00Z");
    private static final Correo CORREO = new Correo("alumno@ejemplo.com");
    private static final IdentidadExterna GOOGLE =
            new IdentidadExterna(ProveedorIdentidad.GOOGLE, "sub-1");

    @Nested
    @DisplayName("Al registrarse desde un proveedor")
    class AlRegistrarse {

        @Test
        @DisplayName("nace como alumno activo, con su identidad ya vinculada")
        void debeNacerComoAlumnoActivo() {
            Usuario usuario = Usuario.registrarDesdeProveedor(CORREO, "Alumno", GOOGLE, AHORA);

            assertThat(usuario.id()).isNotNull();
            assertThat(usuario.datos().rol()).isEqualTo(Rol.ALUMNO);
            assertThat(usuario.datos().activo()).isTrue();
            assertThat(usuario.registradoEn()).isEqualTo(AHORA);
            assertThat(usuario.identidadDe(ProveedorIdentidad.GOOGLE)).contains(GOOGLE);
        }

        @Test
        @DisplayName("exige una identidad: sin ella no habria forma de reconocer a quien vuelve")
        void debeExigirIdentidad() {
            assertThatThrownBy(
                            () -> Usuario.registrarDesdeProveedor(CORREO, "Alumno", null, AHORA))
                    .isInstanceOf(DatoInvalidoExcepcion.class);
        }

        @Test
        @DisplayName("exige nombre")
        void debeExigirNombre() {
            assertThatThrownBy(() -> Usuario.registrarDesdeProveedor(CORREO, "  ", GOOGLE, AHORA))
                    .isInstanceOf(DatoInvalidoExcepcion.class);
        }
    }

    @Nested
    @DisplayName("Al vincular una forma de entrar")
    class AlVincular {

        @Test
        @DisplayName("acumula proveedores distintos sobre la MISMA cuenta")
        void debeAcumularProveedoresDistintos() {
            Usuario usuario = Usuario.registrarDesdeProveedor(CORREO, "Alumno", GOOGLE, AHORA);

            usuario.vincular(new IdentidadExterna(ProveedorIdentidad.CORREO, "sub-correo"));

            assertThat(usuario.identidades()).hasSize(2);
        }

        @Test
        @DisplayName("es idempotente: repetir el mismo proveedor no acumula")
        void debeSerIdempotente() {
            Usuario usuario = Usuario.registrarDesdeProveedor(CORREO, "Alumno", GOOGLE, AHORA);

            usuario.vincular(new IdentidadExterna(ProveedorIdentidad.GOOGLE, "sub-distinto"));

            assertThat(usuario.identidades()).hasSize(1);
            assertThat(usuario.identidadDe(ProveedorIdentidad.GOOGLE)).contains(GOOGLE);
        }

        @Test
        @DisplayName("rechaza una identidad nula")
        void debeRechazarNula() {
            Usuario usuario = Usuario.registrarDesdeProveedor(CORREO, "Alumno", GOOGLE, AHORA);

            assertThatThrownBy(() -> usuario.vincular(null))
                    .isInstanceOf(DatoInvalidoExcepcion.class);
        }
    }

    @Test
    @DisplayName("no deja modificar sus identidades desde fuera")
    void debeProtegerSusIdentidades() {
        Usuario usuario = Usuario.registrarDesdeProveedor(CORREO, "Alumno", GOOGLE, AHORA);

        // Si esta lista fuera modificable, cualquiera podria saltarse la regla de idempotencia
        // de `vincular` y dejar el agregado en un estado que la base rechaza.
        assertThatThrownBy(() -> usuario.identidades().add(GOOGLE))
                .isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    @DisplayName("se rehidrata tal cual se guardo")
    void debeRehidratarse() {
        UUID id = UUID.randomUUID();
        DatosUsuario datos = new DatosUsuario(CORREO, "Alumno", Rol.INSTRUCTOR, EstadoCuenta.verificada());

        Usuario usuario = Usuario.rehidratar(id, datos, AHORA, List.of(GOOGLE));

        assertThat(usuario.id()).isEqualTo(id);
        assertThat(usuario.datos()).isEqualTo(datos);
        assertThat(usuario.identidades()).containsExactly(GOOGLE);
    }
}
