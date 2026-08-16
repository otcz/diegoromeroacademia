package com.academiadiegoromero.identidad.aplicacion.casouso;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.excepcion.CorreoNoVerificadoExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CredencialesInvalidasExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CuentaBloqueadaExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import com.academiadiegoromero.identidad.dominio.servicio.ControlDeIntentos;
import java.util.Optional;

/**
 * Ingreso con correo y contrasena.
 *
 * <p><b>Todos los fallos devuelven el mismo error.</b> Correo inexistente, contrasena
 * equivocada o cuenta sin contrasena dan {@link CredencialesInvalidasExcepcion} con el mismo
 * codigo y el mismo mensaje. Distinguirlos convierte el formulario en un buscador de correos
 * registrados: quien prueba direcciones sabe cuales existen, y con eso arma una lista para
 * atacar o para vender. Es la enumeracion de cuentas que prohibe docs/06.
 *
 * <p>Las dos excepciones que SI se distinguen no filtran nada util: la cuenta bloqueada y el
 * correo sin verificar solo aparecen cuando la contrasena YA era correcta, asi que quien las
 * ve ya la sabia.
 */
public class IniciarSesionConCorreo {

    /**
     * Hash de descarte contra el que se compara cuando no hay contrasena guardada.
     *
     * <p>No protege nada: su unico trabajo es que comprobar un correo inexistente cueste el
     * mismo tiempo que comprobar uno real. Sin el, la respuesta inmediata delata que ese
     * correo no esta registrado — la enumeracion se colaria por el reloj en vez de por el
     * mensaje.
     */
    private static final String HASH_SENIUELO =
            "$2a$12$C6UzMDM.H6dfI/f/IKcEe.LRUkR1BvIBUf5LBQoFmpQZ0dCWNQ7wu";

    private final RepositorioUsuario usuarios;
    private final RepositorioCredencial credenciales;
    private final CifradorContrasena cifrador;
    private final ControlDeIntentos intentos;

    public IniciarSesionConCorreo(
            RepositorioUsuario usuarios,
            RepositorioCredencial credenciales,
            CifradorContrasena cifrador,
            ControlDeIntentos intentos) {
        this.usuarios = usuarios;
        this.credenciales = credenciales;
        this.cifrador = cifrador;
        this.intentos = intentos;
    }

    /**
     * Devuelve al usuario si la contrasena es correcta.
     *
     * @throws CredencialesInvalidasExcepcion si el correo o la contrasena no coinciden
     * @throws CuentaBloqueadaExcepcion tras demasiados intentos fallidos seguidos
     * @throws CorreoNoVerificadoExcepcion si nadie ha probado que el correo sea suyo
     */
    public Usuario ejecutar(Correo correo, String contrasena) {
        Optional<Usuario> encontrado = usuarios.buscarPorCorreo(correo);
        Optional<Credencial> credencial =
                encontrado.flatMap(u -> credenciales.buscarPorUsuario(u.id()));

        intentos.exigirNoBloqueada(credencial);

        if (!acierta(credencial, contrasena)) {
            intentos.anotarFallo(credencial);
            throw new CredencialesInvalidasExcepcion();
        }

        Usuario usuario = exigirQuePuedaEntrar(encontrado);
        intentos.anotarExito(credencial);
        return usuario;
    }

    /** Siempre calcula un hash, haya contrasena guardada o no: el reloj no debe delatar. */
    private boolean acierta(Optional<Credencial> credencial, String contrasena) {
        String contra = credencial.map(Credencial::cifrada).orElse(HASH_SENIUELO);
        boolean coincide = cifrador.coincide(contrasena, contra);
        return credencial.isPresent() && coincide;
    }

    /**
     * Comprobaciones que llegan DESPUES de acertar la contrasena.
     *
     * <p>Una cuenta dada de baja devuelve el error generico —su existencia no es asunto de
     * quien pregunta—, mientras que el correo sin verificar si se nombra: hace falta para que
     * el alumno sepa que tiene que confirmarlo.
     */
    private Usuario exigirQuePuedaEntrar(Optional<Usuario> encontrado) {
        Usuario usuario = encontrado.orElseThrow(CredencialesInvalidasExcepcion::new);
        if (!usuario.datos().activo()) {
            throw new CredencialesInvalidasExcepcion();
        }
        if (!usuario.datos().estado().correoVerificado()) {
            throw new CorreoNoVerificadoExcepcion();
        }
        return usuario;
    }
}
