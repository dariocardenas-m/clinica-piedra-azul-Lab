package com.piedraazul.dto;

import com.piedraazul.entity.EstadoPersona;

public record MedicoRespuesta(
        Long id,
        String nombres,
        String apellidos,
        String cedula,
        String especialidad,
        String telefono,
        String correo,
        String direccion,
        EstadoPersona estado) {
}
