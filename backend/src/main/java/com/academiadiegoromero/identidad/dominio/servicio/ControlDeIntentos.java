package com.academiadiegoromero.identidad.dominio.servicio;

import com.academiadiegoromero.identidad.dominio.excepcion.CuentaBloqueadaExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.Credencial;
import com.academiadiegoromero.identidad.dominio.puerto.RepositorioCredencial;
import java.time.Clock;
import java.time.Duration;
import java.util.Optional;

/**
 * El freno de fuerza bruta: cuenta fallos, bloquea y perdona.
 *
 * <p>Nace de una senial del linter —el ingreso pedia seis dependencias— y resulto ser la
 * frontera correcta. «Comprobar si la contrasena es correcta» y «cuantas veces te has
 * equivocado» son dos preguntas distintas, con politica propia y con motivos propios para
 * cambiar: la primera depende del algoritmo de cifrado, la segunda de lo que docs/06 decida
 * sobre intentos y duracion del bloqueo.
 *
 * <p>Es un servicio de DOMINIO, no de aplicacion: la regla de cuando se bloquea una cuenta es
 * de negocio, no de fontaneria.
 */
public class ControlDeIntentos {

    private final RepositorioCredencial credenciales;
    private final Clock reloj;
    private final int maximoIntentos;
    private final Duration bloqueo;

    public ControlDeIntentos(
            RepositorioCredencial credenciales, Clock reloj, int maximoIntentos, Duration bloqueo) {
        this.credenciales = credenciales;
        this.reloj = reloj;
        this.maximoIntentos = maximoIntentos;
        this.bloqueo = bloqueo;
    }

    /**
     * Corta si la cuenta esta frenada ahora mismo.
     *
     * @throws CuentaBloqueadaExcepcion mientras dure el bloqueo
     */
    public void exigirNoBloqueada(Optional<Credencial> credencial) {
        if (credencial.isPresent() && credencial.get().estaBloqueada(reloj.instant())) {
            throw new CuentaBloqueadaExcepcion();
        }
    }

    /** Anota un fallo y persiste. Bloquea sola al alcanzar el limite. */
    public void anotarFallo(Optional<Credencial> credencial) {
        credencial.ifPresent(c -> {
            c.registrarFallo(maximoIntentos, bloqueo, reloj.instant());
            credenciales.guardar(c);
        });
    }

    /** Un acierto borra el historial: si no, los fallos de ayer bloquearian manana. */
    public void anotarExito(Optional<Credencial> credencial) {
        credencial.ifPresent(c -> {
            c.registrarExito();
            credenciales.guardar(c);
        });
    }
}
