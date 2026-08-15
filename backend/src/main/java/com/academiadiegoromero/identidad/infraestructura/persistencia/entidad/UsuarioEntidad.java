package com.academiadiegoromero.identidad.infraestructura.persistencia.entidad;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.dominio.modelo.DatosUsuario;
import com.academiadiegoromero.identidad.dominio.modelo.IdentidadExterna;
import com.academiadiegoromero.identidad.dominio.modelo.Rol;
import com.academiadiegoromero.identidad.dominio.modelo.Usuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Tabla `usuario`. Es una pieza de infraestructura, no el modelo.
 *
 * <p>Existe separada de {@link Usuario} a proposito: la clase de dominio no lleva ni una
 * anotacion de JPA, y por eso ArchUnit puede exigir que el dominio no dependa de
 * `jakarta.persistence`. El precio es esta traduccion; la ganancia es que las reglas de
 * negocio se prueban sin base de datos y sobreviven a un cambio de tecnologia.
 */
@Entity
@Table(name = "usuario")
public class UsuarioEntidad {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo;

    @Column(name = "registrado_en", nullable = false)
    private Instant registradoEn;

    /**
     * Se cargan con el usuario, no de forma perezosa: cada ingreso las necesita, y
     * `open-in-view` esta apagado, asi que una carga perezosa fuera de la transaccion
     * reventaria. Son dos o tres filas por usuario como mucho.
     */
    @OneToMany(
            mappedBy = "usuario",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER)
    private List<IdentidadExternaEntidad> identidades = new ArrayList<>();

    protected UsuarioEntidad() {
        // Exigido por JPA.
    }

    public static UsuarioEntidad desdeDominio(Usuario usuario) {
        UsuarioEntidad entidad = new UsuarioEntidad();
        entidad.id = usuario.id();
        entidad.correo = usuario.datos().correo().valor();
        entidad.nombre = usuario.datos().nombre();
        entidad.rol = usuario.datos().rol();
        entidad.activo = usuario.datos().activo();
        entidad.registradoEn = usuario.registradoEn();
        for (IdentidadExterna identidad : usuario.identidades()) {
            entidad.agregarIdentidad(identidad);
        }
        return entidad;
    }

    public void agregarIdentidad(IdentidadExterna identidad) {
        identidades.add(IdentidadExternaEntidad.desdeDominio(this, identidad));
    }

    public Usuario aDominio() {
        return Usuario.rehidratar(
                id,
                new DatosUsuario(new Correo(correo), nombre, rol, activo),
                registradoEn,
                identidades.stream().map(IdentidadExternaEntidad::aDominio).toList());
    }

    public UUID id() {
        return id;
    }
}
