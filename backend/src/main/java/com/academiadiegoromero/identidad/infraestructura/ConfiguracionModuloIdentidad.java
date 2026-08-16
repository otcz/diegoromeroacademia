package com.academiadiegoromero.identidad.infraestructura;

import com.academiadiegoromero.configuracion.propiedades.SeguridadPropiedades;
import com.academiadiegoromero.identidad.aplicacion.casouso.EstablecerContrasena;
import com.academiadiegoromero.identidad.aplicacion.casouso.IngresarConProveedorExterno;
import com.academiadiegoromero.identidad.aplicacion.casouso.IniciarSesionConCorreo;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import com.academiadiegoromero.identidad.dominio.servicio.ControlDeIntentos;
import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cableado del modulo. Es lo unico que sabe a la vez de Spring y de los casos de uso.
 *
 * <p>Los casos de uso son clases planas, sin una sola anotacion: asi se instancian en una
 * prueba con repositorios en memoria y un reloj fijo, sin contexto de Spring. El precio de esa
 * independencia es declararlos aqui, y es un precio barato.
 */
@Configuration
class ConfiguracionModuloIdentidad {

    /**
     * El reloj se inyecta en vez de llamar a {@code Instant.now()} dentro del dominio.
     *
     * <p>Una fecha tomada del reloj del sistema hace que la prueba de «se bloqueo hace quince
     * minutos» sea imposible de escribir sin esperar quince minutos. Con un reloj inyectado, la
     * prueba fija el instante.
     */
    @Bean
    Clock relojDelSistema() {
        return Clock.systemUTC();
    }

    @Bean
    IngresarConProveedorExterno ingresarConProveedorExterno(
            RepositorioUsuario usuarios, RepositorioCredencial credenciales, Clock reloj) {
        return new IngresarConProveedorExterno(usuarios, credenciales, reloj);
    }

    /**
     * El limite de intentos y la duracion del bloqueo salen de configuracion, no del codigo.
     *
     * <p>Son valores de politica de seguridad: docs/06 fija cinco intentos hoy, pero si manana
     * la realidad pide otro numero, se cambia una variable de entorno y no se recompila.
     */
    @Bean
    ControlDeIntentos controlDeIntentos(
            RepositorioCredencial credenciales, Clock reloj, SeguridadPropiedades seguridad) {
        return new ControlDeIntentos(
                credenciales,
                reloj,
                seguridad.intentosLoginMaximos(),
                seguridad.bloqueoTrasIntentosFallidos());
    }

    @Bean
    IniciarSesionConCorreo iniciarSesionConCorreo(
            RepositorioUsuario usuarios,
            RepositorioCredencial credenciales,
            CifradorContrasena cifrador,
            ControlDeIntentos intentos) {
        return new IniciarSesionConCorreo(usuarios, credenciales, cifrador, intentos);
    }

    @Bean
    EstablecerContrasena establecerContrasena(
            RepositorioUsuario usuarios,
            RepositorioCredencial credenciales,
            CifradorContrasena cifrador) {
        return new EstablecerContrasena(usuarios, credenciales, cifrador);
    }
}
