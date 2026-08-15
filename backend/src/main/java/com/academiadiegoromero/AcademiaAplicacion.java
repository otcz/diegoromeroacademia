package com.academiadiegoromero;

import com.academiadiegoromero.configuracion.propiedades.ApiPropiedades;
import com.academiadiegoromero.configuracion.propiedades.FuncionalidadesPropiedades;
import com.academiadiegoromero.configuracion.propiedades.SeguridadPropiedades;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Punto de arranque de la plataforma.
 *
 * <p>Las propiedades se registran aqui de forma explicita en vez de por escaneo: la lista
 * hace visible de un vistazo todo lo que el sistema necesita para arrancar (regla 5).
 */
@SpringBootApplication
@EnableCaching
@EnableConfigurationProperties({
        ApiPropiedades.class,
        SeguridadPropiedades.class,
        FuncionalidadesPropiedades.class
})
public class AcademiaAplicacion {

    /** Arranca la aplicacion. Toda la configuracion llega por variables de entorno. */
    public static void main(String[] argumentos) {
        SpringApplication.run(AcademiaAplicacion.class, argumentos);
    }
}
