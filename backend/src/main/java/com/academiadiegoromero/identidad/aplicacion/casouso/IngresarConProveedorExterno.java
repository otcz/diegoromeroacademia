package com.academiadiegoromero.identidad.aplicacion.casouso;

import com.academiadiegoromero.identidad.aplicacion.dto.PerfilExterno;
import com.academiadiegoromero.identidad.dominio.excepcion.CorreoSinVerificarExcepcion;
import com.academiadiegoromero.identidad.dominio.excepcion.CuentaDesactivadaExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import java.time.Clock;
import java.util.Optional;

/**
 * Resuelve un ingreso por Google (o cualquier proveedor externo) a un unico {@link Usuario}.
 *
 * <p><b>Este es el caso de uso donde vive el no negociable #1.</b> «Un correo = una cuenta»
 * no es una restriccion de base de datos: es este algoritmo de tres pasos, y por eso esta en
 * una clase con nombre propio y con pruebas propias, y no repartido en un manejador de
 * seguridad donde nadie lo encontraria.
 *
 * <p>El orden importa:
 *
 * <ol>
 *   <li><b>Por sujeto.</b> Quien ya entro antes por este proveedor vuelve a su cuenta
 *       aunque haya cambiado de correo en Google. El sujeto es estable; el correo no.
 *   <li><b>Por correo.</b> Quien tiene cuenta pero llega por un boton nuevo se VINCULA a la
 *       suya. Este paso es el que impide crear la cuenta duplicada que se lleva las compras,
 *       los certificados y el progreso de alguien que ya pago.
 *   <li><b>Alta.</b> Solo si de verdad no existe.
 * </ol>
 *
 * <p>No lleva anotaciones de Spring: la transaccion y el cableado los pone la infraestructura.
 * Asi se prueba entero con un repositorio en memoria, sin contenedor ni base de datos.
 */
public class IngresarConProveedorExterno {

    private final RepositorioUsuario repositorio;
    private final RepositorioCredencial credenciales;
    private final Clock reloj;

    public IngresarConProveedorExterno(
            RepositorioUsuario repositorio, RepositorioCredencial credenciales, Clock reloj) {
        this.repositorio = repositorio;
        this.credenciales = credenciales;
        this.reloj = reloj;
    }

    /**
     * Devuelve el usuario que corresponde a este perfil, creandolo o vinculandolo si hace falta.
     *
     * @throws CorreoSinVerificarExcepcion si el proveedor no confirmo la direccion
     * @throws CuentaDesactivadaExcepcion si la cuenta existe pero esta dada de baja
     */
    public Usuario ejecutar(PerfilExterno perfil) {
        // Antes que nada: sin correo verificado no se puede unificar por correo, y unificar
        // sobre una direccion no probada es apropiacion de cuenta. Se corta aqui, no despues.
        if (!perfil.correoVerificado()) {
            throw new CorreoSinVerificarExcepcion(perfil.proveedor().name());
        }

        IdentidadExterna identidad = new IdentidadExterna(perfil.proveedor(), perfil.sujeto());

        Optional<Usuario> porIdentidad =
                repositorio.buscarPorIdentidad(perfil.proveedor(), perfil.sujeto());
        if (porIdentidad.isPresent()) {
            return exigirActiva(porIdentidad.get());
        }

        return repositorio
                .buscarPorCorreo(perfil.correo())
                .map(existente -> vincularA(existente, identidad))
                .orElseGet(() -> darDeAlta(perfil, identidad));
    }

    /**
     * Cuelga la forma de entrar nueva de la cuenta que ya existe. Aqui NO se crea nada.
     *
     * <p><b>Y aqui se cierra una via de apropiacion de cuenta.</b> Si la cuenta existente
     * tenia el correo SIN verificar, la unica manera de que exista es que alguien la haya
     * creado con contrasena sin probar que el correo fuera suyo. Ahora llega un proveedor que
     * SI lo prueba. Vincular sin mas dejaria al dueno legitimo dentro de una cuenta cuya
     * contrasena conoce un tercero.
     *
     * <p>La prueba gana a la afirmacion: se marca el correo como verificado y se DESCARTA esa
     * contrasena. El dueno entra por su proveedor y puede poner una nueva cuando quiera.
     */
    private Usuario vincularA(Usuario existente, IdentidadExterna identidad) {
        Usuario activa = exigirActiva(existente);

        if (!activa.datos().estado().correoVerificado()) {
            credenciales.borrarDe(activa.id());
            activa.confirmarCorreo();
            repositorio.guardar(activa);
        }

        activa.vincular(identidad);
        repositorio.vincularIdentidad(activa, identidad);
        return activa;
    }

    private Usuario darDeAlta(PerfilExterno perfil, IdentidadExterna identidad) {
        return repositorio.guardar(Usuario.registrarDesdeProveedor(
                perfil.correo(), perfil.nombre(), identidad, reloj.instant()));
    }

    private Usuario exigirActiva(Usuario usuario) {
        if (!usuario.datos().activo()) {
            throw new CuentaDesactivadaExcepcion();
        }
        return usuario;
    }
}
