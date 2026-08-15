package com.academiadiegoromero.identidad.infraestructura.persistencia;

import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import com.academiadiegoromero.identidad.infraestructura.persistencia.entidad.UsuarioEntidad;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


/** Repositorio de Spring Data. Lo consume el adaptador, nunca el dominio ni la aplicacion. */
interface UsuarioJpaRepositorio extends JpaRepository<UsuarioEntidad, UUID> {

    Optional<UsuarioEntidad> findByCorreo(String correo);

    /**
     * Busca al usuario dueno de una identidad externa.
     *
     * <p>Se escribe como consulta y no por derivacion de nombre para que quede a la vista que
     * es un JOIN: es la primera consulta de cada ingreso, y esconder su forma detras de un
     * nombre largo es lo que hace que aparezcan problemas N+1 sin que nadie los vea venir.
     */
    @Query("""
            SELECT u FROM UsuarioEntidad u
            JOIN u.identidades i
            WHERE i.proveedor = :proveedor AND i.sujeto = :sujeto
            """)
    Optional<UsuarioEntidad> buscarPorIdentidad(
            @Param("proveedor") ProveedorIdentidad proveedor, @Param("sujeto") String sujeto);
}
