package com.academiadiegoromero.identidad.dominio.puerto;

/**
 * Puerto de cifrado de contrasenas.
 *
 * <p>El dominio decide CUANDO se cifra y CUANDO se comprueba; que algoritmo se usa es una
 * decision de infraestructura que cambia con el tiempo —hoy BCrypt con factor 12, manana
 * Argon2— sin que las reglas de negocio se enteren.
 *
 * <p>Existe ademas por una razon practica: sin este puerto, probar el registro exigiria
 * calcular hashes reales en cada prueba unitaria, y BCrypt con factor 12 tarda a proposito
 * cientos de milisegundos. La suite pasaria de milisegundos a minutos.
 */
public interface CifradorContrasena {

    /** Convierte una contrasena en claro en su representacion almacenable. */
    String cifrar(String enClaro);

    /**
     * Comprueba una contrasena contra su hash.
     *
     * <p>La implementacion debe comparar en tiempo constante. Una comparacion que sale antes
     * al primer caracter distinto filtra informacion sobre el hash por el tiempo de respuesta.
     */
    boolean coincide(String enClaro, String cifrada);
}
