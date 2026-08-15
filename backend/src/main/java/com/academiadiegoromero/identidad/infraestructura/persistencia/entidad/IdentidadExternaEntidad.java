package com.academiadiegoromero.identidad.infraestructura.persistencia.entidad;

import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

/** Tabla `identidad_externa`. Ver {@link UsuarioEntidad} sobre por que existe aparte del dominio. */
@Entity
@Table(name = "identidad_externa")
public class IdentidadExternaEntidad {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntidad usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProveedorIdentidad proveedor;

    @Column(nullable = false)
    private String sujeto;

    protected IdentidadExternaEntidad() {
        // Exigido por JPA.
    }

    public static IdentidadExternaEntidad desdeDominio(UsuarioEntidad usuario, IdentidadExterna identidad) {
        IdentidadExternaEntidad entidad = new IdentidadExternaEntidad();
        entidad.id = UUID.randomUUID();
        entidad.usuario = usuario;
        entidad.proveedor = identidad.proveedor();
        entidad.sujeto = identidad.sujeto();
        return entidad;
    }

    public IdentidadExterna aDominio() {
        return new IdentidadExterna(proveedor, sujeto);
    }
}
