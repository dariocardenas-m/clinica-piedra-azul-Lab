package com.piedraazul.dto;

/**
 * Respuesta del diagnóstico de arranque. Es un DTO, no una entidad:
 * no se guarda en MySQL y no expone configuración interna.
 */
public record SaludRespuesta(String aplicacion, String estado, String mensaje) {
}
