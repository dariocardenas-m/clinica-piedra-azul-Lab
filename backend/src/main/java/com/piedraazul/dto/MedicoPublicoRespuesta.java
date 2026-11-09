package com.piedraazul.dto;

/**
 * Datos visibles sin sesión. Omite cédula, teléfono, correo y dirección.
 */
public record MedicoPublicoRespuesta(Long id, String nombres, String apellidos, String especialidad) {
}
