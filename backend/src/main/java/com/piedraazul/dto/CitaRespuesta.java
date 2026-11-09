package com.piedraazul.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.piedraazul.entity.EstadoCita;
import java.time.LocalDate;
import java.time.LocalTime;

public record CitaRespuesta(
        Long id,
        Long pacienteId,
        String paciente,
        Long medicoId,
        String medico,
        String especialidad,
        LocalDate fecha,
        @JsonFormat(pattern = "HH:mm")
        LocalTime hora,
        String motivo,
        EstadoCita estado,
        String observaciones) {
}
