package com.academiadiegoromero.identidad.infraestructura.web;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.aplicacion.casouso.EstablecerContrasena;
import com.academiadiegoromero.identidad.aplicacion.casouso.IniciarSesionConCorreo;
import com.academiadiegoromero.identidad.aplicacion.dto.RespuestaAcceso;
import com.academiadiegoromero.identidad.aplicacion.dto.SolicitudAcceso;
import com.academiadiegoromero.identidad.aplicacion.dto.SolicitudContrasena;
import com.academiadiegoromero.identidad.aplicacion.dto.UsuarioSesion;
import com.academiadiegoromero.identidad.dominio.excepcion.CredencialesInvalidasExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Contrasena;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Ingreso con correo y contrasena (especificacion §6.1, pantalla 3).
 *
 * <p>Traduce HTTP a caso de uso y nada mas: no decide quien entra. La regla vive en
 * {@link IniciarSesionConCorreo}, con sus pruebas, y por eso este controlador cabe en una
 * pantalla.
 *
 * <p>La sesion se abre en el propio contenedor de servlets, con la misma cookie que usa el
 * ingreso por Google. Asi las dos formas de entrar dejan al alumno en el mismo estado y el
 * resto de la API no tiene que saber por donde llego.
 */
@RestController
@RequestMapping("/api/acceso")
class ControladorAcceso {

    private static final Logger BITACORA = LoggerFactory.getLogger(ControladorAcceso.class);

    private final IniciarSesionConCorreo iniciarSesion;
    private final EstablecerContrasena establecer;
    private final RepositorioUsuario usuarios;
    private final AbridorDeSesion abridor;

    ControladorAcceso(
            IniciarSesionConCorreo iniciarSesion,
            EstablecerContrasena establecer,
            RepositorioUsuario usuarios,
            AbridorDeSesion abridor) {
        this.iniciarSesion = iniciarSesion;
        this.establecer = establecer;
        this.usuarios = usuarios;
        this.abridor = abridor;
    }

    /**
     * Abre sesion con correo y contrasena.
     *
     * <p>Un correo con formato invalido se trata como credencial invalida y NO como error de
     * validacion: responder distinto diria que ese correo si tiene forma de existir, y con eso
     * se empieza a enumerar cuentas.
     */
    @PostMapping("/sesion")
    ResponseEntity<RespuestaAcceso> iniciarSesion(
            @Valid @RequestBody SolicitudAcceso solicitud,
            HttpServletRequest peticion,
            HttpServletResponse respuesta) {

        Correo correo = correoDe(solicitud.correo());
        Usuario usuario = iniciarSesion.ejecutar(correo, solicitud.contrasena());

        abridor.abrir(peticion, respuesta, usuario);

        // El identificador interno, nunca el correo: docs/06 prohibe datos personales en la
        // bitacora, y el UUID basta para seguir el rastro de un incidente.
        BITACORA.info("Ingreso resuelto por CORREO para el usuario {}", usuario.id());

        return ResponseEntity.ok(RespuestaAcceso.deSesion(UsuarioSesion.de(usuario)));
    }

    /**
     * Pone o cambia la contrasena de la cuenta que tiene la sesion abierta.
     *
     * <p>Exige sesion: no se puede poner contrasena a una cuenta ajena. Y el caso de uso
     * exige ademas que el correo este verificado, que es lo que hace segura la unificacion.
     *
     * <p>Hoy la via para llegar aqui es entrar con Google —que verifica el correo— y dejar
     * una contrasena para las siguientes veces. Es el respaldo que pide la especificacion
     * §5.1 sin necesidad todavia de un servicio de correo.
     */
    @PostMapping("/contrasena")
    ResponseEntity<Void> establecerContrasena(
            @Valid @RequestBody SolicitudContrasena solicitud, Authentication autenticacion) {

        Usuario usuario = usuarios
                .buscarPorId(UUID.fromString(autenticacion.getName()))
                .orElseThrow(CredencialesInvalidasExcepcion::new);

        establecer.ejecutar(usuario, new Contrasena(solicitud.contrasena()));

        BITACORA.info("Contrasena establecida para el usuario {}", usuario.id());
        return ResponseEntity.noContent().build();
    }

    private Correo correoDe(String valor) {
        try {
            return new Correo(valor);
        } catch (RuntimeException formatoInvalido) {
            throw new CredencialesInvalidasExcepcion();
        }
    }
}
