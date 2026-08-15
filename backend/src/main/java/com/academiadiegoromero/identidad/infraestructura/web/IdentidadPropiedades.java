package com.academiadiegoromero.identidad.infraestructura.web;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Rutas del flujo de ingreso (docs/03 §3).
 *
 * <p>Se validan al arrancar: un destino vacio dejaria al alumno en una pagina en blanco
 * despues de autenticarse correctamente, que es el peor momento para fallar. Mejor que no
 * arranque el despliegue.
 *
 * @param destinoTrasIngresar a donde vuelve el navegador despues de que el proveedor confirme
 * @param destinoTrasFallar a donde vuelve si el ingreso se rechaza
 */
@Validated
@ConfigurationProperties(prefix = "academia.identidad")
public record IdentidadPropiedades(
        @NotBlank String destinoTrasIngresar, @NotBlank String destinoTrasFallar) {
}
