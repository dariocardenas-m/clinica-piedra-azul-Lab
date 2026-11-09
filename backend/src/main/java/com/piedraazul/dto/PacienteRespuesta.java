package com.piedraazul.dto;

import com.piedraazul.entity.EstadoPersona;
import java.time.LocalDate;

public record PacienteRespuesta(
        Long id,
        String nombres,
        String apellidos,
        String cedula,
        LocalDate fechaNacimiento,
        String telefono,
        String correo,
        String direccion,
        EstadoPersona estado,
        String nombreUsuario) {
}
