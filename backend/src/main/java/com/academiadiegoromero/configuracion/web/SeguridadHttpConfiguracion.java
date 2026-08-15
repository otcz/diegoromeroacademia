package com.academiadiegoromero.configuracion.web;

import com.academiadiegoromero.configuracion.propiedades.ApiPropiedades;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Cabeceras de seguridad, CORS y politica de sesion (docs/06 §6).
 *
 * <p>Toda peticion se asume hostil: la autorizacion real vive aqui y en cada caso de uso,
 * nunca en el frontend. Las guardas de ruta de Angular son solo experiencia de usuario.
 */
@Configuration
@EnableWebSecurity
public class SeguridadHttpConfiguracion {

    private static final long HSTS_MAX_AGE_SEGUNDOS = 31_536_000L;

    private final ApiPropiedades apiPropiedades;

    public SeguridadHttpConfiguracion(ApiPropiedades apiPropiedades) {
        this.apiPropiedades = apiPropiedades;
    }

    /**
     * Cadena de filtros de la API.
     *
     * <p>CSRF va deshabilitado porque la API es sin estado y se autentica por token en la
     * cabecera, no por cookie de sesion: sin cookie no hay vector de falsificacion de
     * peticion entre sitios.
     */
    @Bean
    SecurityFilterChain cadenaDeFiltros(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(cabeceras -> cabeceras
                        .frameOptions(marco -> marco.deny())
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(HSTS_MAX_AGE_SEGUNDOS))
                        .referrerPolicy(politica -> politica.policy(
                                ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)))
                .authorizeHttpRequests(peticiones -> peticiones
                        .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/health/**").permitAll()
                        .anyRequest().authenticated());
        return http.build();
    }

    /**
     * Lista blanca de origenes para CORS.
     *
     * <p>Nunca se usa comodin ni se refleja el Origin recibido: eso permitiria a cualquier
     * sitio hacer peticiones autenticadas en nombre del alumno.
     */
    @Bean
    CorsConfigurationSource fuenteDeConfiguracionCors() {
        var configuracion = new CorsConfiguration();
        configuracion.setAllowedOrigins(apiPropiedades.origenesPermitidos());
        configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuracion.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuracion.setAllowCredentials(true);

        var fuente = new UrlBasedCorsConfigurationSource();
        fuente.registerCorsConfiguration("/**", configuracion);
        return fuente;
    }
}
