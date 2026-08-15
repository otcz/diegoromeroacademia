package com.academiadiegoromero.identidad.infraestructura;

import com.academiadiegoromero.identidad.aplicacion.casouso.IngresarConProveedorExterno;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cableado del modulo. Es lo unico que sabe a la vez de Spring y de los casos de uso.
 *
 * <p>Los casos de uso son clases planas, sin una sola anotacion: asi se instancian en una
 * prueba con un repositorio en memoria y un reloj fijo, sin contexto de Spring. El precio de
 * esa independencia es declararlos aqui, y es un precio barato.
 */
@Configuration
class ConfiguracionModuloIdentidad {

    /**
     * El reloj se inyecta en vez de llamar a {@code Instant.now()} dentro del dominio.
     *
     * <p>Una fecha tomada del reloj del sistema hace que la prueba de «se registro hoy» sea
     * imposible de escribir sin trampas. Con un reloj inyectado, la prueba fija el instante.
     */
    @Bean
    Clock relojDelSistema() {
        return Clock.systemUTC();
    }

    @Bean
    IngresarConProveedorExterno ingresarConProveedorExterno(
            RepositorioUsuario repositorio, Clock reloj) {
        return new IngresarConProveedorExterno(repositorio, reloj);
    }
}
