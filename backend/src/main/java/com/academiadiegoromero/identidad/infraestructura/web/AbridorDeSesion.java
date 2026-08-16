package com.academiadiegoromero.identidad.infraestructura.web;

import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

/**
 * Deja al usuario dentro de una sesion, venga por donde venga.
 *
 * <p>Existe para que el ingreso por correo termine EXACTAMENTE igual que el de Google. Si
 * cada camino abriera la sesion a su manera, el resto de la API tendria que saber por donde
 * entro cada quien — y esa es la clase de diferencia que acaba dejando un hueco por el que
 * uno de los dos no aplica una comprobacion.
 *
 * <p><b>La sesion se renueva.</b> Se invalida la anterior antes de autenticar, para que el
 * identificador de sesion cambie al entrar. Sin eso queda la fijacion de sesion: quien logre
 * imponerle a la victima un identificador conocido antes del ingreso, se queda dentro de su
 * sesion despues.
 */
@Component
class AbridorDeSesion {

    private static final String PREFIJO_ROL = "ROLE_";

    private final SecurityContextRepository repositorio =
            new HttpSessionSecurityContextRepository();

    /** Autentica al usuario y persiste el contexto en la sesion HTTP. */
    void abrir(HttpServletRequest peticion, HttpServletResponse respuesta, Usuario usuario) {
        if (peticion.getSession(false) != null) {
            peticion.getSession(false).invalidate();
        }
        peticion.getSession(true);

        Authentication autenticacion = new UsernamePasswordAuthenticationToken(
                usuario.id().toString(),
                null,
                List.of(new SimpleGrantedAuthority(PREFIJO_ROL + usuario.datos().rol().name())));

        SecurityContext contexto = SecurityContextHolder.createEmptyContext();
        contexto.setAuthentication(autenticacion);
        SecurityContextHolder.setContext(contexto);
        repositorio.saveContext(contexto, peticion, respuesta);
    }
}
