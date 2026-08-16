package com.academiadiegoromero.configuracion.seguridad;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Que responde la API cuando falta sesion: 401, no una redireccion.
 *
 * <p>Con `oauth2Login` configurado, Spring toma como punto de entrada por defecto el envio a
 * Google. Para una pagina eso esta bien; para una llamada de la aplicacion es un desastre: el
 * navegador intenta seguir la redireccion hacia otro origen, falla por CORS, y lo que ve el
 * alumno es un error de red sin explicacion en vez de «tu sesion caduco».
 *
 * <p>Se midio: `POST /api/acceso/contrasena` sin sesion devolvia 302 hacia accounts.google.com.
 *
 * <p>El cuerpo va vacio a proposito. Un 401 ya lo dice todo, y cualquier detalle adicional
 * solo puede filtrar informacion sobre por que se rechazo.
 */
@Component
class RespuestaSinSesion implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest peticion,
            HttpServletResponse respuesta,
            AuthenticationException fallo)
            throws IOException {
        respuesta.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
