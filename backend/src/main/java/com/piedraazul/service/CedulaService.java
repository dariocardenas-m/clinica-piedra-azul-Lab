package com.piedraazul.service;

import com.piedraazul.dto.CedulaRespuesta;
import com.piedraazul.exception.ExcepcionNegocio;
import com.piedraazul.repository.MedicoRepository;
import com.piedraazul.repository.PacienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * La cédula identifica a la persona en toda la clínica, sea médico o paciente.
 */
@Service
public class CedulaService {

    private final MedicoRepository medicos;
    private final PacienteRepository pacientes;

    public CedulaService(MedicoRepository medicos, PacienteRepository pacientes) {
        this.medicos = medicos;
        this.pacientes = pacientes;
    }

    public CedulaRespuesta consultar(String cedula) {
        if (cedula == null || !cedula.matches("\\d{6,12}")) {
            throw new ExcepcionNegocio(HttpStatus.BAD_REQUEST, "La cédula debe tener entre 6 y 12 dígitos.");
        }
        boolean existe = medicos.existsByCedula(cedula) || pacientes.existsByCedula(cedula);
        return new CedulaRespuesta(cedula, existe);
    }

    public void exigirDisponible(String cedula) {
        if (consultar(cedula).existe()) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "La cédula ya está registrada.");
        }
    }
}
