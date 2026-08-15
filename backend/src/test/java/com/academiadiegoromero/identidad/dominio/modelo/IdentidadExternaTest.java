package com.academiadiegoromero.identidad.dominio.modelo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class IdentidadExternaTest {

    @Test
    @DisplayName("recorta el identificador que da el proveedor")
    void debeRecortarElSujeto() {
        IdentidadExterna identidad = new IdentidadExterna(ProveedorIdentidad.GOOGLE, "  sub-1  ");

        assertThat(identidad.sujeto()).isEqualTo("sub-1");
    }

    @Test
    @DisplayName("exige proveedor y sujeto")
    void debeExigirLosDosCampos() {
        assertThatThrownBy(() -> new IdentidadExterna(null, "sub-1"))
                .isInstanceOf(DatoInvalidoExcepcion.class);
        assertThatThrownBy(() -> new IdentidadExterna(ProveedorIdentidad.GOOGLE, "  "))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }

    @Test
    @DisplayName("rechaza un identificador desproporcionado")
    void debeRechazarSujetoDemasiadoLargo() {
        String largo = "x".repeat(256);

        assertThatThrownBy(() -> new IdentidadExterna(ProveedorIdentidad.GOOGLE, largo))
                .isInstanceOf(DatoInvalidoExcepcion.class);
    }
}
