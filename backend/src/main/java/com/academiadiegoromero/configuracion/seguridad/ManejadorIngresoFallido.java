package com.academiadiegoromero.configuracion.seguridad;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;
import com.academiadiegoromero.identidad.infraestructura.web.IdentidadPropiedades;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

/**
 * Que ve el visitante cuando el ingreso por un proveedor externo se rechaza.
 *
 * <p>Vuelve a la pantalla de acceso con un CODIGO de error en la URL, no con un mensaje. El
 * texto lo pone el frontend, que ya tiene su tabla de traducciones en
 * {@code autenticacion-servicio.ts}: asi el mensaje se puede reescribir sin tocar el backend
 * y no se filtra al navegador ningun detalle interno (docs/06 §6).
 *
 * <p>Sin este manejador, Spring redirige a {@code /login?error}, que en esta aplicacion es
 * una ruta inexistente: el alumno acabaria en la pantalla de pagina no encontrada despues de
 * haberse autenticado bien en Google.
 */
@Component
class ManejadorIngresoFallido implements AuthenticationFailureHandler {

    private static final Logger BITACORA = LoggerFactory.getLogger(ManejadorIngresoFallido.class);

    /** Cuando el fallo no es de negocio, el codigo es generico: no se detalla al cliente. */
    private static final String CODIGO_GENERICO = "INGRESO_FALLIDO";

    private final String destinoTrasFallar;

    ManejadorIngresoFallido(IdentidadPropiedades propiedades) {
        this.destinoTrasFallar = propiedades.destinoTrasFallar();
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest peticion, HttpServletResponse respuesta, AuthenticationException fallo)
            throws IOException {

        String codigo = codigoDe(fallo);

        // El detalle completo va a la bitacora del servidor, nunca a la URL del navegador.
        BITACORA.warn("Ingreso externo rechazado: {}", codigo, fallo);

        respuesta.sendRedirect(
                destinoTrasFallar + "?error=" + URLEncoder.encode(codigo, StandardCharsets.UTF_8));
    }

    /**
     * Extrae el codigo estable si el fallo nacio de una regla de negocio.
     *
     * <p>El caso de uso se ejecuta dentro del manejador de exito, asi que una
     * {@link DominioExcepcion} —correo sin verificar, cuenta desactivada— llega hasta aqui
     * envuelta por Spring. Recuperar su codigo es lo que permite que el frontend diga
     * exactamente que paso en vez de «algo salio mal».
     */
    private String codigoDe(Throwable fallo) {
        for (Throwable causa = fallo; causa != null; causa = causa.getCause()) {
            if (causa instanceof DominioExcepcion dominio) {
                return dominio.codigo();
            }
        }
        return CODIGO_GENERICO;
    }
}
