package com.piedraazul.exception;

import com.piedraazul.dto.ErrorRespuesta;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduce las excepciones de la API a los códigos HTTP del enunciado.
 */
@RestControllerAdvice
public class ManejadorExcepciones {

    @ExceptionHandler(ExcepcionNegocio.class)
    public ResponseEntity<ErrorRespuesta> negocio(ExcepcionNegocio ex) {
        return responder(ex.getEstado(), ex.getMessage(), Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorRespuesta> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
        return responder(HttpStatus.BAD_REQUEST, "Los datos enviados no son válidos.", errores);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorRespuesta> jsonIlegible(HttpMessageNotReadableException ex) {
        return responder(HttpStatus.BAD_REQUEST, "El formato de los datos no es válido.", Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorRespuesta> conflicto(DataIntegrityViolationException ex) {
        return responder(HttpStatus.CONFLICT, "El registro entra en conflicto con uno ya existente.", Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorRespuesta> inesperado(Exception ex) {
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error interno.", Map.of());
    }

    private ResponseEntity<ErrorRespuesta> responder(HttpStatus estado, String mensaje, Map<String, String> errores) {
        return ResponseEntity.status(estado).body(new ErrorRespuesta(estado.value(), mensaje, errores));
    }
}
