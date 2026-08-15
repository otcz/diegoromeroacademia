package com.academiadiegoromero.configuracion.propiedades;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Limites de la API publica (docs/03 §3, docs/02 §8).
 *
 * <p>La paginacion es obligatoria en todo listado: no existe un listar-todo sin limite,
 * porque con 1000 alumnos concurrentes una sola consulta sin tope tumba el servicio.
 */
@Validated
@ConfigurationProperties(prefix = "academia.api")
public record ApiPropiedades(

        @Min(1) int tamanioPaginaPorDefecto,

        @Min(1) int tamanioPaginaMaximo,

        @Min(1) int limitePeticionesPorMinuto,

        /** Lista blanca de CORS. Nunca se usa comodin ni se refleja el Origin recibido. */
        @NotEmpty List<String> origenesPermitidos) {

    /**
     * Verifica coherencia entre los dos limites de paginacion.
     *
     * <p>Se valida en el constructor y no con una anotacion porque la regla cruza dos
     * campos: un defecto mayor que el maximo es una configuracion sin sentido que debe
     * impedir el arranque.
     */
    public ApiPropiedades {
        if (tamanioPaginaPorDefecto > tamanioPaginaMaximo) {
            throw new IllegalArgumentException(
                    "academia.api.tamanio-pagina-por-defecto no puede superar a tamanio-pagina-maximo");
        }
    }
}
