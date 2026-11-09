package com.piedraazul.dto;

import com.piedraazul.entity.EstadoPersona;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MedicoSolicitud(
        @NotBlank(message = "Los nombres son obligatorios.")
        @Size(min = 2, max = 80, message = "Los nombres deben tener entre 2 y 80 caracteres.")
        String nombres,
        @NotBlank(message = "Los apellidos son obligatorios.")
        @Size(min = 2, max = 80, message = "Los apellidos deben tener entre 2 y 80 caracteres.")
        String apellidos,
        @NotBlank(message = "La cédula es obligatoria.")
        @Pattern(regexp = "\\d{6,12}", message = "La cédula debe tener entre 6 y 12 dígitos.")
        String cedula,
        @NotBlank(message = "La especialidad es obligatoria.")
        @Size(min = 3, max = 80, message = "La especialidad debe tener entre 3 y 80 caracteres.")
        String especialidad,
        @NotBlank(message = "El teléfono es obligatorio.")
        @Pattern(regexp = "\\d{7,15}", message = "El teléfono debe tener entre 7 y 15 dígitos.")
        String telefono,
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo no tiene un formato válido.")
        @Size(max = 120, message = "El correo admite máximo 120 caracteres.")
        String correo,
        @NotBlank(message = "La dirección es obligatoria.")
        @Size(min = 5, max = 80, message = "La dirección debe tener entre 5 y 80 caracteres.")
        String direccion,
        @NotNull(message = "El estado es obligatorio.")
        EstadoPersona estado) {
}
