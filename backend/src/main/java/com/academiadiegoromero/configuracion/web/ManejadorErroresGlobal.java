package com.academiadiegoromero.configuracion.web;

import com.academiadiegoromero.compartido.dominio.excepcion.DominioExcepcion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduce excepciones a respuestas normalizadas con Problem Details, RFC 7807
 * (docs/01 §9).
 *
 * <p>Un solo punto de traduccion garantiza que el cliente reciba siempre la misma forma de
 * error, sin importar que capa falló.
 */
@RestControllerAdvice
public class ManejadorErroresGlobal {

    private static final Logger REGISTRO = LoggerFactory.getLogger(ManejadorErroresGlobal.class);
    private static final String PROPIEDAD_CODIGO = "codigoError";

    /** Una regla de negocio incumplida es culpa de la peticion, no del sistema: 400. */
    @ExceptionHandler(DominioExcepcion.class)
    ProblemDetail manejarExcepcionDeDominio(DominioExcepcion excepcion) {
        REGISTRO.warn("Regla de dominio incumplida: {}", excepcion.codigo());

        var problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, excepcion.getMessage());
        problema.setTitle("Solicitud invalida");
        problema.setProperty(PROPIEDAD_CODIGO, excepcion.codigo());
        return problema;
    }

    /**
     * Ultima red para lo no previsto.
     *
     * <p>El detalle real va al registro y nunca a la respuesta: el mensaje de una excepcion
     * de infraestructura puede revelar nombres de tablas, rutas o estructura interna.
     */
    @ExceptionHandler(Exception.class)
    ProblemDetail manejarExcepcionInesperada(Exception excepcion) {
        REGISTRO.error("Error no controlado", excepcion);

        var problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrio un error inesperado. Intentalo de nuevo en unos minutos.");
        problema.setTitle("Error interno");
        problema.setProperty(PROPIEDAD_CODIGO, "ERROR_INTERNO");
        return problema;
    }
}
