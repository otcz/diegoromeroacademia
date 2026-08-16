package com.academiadiegoromero.identidad.dominio.modelo;

import com.academiadiegoromero.compartido.dominio.excepcion.DatoInvalidoExcepcion;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/**
 * La contrasena de un usuario, ya cifrada, con su contador de intentos fallidos.
 *
 * <p>El contador vive AQUI y no en un servicio aparte porque «cuantos fallos llevas» y «cual
 * es tu contrasena» se leen y se escriben siempre juntos: separarlos obliga a dos consultas y
 * abre la ventana en la que un atacante prueba mas veces de las permitidas.
 *
 * <p>La especificacion §5.3 y docs/06 exigen bloqueo tras cinco intentos. El bloqueo es
 * TEMPORAL a proposito: uno permanente convierte cualquier ataque en una denegacion de
 * servicio contra el alumno, que es peor que el ataque.
 */
public final class Credencial {

    private final UUID usuarioId;
    private final String cifrada;

    private int fallosSeguidos;
    private Instant bloqueadaHasta;

    private Credencial(UUID usuarioId, String cifrada, int fallosSeguidos, Instant bloqueadaHasta) {
        if (usuarioId == null) {
            throw new DatoInvalidoExcepcion("usuarioId", "La credencial necesita un usuario");
        }
        if (cifrada == null || cifrada.isBlank()) {
            throw new DatoInvalidoExcepcion("cifrada", "La contrasena cifrada es obligatoria");
        }
        this.usuarioId = usuarioId;
        this.cifrada = cifrada;
        this.fallosSeguidos = fallosSeguidos;
        this.bloqueadaHasta = bloqueadaHasta;
    }

    /** Credencial recien establecida: sin fallos y sin bloqueo. */
    public static Credencial establecer(UUID usuarioId, String cifrada) {
        return new Credencial(usuarioId, cifrada, 0, null);
    }

    /** Reconstruye una credencial guardada. Solo lo usa la capa de persistencia. */
    public static Credencial rehidratar(
            UUID usuarioId, String cifrada, int fallosSeguidos, Instant bloqueadaHasta) {
        return new Credencial(usuarioId, cifrada, fallosSeguidos, bloqueadaHasta);
    }

    /** Si en este instante la cuenta esta frenada por intentos fallidos. */
    public boolean estaBloqueada(Instant ahora) {
        return bloqueadaHasta != null && ahora.isBefore(bloqueadaHasta);
    }

    /**
     * Registra un intento fallido y bloquea si se alcanzo el limite.
     *
     * @param maximoIntentos cuantos fallos seguidos se toleran (configuracion)
     * @param bloqueo cuanto dura el freno
     */
    public void registrarFallo(int maximoIntentos, Duration bloqueo, Instant ahora) {
        fallosSeguidos++;
        if (fallosSeguidos >= maximoIntentos) {
            bloqueadaHasta = ahora.plus(bloqueo);
            // Se reinicia el contador junto con el bloqueo: si no, al expirar el freno el
            // siguiente fallo volveria a bloquear de inmediato y la cuenta quedaria inservible.
            fallosSeguidos = 0;
        }
    }

    /** Un ingreso correcto borra el historial de fallos. */
    public void registrarExito() {
        fallosSeguidos = 0;
        bloqueadaHasta = null;
    }

    public UUID usuarioId() {
        return usuarioId;
    }

    public String cifrada() {
        return cifrada;
    }

    public int fallosSeguidos() {
        return fallosSeguidos;
    }

    public Instant bloqueadaHasta() {
        return bloqueadaHasta;
    }
}
