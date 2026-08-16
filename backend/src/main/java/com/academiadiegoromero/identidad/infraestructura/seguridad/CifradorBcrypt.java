package com.academiadiegoromero.identidad.infraestructura.seguridad;

import com.academiadiegoromero.identidad.dominio.puerto.CifradorContrasena;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * BCrypt con factor 12, como exige docs/06.
 *
 * <p>El factor es el numero de rondas: cada punto DUPLICA el trabajo. Doce esta calibrado para
 * tardar unos cientos de milisegundos en hardware actual — imperceptible para quien entra una
 * vez al dia, carisimo para quien prueba millones de contrasenas por segundo.
 *
 * <p>El formato de BCrypt lleva dentro su sal y su factor, asi que se puede subir el coste en
 * el futuro sin migrar los hashes existentes: los viejos siguen validando con el suyo.
 *
 * <p>La comparacion de {@code matches} es en tiempo constante, que es lo que exige el puerto:
 * una que saliera antes al primer byte distinto filtraria informacion por el reloj.
 */
@Component
class CifradorBcrypt implements CifradorContrasena {

    /** docs/06 exige >= 12. No se baja «para que las pruebas corran mas rapido». */
    private static final int FACTOR = 12;

    private final BCryptPasswordEncoder codificador = new BCryptPasswordEncoder(FACTOR);

    @Override
    public String cifrar(String enClaro) {
        return codificador.encode(enClaro);
    }

    @Override
    public boolean coincide(String enClaro, String cifrada) {
        return codificador.matches(enClaro, cifrada);
    }
}
