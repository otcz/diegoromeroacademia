package com.academiadiegoromero.identidad.infraestructura.persistencia.entidad;

import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Tabla `credencial`. Ver UsuarioEntidad sobre por que las entidades viven aparte del dominio. */
@Entity
@Table(name = "credencial")
public class CredencialEntidad {

    @Id
    @Column(name = "usuario_id")
    private UUID usuarioId;

    @Column(nullable = false)
    private String cifrada;

    @Column(name = "fallos_seguidos", nullable = false)
    private int fallosSeguidos;

    @Column(name = "bloqueada_hasta")
    private Instant bloqueadaHasta;

    @Column(name = "actualizada_en", nullable = false)
    private Instant actualizadaEn;

    protected CredencialEntidad() {
        // Exigido por JPA.
    }

    public static CredencialEntidad desdeDominio(Credencial credencial, Instant ahora) {
        CredencialEntidad entidad = new CredencialEntidad();
        entidad.usuarioId = credencial.usuarioId();
        entidad.cifrada = credencial.cifrada();
        entidad.fallosSeguidos = credencial.fallosSeguidos();
        entidad.bloqueadaHasta = credencial.bloqueadaHasta();
        entidad.actualizadaEn = ahora;
        return entidad;
    }

    public Credencial aDominio() {
        return Credencial.rehidratar(usuarioId, cifrada, fallosSeguidos, bloqueadaHasta);
    }
}
