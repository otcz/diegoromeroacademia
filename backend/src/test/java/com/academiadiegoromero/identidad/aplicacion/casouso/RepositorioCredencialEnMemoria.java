package com.academiadiegoromero.identidad.aplicacion.casouso;

import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Doble en memoria del puerto de contrasenas.
 *
 * <p>Existe para que las pruebas de los casos de uso corran sin PostgreSQL. Es lo que permite
 * que la regla mas cara del negocio se compruebe en milisegundos y nadie tenga la tentacion
 * de saltarsela.
 */
final class RepositorioCredencialEnMemoria implements RepositorioCredencial {

    private final Map<UUID, Credencial> guardadas = new HashMap<>();

    @Override
    public Optional<Credencial> buscarPorUsuario(UUID usuarioId) {
        return Optional.ofNullable(guardadas.get(usuarioId));
    }

    @Override
    public Credencial guardar(Credencial credencial) {
        guardadas.put(credencial.usuarioId(), credencial);
        return credencial;
    }

    @Override
    public void borrarDe(UUID usuarioId) {
        guardadas.remove(usuarioId);
    }

    boolean tieneContrasena(UUID usuarioId) {
        return guardadas.containsKey(usuarioId);
    }
}
