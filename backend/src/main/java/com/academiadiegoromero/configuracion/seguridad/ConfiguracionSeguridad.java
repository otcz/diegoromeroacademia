package com.academiadiegoromero.configuracion.seguridad;

import com.academiadiegoromero.identidad.infraestructura.web.ManejadorIngresoExitoso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Cadena de filtros SOLO para el tramo de ingreso con proveedor externo.
 *
 * <p><b>Por que hay dos cadenas y no una.</b> {@code SeguridadHttpConfiguracion} declara la
 * API como SIN ESTADO: sin sesion, sin CSRF, autenticada por token en la cabecera. Esa
 * decision es correcta para el resto de la API y no se toca.
 *
 * <p>Pero el baile de OAuth 2.0 no puede ser sin estado: el parametro {@code state} que
 * protege el intercambio del codigo se guarda entre la ida a Google y la vuelta, y sin sesion
 * no hay donde. Con {@code STATELESS} el ingreso falla siempre, y falla con un error del
 * proveedor que no explica nada.
 *
 * <p>La solucion no es relajar la API entera, sino acotar: esta cadena se aplica unicamente a
 * {@code /api/acceso/**} y va PRIMERA; todo lo demas sigue cayendo en la cadena sin estado.
 * Asi la excepcion vive donde se necesita y no se propaga al resto del sistema.
 *
 * <p><b>Las rutas de OAuth no son las de serie.</b> Spring publica
 * {@code /oauth2/authorization/{id}} y {@code /login/oauth2/code/{id}}, pero nginx solo enruta
 * al backend lo que empieza por {@code /api/}: con las rutas por defecto, Google devolveria el
 * codigo de autorizacion a la aplicacion de Angular, que no sabe que hacer con el, y el
 * ingreso fallaria en silencio. El URI registrado en la consola de Google debe coincidir
 * EXACTAMENTE con {@link #BASE_REDIRECCION}.
 */
@Configuration
class ConfiguracionSeguridad {

    /** Base desde la que arranca el flujo. El frontend enlaza aqui. */
    static final String BASE_AUTORIZACION = "/api/acceso/oauth2";

    /** A donde vuelve el proveedor con el codigo. Debe estar registrado en su consola. */
    static final String BASE_REDIRECCION = "/api/acceso/oauth2/callback/*";

    /**
     * Va antes que la cadena general para poder quedarse con su tramo.
     *
     * <p>El CORS se toma del bean que ya declara {@code SeguridadHttpConfiguracion}: hay una
     * sola lista blanca de origenes en todo el sistema, y duplicarla es como empiezan a
     * divergir.
     */
    @Bean
    @Order(1)
    SecurityFilterChain cadenaDeIngresoExterno(
            HttpSecurity http,
            ManejadorIngresoExitoso ingresoExitoso,
            ManejadorIngresoFallido ingresoFallido)
            throws Exception {

        return http
                .securityMatcher("/api/acceso/**")
                .cors(Customizer.withDefaults())

                // El proveedor devuelve al usuario por redireccion, sin nuestro token de
                // CSRF. Lo que protege este tramo es el `state` de OAuth, que Spring valida.
                .csrf(csrf -> csrf.disable())

                // IF_REQUIRED y no STATELESS: sin sesion no hay donde guardar el `state`.
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                .authorizeHttpRequests(rutas -> rutas.anyRequest().permitAll())

                .oauth2Login(o -> o
                        .authorizationEndpoint(e -> e.baseUri(BASE_AUTORIZACION))
                        .redirectionEndpoint(e -> e.baseUri(BASE_REDIRECCION))
                        .successHandler(ingresoExitoso)
                        .failureHandler(ingresoFallido))

                .logout(l -> l
                        .logoutUrl("/api/acceso/salir")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))

                .build();
    }
}
