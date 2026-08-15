package com.academiadiegoromero.configuracion.propiedades;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Banderas de funcionalidad por fase (docs/03 §4).
 *
 * <p>Permiten integrar codigo de fases futuras a la rama principal sin publicarlo, que es
 * lo que evita las ramas de larga vida y sus fusiones dolorosas. Cuando una funcionalidad
 * se estabiliza, su bandera se borra: las banderas viejas son deuda tecnica.
 *
 * <p>La bandera se consulta en una sola capa (caso de uso o guarda de ruta), nunca
 * salpicada por todo el codigo.
 */
@ConfigurationProperties(prefix = "academia.funcionalidades")
public record FuncionalidadesPropiedades(

        boolean examenesHabilitados,

        boolean certificadosHabilitados,

        boolean simuladorHabilitado,

        boolean tiendaHabilitada,

        boolean loginFacebookHabilitado) {
}
