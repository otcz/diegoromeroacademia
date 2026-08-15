package com.academiadiegoromero.identidad.dominio.puerto;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import java.util.Optional;

/**
 * Puerto de salida hacia donde vivan los usuarios.
 *
 * <p>El dominio declara QUE necesita; la infraestructura decide con que. Por eso el caso de
 * uso se puede probar con una implementacion en memoria, sin base de datos ni Spring, que es
 * lo que sostiene la piramide de pruebas de docs/05.
 */
public interface RepositorioUsuario {

    /**
     * Busca por el identificador estable del proveedor. Es como se reconoce a quien vuelve.
     *
     * <p>Se busca por sujeto y NO por correo, porque una persona puede cambiar su correo en
     * Google conservando la cuenta: el sujeto sigue siendo el mismo.
     */
    Optional<Usuario> buscarPorIdentidad(ProveedorIdentidad proveedor, String sujeto);

    /**
     * Busca por correo. Es lo que hace cumplir el no negociable #1.
     *
     * <p>El {@link Correo} llega ya normalizado a minusculas por su propio constructor, asi
     * que la comparacion es exacta y no depende de como escriba el proveedor la direccion.
     */
    Optional<Usuario> buscarPorCorreo(Correo correo);

    /** Guarda un usuario nuevo o actualiza uno existente, con sus identidades. */
    Usuario guardar(Usuario usuario);

    /** Anade una forma de entrar a un usuario que ya existe. */
    void vincularIdentidad(Usuario usuario, IdentidadExterna identidad);
}
