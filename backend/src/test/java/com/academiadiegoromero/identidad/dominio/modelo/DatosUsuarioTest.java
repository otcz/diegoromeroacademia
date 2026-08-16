package com.academiadiegoromero.identidad.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** Un dato invalido no debe llegar a existir dentro del dominio. */
class DatosUsuarioTest {

    private static final Correo CORREO = new Correo("alumno@ejemplo.com");

    @Test
    @DisplayName("recorta los espacios del nombre")
    void debeRecortarElNombre() {
        DatosUsuario datos = new DatosUsuario(CORREO, "  Diego  ", Rol.ALUMNO, new EstadoCuenta(true, true));

        assertThat(datos.nombre()).isEqualTo("Diego");
    }

    @Test
    @DisplayName("exige correo, rol y nombre")
    void debeExigirLosCamposObligatorios() {
        assertThatThrownBy(() -> new DatosUsuario(null, "Diego", Rol.ALUMNO, new EstadoCuenta(true, true)))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> new DatosUsuario(CORREO, "Diego", null, new EstadoCuenta(true, true)))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> new DatosUsuario(CORREO, "   ", Rol.ALUMNO, new EstadoCuenta(true, true)))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }

    @Test
    @DisplayName("la copia con correo verificado conserva todo lo demas")
    void debeVerificarSinPerderNada() {
        DatosUsuario sinVerificar =
                new DatosUsuario(CORREO, "Diego", Rol.INSTRUCTOR, EstadoCuenta.sinVerificar());

        DatosUsuario verificado = sinVerificar.conCorreoVerificado();

        assertThat(verificado.estado().correoVerificado()).isTrue();
        assertThat(verificado.estado().activa()).isTrue();
        assertThat(verificado.correo()).isEqualTo(sinVerificar.correo());
        assertThat(verificado.rol()).isEqualTo(sinVerificar.rol());
    }
}
