package com.academiadiegoromero.identidad.aplicacion.casouso;

import com.academiadiegoromero.identidad.dominio.excepcion.CorreoNoVerificadoExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Contrasena;
import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;

/**
 * Pone o cambia la contrasena de una cuenta que YA existe.
 *
 * <p><b>Solo sobre un correo verificado.</b> Es la condicion que hace segura la unificacion
 * del no negociable #1: si se pudiera poner contrasena a un correo sin probar que es tuyo,
 * bastaria registrar el correo de otro para quedarse con su cuenta el dia que entre por
 * Google.
 *
 * <p>Quien entro por un proveedor externo ya cumple: el proveedor verifico el correo. Por eso
 * este caso de uso resuelve hoy el respaldo que pide la especificacion §5.1 —«no todos tienen
 * Google»— sin necesidad de un servicio de correo: se entra una vez con Google y se deja una
 * contrasena para las siguientes.
 *
 * <p>CONDICION DE SALIDA: cuando exista el envio de correo, el registro desde cero usara este
 * mismo caso de uso despues de que el alumno pulse el enlace de verificacion.
 */
public class EstablecerContrasena {

    private final RepositorioUsuario usuarios;
    private final RepositorioCredencial credenciales;
    private final CifradorContrasena cifrador;

    public EstablecerContrasena(
            RepositorioUsuario usuarios,
            RepositorioCredencial credenciales,
            CifradorContrasena cifrador) {
        this.usuarios = usuarios;
        this.credenciales = credenciales;
        this.cifrador = cifrador;
    }

    /**
     * Guarda la contrasena cifrada y deja registrada la forma de entrar por correo.
     *
     * @throws CorreoNoVerificadoExcepcion si nadie ha probado que el correo sea suyo
     */
    public void ejecutar(Usuario usuario, Contrasena contrasena) {
        if (!usuario.datos().estado().correoVerificado()) {
            throw new CorreoNoVerificadoExcepcion();
        }

        credenciales.guardar(
                Credencial.establecer(usuario.id(), cifrador.cifrar(contrasena.valor())));

        // El correo pasa a ser tambien una identidad: asi `usuario.identidades()` sigue
        // respondiendo a «por donde puede entrar esta persona», que es lo que consulta la
        // unificacion. El sujeto es el propio correo, que para este proveedor es estable.
        IdentidadExterna porCorreo =
                new IdentidadExterna(ProveedorIdentidad.CORREO, usuario.datos().correo().valor());
        if (usuario.identidadDe(ProveedorIdentidad.CORREO).isEmpty()) {
            usuario.vincular(porCorreo);
            usuarios.vincularIdentidad(usuario, porCorreo);
        }
    }
}
