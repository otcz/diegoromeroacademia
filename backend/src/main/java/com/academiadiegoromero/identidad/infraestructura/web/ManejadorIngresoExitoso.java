package com.academiadiegoromero.identidad.infraestructura.web;

import com.academiadiegoromero.identidad.aplicacion.casouso.IngresarConProveedorExterno;
import com.academiadiegoromero.identidad.aplicacion.dto.PerfilExterno;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * Lo que ocurre justo despues de que Google confirme quien es alguien.
 *
 * <p>Spring Security termina el baile de OAuth y entrega un {@code OAuth2User}; a partir de
 * ahi el framework no sabe nada del negocio. Esta clase es el enganche: traduce ese objeto a
 * un perfil del dominio, ejecuta el caso de uso que decide si crear, vincular o reconocer, y
 * manda al visitante de vuelta al frontend.
 *
 * <p><b>Deliberadamente delgada.</b> No decide nada: la regla de «un correo = una cuenta»
 * vive en {@link IngresarConProveedorExterno}, con sus propias pruebas. Si esa decision
 * viviera aqui habria que levantar todo el filtro de seguridad para probarla.
 */
@Component
public class ManejadorIngresoExitoso implements AuthenticationSuccessHandler {

    private static final Logger BITACORA = LoggerFactory.getLogger(ManejadorIngresoExitoso.class);

    private final IngresarConProveedorExterno ingresar;
    private final TraductorPerfilOidc traductor;
    private final String destinoTrasIngresar;

    public ManejadorIngresoExitoso(
            IngresarConProveedorExterno ingresar,
            TraductorPerfilOidc traductor,
            IdentidadPropiedades propiedades) {
        this.ingresar = ingresar;
        this.traductor = traductor;
        this.destinoTrasIngresar = propiedades.destinoTrasIngresar();
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest peticion, HttpServletResponse respuesta, Authentication autenticacion)
            throws IOException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) autenticacion;
        PerfilExterno perfil =
                traductor.traducir(token.getAuthorizedClientRegistrationId(), token.getPrincipal());

        Usuario usuario = ingresar.ejecutar(perfil);

        // Se registra el identificador interno, NUNCA el correo: docs/06 prohibe datos
        // personales en la bitacora, y el UUID basta para seguir el rastro de un incidente.
        BITACORA.info(
                "Ingreso resuelto por {} para el usuario {}", perfil.proveedor(), usuario.id());

        respuesta.sendRedirect(destinoTrasIngresar);
    }
}
