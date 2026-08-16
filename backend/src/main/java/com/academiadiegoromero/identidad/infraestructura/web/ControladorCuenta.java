package com.academiadiegoromero.identidad.infraestructura.web;

import com.academiadiegoromero.identidad.aplicacion.casouso.EstablecerContrasena;
import com.academiadiegoromero.identidad.aplicacion.dto.SolicitudContrasena;
import com.academiadiegoromero.identidad.aplicacion.dto.UsuarioSesion;
import com.academiadiegoromero.identidad.dominio.excepcion.CredencialesInvalidasExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Contrasena;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lo que un alumno hace sobre SU cuenta, ya dentro.
 *
 * <p>Separado de {@code ControladorAcceso} por una senial del linter —veintiuna dependencias
 * en una sola clase— y la frontera resulto ser correcta: entrar y administrar la cuenta son
 * dos momentos distintos. El primero es publico y su enemigo es la enumeracion de cuentas; el
 * segundo exige sesion y su enemigo es tocar la cuenta de otro. Mezclarlos hace que las dos
 * politicas se lean en el mismo sitio y se confundan.
 */
@RestController
@RequestMapping("/api/acceso")
class ControladorCuenta {

    private static final Logger BITACORA = LoggerFactory.getLogger(ControladorCuenta.class);

    private final EstablecerContrasena establecer;
    private final RepositorioUsuario usuarios;

    ControladorCuenta(EstablecerContrasena establecer, RepositorioUsuario usuarios) {
        this.establecer = establecer;
        this.usuarios = usuarios;
    }

    /**
     * Quien tiene la sesion abierta, o 401 si no hay ninguna.
     *
     * <p>Hace falta porque el ingreso por Google termina en una REDIRECCION del navegador: la
     * aplicacion de Angular se recarga desde cero y no tiene forma de saber que alguien entro.
     * Sin este endpoint, el frontend solo conoce al usuario cuando el ingreso paso por su
     * propio formulario — y entonces cualquier pantalla que dependa de la sesion funciona por
     * un camino y no por el otro.
     *
     * <p>Devuelve la misma forma de usuario que el ingreso: un solo contrato.
     */
    @GetMapping("/sesion")
    ResponseEntity<UsuarioSesion> sesionActual(Authentication autenticacion) {
        return usuarioDeLaSesion(autenticacion)
                .map(usuario -> ResponseEntity.ok(UsuarioSesion.de(usuario)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    /**
     * Pone o cambia la contrasena de la cuenta que tiene la sesion abierta.
     *
     * <p>El usuario sale de la SESION, nunca de un identificador que venga en el cuerpo: si
     * viniera de fuera, cualquiera podria cambiar la contrasena de otro con solo saber su id.
     *
     * <p>El caso de uso exige ademas que el correo este verificado, que es lo que hace segura
     * la unificacion de cuentas del no negociable #1.
     */
    @PostMapping("/contrasena")
    ResponseEntity<Void> establecerContrasena(
            @Valid @RequestBody SolicitudContrasena solicitud, Authentication autenticacion) {

        Usuario usuario = usuarioDeLaSesion(autenticacion)
                .orElseThrow(CredencialesInvalidasExcepcion::new);

        establecer.ejecutar(usuario, new Contrasena(solicitud.contrasena()));

        // El identificador interno, nunca el correo (docs/06).
        BITACORA.info("Contrasena establecida para el usuario {}", usuario.id());
        return ResponseEntity.noContent().build();
    }

    private java.util.Optional<Usuario> usuarioDeLaSesion(Authentication autenticacion) {
        if (autenticacion == null || !autenticacion.isAuthenticated()) {
            return java.util.Optional.empty();
        }
        return usuarios.buscarPorId(UUID.fromString(autenticacion.getName()));
    }
}
