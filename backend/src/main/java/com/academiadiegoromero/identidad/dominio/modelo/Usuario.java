package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Una persona con cuenta en la academia. Raiz del agregado de identidad.
 *
 * <p><b>El correo es la identidad.</b> Un usuario puede tener varias formas de entrar
 * —Google, Facebook, contrasena— pero todas cuelgan de este objeto y se resuelven por su
 * correo. Es el no negociable #1, y esta escrito aqui y no en un servicio porque es una
 * invariante del agregado: nadie puede saltarsela sin tocar esta clase.
 *
 * <p>Las cuentas duplicadas son el reclamo de soporte mas caro del negocio: alguien paga,
 * vuelve por otro boton de ingreso, cae en una cuenta vacia y cree que perdio el curso.
 *
 * <p>Los datos editables viven en {@link DatosUsuario}; aqui quedan solo los que gobierna el
 * sistema —identificador, fecha de alta y formas de entrar—, que es lo que hace evidente en
 * cada firma cual de las dos cosas se esta tocando.
 */
public final class Usuario {

    private final UUID id;
    private final Instant registradoEn;
    private final List<IdentidadExterna> identidades;

    private DatosUsuario datos;

    private Usuario(
            UUID id, DatosUsuario datos, Instant registradoEn, List<IdentidadExterna> identidades) {
        this.id = id;
        this.datos = datos;
        this.registradoEn = registradoEn;
        this.identidades = new ArrayList<>(identidades);
    }

    /**
     * Da de alta a alguien que entra por primera vez con un proveedor externo.
     *
     * <p>Nace como {@link Rol#ALUMNO} y activo: no hay paso propio de verificacion de correo
     * porque el proveedor ya lo verifico, y anadir uno solo perderia registros.
     */
    public static Usuario registrarDesdeProveedor(
            Correo correo, String nombre, IdentidadExterna identidad, Instant ahora) {
        if (identidad == null) {
            throw new DatoInvalidoExcepcion("identidad", "La identidad externa es obligatoria");
        }
        return new Usuario(
                UUID.randomUUID(),
                new DatosUsuario(correo, nombre, Rol.ALUMNO, true),
                ahora,
                List.of(identidad));
    }

    /** Reconstruye un usuario ya guardado. Solo lo usa la capa de persistencia. */
    public static Usuario rehidratar(
            UUID id, DatosUsuario datos, Instant registradoEn, List<IdentidadExterna> identidades) {
        return new Usuario(id, datos, registradoEn, identidades);
    }

    /**
     * Anade una forma de entrar a una cuenta que ya existe.
     *
     * <p><b>Es el metodo que evita las cuentas duplicadas.</b> Cuando alguien que se registro
     * con contrasena vuelve con Google usando el mismo correo, no se crea una cuenta: se
     * cuelga la identidad de Google de la que ya tiene, y conserva sus compras, certificados
     * y progreso.
     *
     * <p>Es idempotente: repetir el ingreso con el mismo proveedor no acumula identidades.
     */
    public void vincular(IdentidadExterna identidad) {
        if (identidad == null) {
            throw new DatoInvalidoExcepcion("identidad", "La identidad externa es obligatoria");
        }
        if (identidadDe(identidad.proveedor()).isPresent()) {
            return;
        }
        identidades.add(identidad);
    }

    public Optional<IdentidadExterna> identidadDe(ProveedorIdentidad proveedor) {
        return identidades.stream().filter(i -> i.proveedor() == proveedor).findFirst();
    }

    public UUID id() {
        return id;
    }

    public DatosUsuario datos() {
        return datos;
    }

    public Instant registradoEn() {
        return registradoEn;
    }

    /** Copia inmutable: nadie modifica las identidades sin pasar por {@link #vincular}. */
    public List<IdentidadExterna> identidades() {
        return Collections.unmodifiableList(identidades);
    }
}
