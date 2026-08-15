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
        DatosUsuario datos = new DatosUsuario(CORREO, "  Diego  ", Rol.ALUMNO, true);

        assertThat(datos.nombre()).isEqualTo("Diego");
    }

    @Test
    @DisplayName("exige correo, rol y nombre")
    void debeExigirLosCamposObligatorios() {
        assertThatThrownBy(() -> new DatosUsuario(null, "Diego", Rol.ALUMNO, true))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> new DatosUsuario(CORREO, "Diego", null, true))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> new DatosUsuario(CORREO, "   ", Rol.ALUMNO, true))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }

    @Test
    @DisplayName("la copia desactivada conserva todo lo demas")
    void debeDesactivarSinPerderNada() {
        DatosUsuario activo = new DatosUsuario(CORREO, "Diego", Rol.INSTRUCTOR, true);

        DatosUsuario baja = activo.desactivado();

        assertThat(baja.activo()).isFalse();
        assertThat(baja.correo()).isEqualTo(activo.correo());
        assertThat(baja.nombre()).isEqualTo(activo.nombre());
        assertThat(baja.rol()).isEqualTo(activo.rol());
    }
}
