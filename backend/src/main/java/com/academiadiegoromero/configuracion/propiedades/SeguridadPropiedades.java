package com.academiadiegoromero.configuracion.propiedades;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Limites de seguridad de sesion (docs/03 §3, docs/06 §1).
 *
 * <p>Se validan al arrancar. Un valor mal puesto debe tumbar el despliegue, no fallar a
 * mitad de la noche con un alumno bloqueado.
 */
@Validated
@ConfigurationProperties(prefix = "academia.seguridad")
public record SeguridadPropiedades(

        @NotNull Duration expiracionTokenAcceso,

        @NotNull Duration expiracionTokenRefresco,

        @NotNull Duration expiracionTokenRecuperacion,

        /** Frena el prestamo de credenciales. Especificacion §5.3 sugiere 2. */
        @Min(1) @Max(10) int dispositivosSimultaneosMaximos,

        @Min(1) int intentosLoginMaximos,

        @NotNull Duration bloqueoTrasIntentosFallidos) {
}
