package com.academiadiegoromero.identidad.infraestructura.persistencia;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioUsuario;
import com.academiadiegoromero.identidad.infraestructura.persistencia.entidad.UsuarioEntidad;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


/**
 * Adaptador de salida: traduce entre el puerto del dominio y JPA.
 *
 * <p>Es el unico sitio del modulo donde conviven las dos representaciones. El dominio no sabe
 * que existe JPA y JPA no conoce las invariantes: esta clase es la costura, y por eso es
 * deliberadamente aburrida.
 */
@Repository
class RepositorioUsuarioAdaptador implements RepositorioUsuario {

    private final UsuarioJpaRepositorio jpa;

    RepositorioUsuarioAdaptador(UsuarioJpaRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorIdentidad(ProveedorIdentidad proveedor, String sujeto) {
        return jpa.buscarPorIdentidad(proveedor, sujeto).map(UsuarioEntidad::aDominio);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorCorreo(Correo correo) {
        return jpa.findByCorreo(correo.valor()).map(UsuarioEntidad::aDominio);
    }

    @Override
    @Transactional
    public Usuario guardar(Usuario usuario) {
        return jpa.save(UsuarioEntidad.desdeDominio(usuario)).aDominio();
    }

    /**
     * Anade una identidad a un usuario que ya existe.
     *
     * <p>Se recarga la entidad en vez de reconstruirla desde el dominio: reconstruir crearia
     * filas nuevas de identidad con identificadores nuevos y `orphanRemoval` borraria las
     * anteriores, con lo que un alumno perderia el vinculo con el proveedor por el que
     * habia entrado siempre.
     */
    @Override
    @Transactional
    public void vincularIdentidad(Usuario usuario, IdentidadExterna identidad) {
        jpa.findById(usuario.id()).ifPresent(entidad -> {
            entidad.agregarIdentidad(identidad);
            jpa.save(entidad);
        });
    }
}
