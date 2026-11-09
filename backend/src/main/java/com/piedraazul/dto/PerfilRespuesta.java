package com.piedraazul.dto;

public record PerfilRespuesta(
        Long id,
        String nombreUsuario,
        String correo,
        String rol,
        String nombres,
        String apellidos) {
}
