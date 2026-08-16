package com.academiadiegoromero.identidad.dominio.puerto;

import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de las contrasenas.
 *
 * <p>Separado de {@link RepositorioUsuario} a proposito: la contrasena tiene otro ciclo de
 * vida —se cambia, se restablece, se bloquea— y casi ninguna consulta del sistema la necesita.
 * Tenerla en su propio puerto evita que se lea sin querer en sitios donde no pinta nada.
 */
public interface RepositorioCredencial {

    Optional<Credencial> buscarPorUsuario(UUID usuarioId);

    /** Crea o actualiza. Tambien persiste el contador de fallos y el bloqueo. */
    Credencial guardar(Credencial credencial);

    /**
     * Borra la contrasena de un usuario.
     *
     * <p>Lo usa la unificacion de cuentas: si un proveedor externo PRUEBA que el correo es de
     * quien entra, y la cuenta existente tenia una contrasena puesta sin verificar, esa
     * contrasena la escribio alguien que nunca demostro ser el dueno. Se descarta.
     */
    void borrarDe(UUID usuarioId);
}
