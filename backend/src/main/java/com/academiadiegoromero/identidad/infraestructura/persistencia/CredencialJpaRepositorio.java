package com.academiadiegoromero.identidad.infraestructura.persistencia;

import com.academiadiegoromero.identidad.infraestructura.persistencia.entidad.CredencialEntidad;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repositorio de Spring Data. Lo consume el adaptador, nunca el dominio ni la aplicacion. */
interface CredencialJpaRepositorio extends JpaRepository<CredencialEntidad, UUID> {
}
