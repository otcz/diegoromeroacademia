package com.academiadiegoromero.configuracion.seguridad;

import com.academiadiegoromero.configuracion.propiedades.ApiPropiedades;
import com.academiadiegoromero.identidad.infraestructura.web.ManejadorIngresoExitoso;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Cadena de seguridad HTTP (docs/06 §2).
 *
 * <p><b>Las rutas de OAuth no son las de serie.</b> Spring publica por defecto
 * {@code /oauth2/authorization/{id}} y {@code /login/oauth2/code/{id}}, pero nginx solo
 * enruta al backend lo que empieza por {@code /api/}: todo lo demas devuelve el index del
 * frontend. Con las rutas por defecto, Google devolveria el codigo de autorizacion a la
 * aplicacion de Angular, que no sabe que hacer con el, y el ingreso fallaria en silencio.
 *
 * <p>Por eso ambas se mueven bajo {@code /api/acceso/oauth2/...}, que es ademas lo que ya
 * espera el frontend en {@code autenticacion-servicio.ts}. El URI de redireccion registrado
 * en Google debe coincidir EXACTAMENTE con el de aqui.
 */
@Configuration
class ConfiguracionSeguridad {

    /** Base desde la que arranca el flujo. El frontend enlaza aqui. */
    static final String BASE_AUTORIZACION = "/api/acceso/oauth2";

    /** A donde vuelve el proveedor con el codigo. Debe estar registrado en su consola. */
    static final String BASE_REDIRECCION = "/api/acceso/oauth2/callback/*";

    @Bean
    SecurityFilterChain cadena(
            HttpSecurity http,
            ManejadorIngresoExitoso ingresoExitoso,
            ManejadorIngresoFallido ingresoFallido,
            CorsConfigurationSource cors)
            throws Exception {

        return http
                .cors(c -> c.configurationSource(cors))

                // El flujo de OAuth llega por redireccion desde Google, sin nuestro token de
                // CSRF, asi que sus rutas quedan fuera. El resto de la API SI lo exige.
                .csrf(c -> c.ignoringRequestMatchers(BASE_AUTORIZACION + "/**"))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(ConfiguracionSeguridad::declararRutasPublicas)
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

    /**
     * Lo unico abierto sin sesion. Todo lo demas exige autenticacion por defecto.
     *
     * <p>La lista es corta a proposito: es mas seguro cerrar por omision y abrir a mano lo
     * imprescindible que al reves, porque un endpoint nuevo nace protegido.
     */
    private static void declararRutasPublicas(
            org.springframework.security.config.annotation.web.configurers
                            .AuthorizeHttpRequestsConfigurer<HttpSecurity>
                            .AuthorizationManagerRequestMatcherRegistry
                    rutas) {
        rutas.requestMatchers(BASE_AUTORIZACION + "/**").permitAll()
                // El sondeo de salud lo consulta Docker; no puede exigir sesion.
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/catalogo/**").permitAll()
                .anyRequest().authenticated();
    }

    /**
     * Origenes permitidos, desde configuracion y nunca con comodin.
     *
     * <p>`allowCredentials` va en true porque la sesion viaja en cookie, y el estandar prohibe
     * combinar eso con un origen `*`. Con la lista explicita queda bien cerrado.
     */
    @Bean
    CorsConfigurationSource fuenteCors(ApiPropiedades propiedades) {
        CorsConfiguration configuracion = new CorsConfiguration();
        configuracion.setAllowedOrigins(propiedades.origenesPermitidos());
        configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuracion.setAllowedHeaders(List.of("*"));
        configuracion.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource fuente = new UrlBasedCorsConfigurationSource();
        fuente.registerCorsConfiguration("/api/**", configuracion);
        return fuente;
    }
}
