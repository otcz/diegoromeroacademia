package com.academiadiegoromero.identidad.aplicacion.casouso;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Doble en memoria del puerto de usuarios.
 *
 * <p>Es lo que permite probar los casos de uso —incluida la regla mas cara del negocio— en
 * milisegundos y sin PostgreSQL. Se comparte entre las pruebas del modulo en vez de repetirlo
 * en cada una: dos dobles del mismo puerto acaban comportandose distinto y las pruebas dejan
 * de significar lo mismo.
 */
final class RepositorioUsuarioEnMemoria implements RepositorioUsuario {

    private final List<Usuario> guardados = new ArrayList<>();

    @Override
    public Optional<Usuario> buscarPorIdentidad(ProveedorIdentidad proveedor, String sujeto) {
        return guardados.stream()
                .filter(u -> u.identidadDe(proveedor)
                        .map(i -> i.sujeto().equals(sujeto))
                        .orElse(false))
                .findFirst();
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(Correo correo) {
        return guardados.stream().filter(u -> u.datos().correo().equals(correo)).findFirst();
    }

    @Override
    public Optional<Usuario> buscarPorId(java.util.UUID id) {
        return guardados.stream().filter(u -> u.id().equals(id)).findFirst();
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        guardados.removeIf(u -> u.id().equals(usuario.id()));
        guardados.add(usuario);
        return usuario;
    }

    @Override
    public void vincularIdentidad(Usuario usuario, IdentidadExterna identidad) {
        // El agregado ya se actualizo en memoria; aqui no hay nada que persistir.
    }

    int cuantos() {
        return guardados.size();
    }

    /** Atajo para las pruebas que solo dan de alta a una persona. */
    Usuario unico() {
        return guardados.getFirst();
    }
}
