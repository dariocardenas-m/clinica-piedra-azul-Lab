package com.piedraazul.exception;

import org.springframework.http.HttpStatus;

/**
 * Error de una regla de la clínica, con el código HTTP que debe ver el cliente.
 */
public class ExcepcionNegocio extends RuntimeException {

    private final HttpStatus estado;

    public ExcepcionNegocio(HttpStatus estado, String mensaje) {
        super(mensaje);
        this.estado = estado;
    }

    public HttpStatus getEstado() {
        return estado;
    }
}
