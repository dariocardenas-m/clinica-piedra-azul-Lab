package com.piedraazul.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.piedraazul.entity.EstadoCita;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;

public record CitaSolicitud(
        @NotNull(message = "Debe seleccionar un paciente.")
        Long pacienteId,
        @NotNull(message = "Debe seleccionar un médico.")
        Long medicoId,
        @NotNull(message = "La fecha es obligatoria.")
        LocalDate fecha,
        @NotNull(message = "La hora es obligatoria.")
        @JsonFormat(pattern = "HH:mm")
        LocalTime hora,
        @NotBlank(message = "El motivo es obligatorio.")
        @Size(min = 5, max = 300, message = "El motivo debe tener entre 5 y 300 caracteres.")
        String motivo,
        @NotNull(message = "El estado es obligatorio.")
        EstadoCita estado,
        @Size(max = 500, message = "Las observaciones admiten máximo 500 caracteres.")
        String observaciones) {
}
