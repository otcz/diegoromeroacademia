package com.academiadiegoromero.identidad.infraestructura.persistencia;

import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import com.academiadiegoromero.identidad.infraestructura.persistencia.entidad.CredencialEntidad;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Adaptador de salida de las contrasenas. Traduce entre el puerto del dominio y JPA. */
@Repository
class RepositorioCredencialAdaptador implements RepositorioCredencial {

    private final CredencialJpaRepositorio jpa;
    private final Clock reloj;

    RepositorioCredencialAdaptador(CredencialJpaRepositorio jpa, Clock reloj) {
        this.jpa = jpa;
        this.reloj = reloj;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Credencial> buscarPorUsuario(UUID usuarioId) {
        return jpa.findById(usuarioId).map(CredencialEntidad::aDominio);
    }

    @Override
    @Transactional
    public Credencial guardar(Credencial credencial) {
        return jpa.save(CredencialEntidad.desdeDominio(credencial, reloj.instant())).aDominio();
    }

    @Override
    @Transactional
    public void borrarDe(UUID usuarioId) {
        jpa.deleteById(usuarioId);
    }
}
