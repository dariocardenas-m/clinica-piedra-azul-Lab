package com.piedraazul.dto;

public record LoginRespuesta(String token, String tipo, String correo, String rol, String nombreUsuario) {
}
