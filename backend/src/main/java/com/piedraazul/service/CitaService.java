package com.piedraazul.service;

import com.piedraazul.dto.CitaRespuesta;
import com.piedraazul.dto.CitaSolicitud;
import com.piedraazul.entity.Cita;
import com.piedraazul.entity.Medico;
import com.piedraazul.entity.Paciente;
import com.piedraazul.exception.ExcepcionNegocio;
import com.piedraazul.repository.CitaRepository;
import com.piedraazul.repository.PacienteRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitaService {

    private final CitaRepository citas;
    private final PacienteRepository pacientes;
    private final MedicoService medicos;
    private final PacienteService pacienteService;

    public CitaService(
            CitaRepository citas,
            PacienteRepository pacientes,
            MedicoService medicos,
            PacienteService pacienteService) {
        this.citas = citas;
        this.pacientes = pacientes;
        this.medicos = medicos;
        this.pacienteService = pacienteService;
    }

    @Transactional
    public CitaRespuesta crear(CitaSolicitud solicitud) {
        Paciente paciente = pacienteService.buscarActivo(solicitud.pacienteId());
        Medico medico = medicos.buscarActivo(solicitud.medicoId());
        if (citas.existsByMedicoIdAndFechaAndHora(medico.getId(), solicitud.fecha(), solicitud.hora())) {
            throw new ExcepcionNegocio(
                    HttpStatus.CONFLICT, "El médico ya tiene una cita en esa fecha y hora.");
        }
        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFecha(solicitud.fecha());
        cita.setHora(solicitud.hora());
        cita.setMotivo(solicitud.motivo().trim());
        cita.setEstado(solicitud.estado());
        cita.setObservaciones(solicitud.observaciones() == null ? null : solicitud.observaciones().trim());
        return aRespuesta(citas.save(cita));
    }

    @Transactional(readOnly = true)
    public List<CitaRespuesta> listarTodas() {
        return citas.findAllConDetalle().stream().map(this::aRespuesta).toList();
    }

    /**
     * El paciente sale del usuario autenticado. El cliente no puede enviar un id ajeno.
     */
    @Transactional(readOnly = true)
    public List<CitaRespuesta> listarPropias() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        pacientes.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new ExcepcionNegocio(
                        HttpStatus.NOT_FOUND, "El usuario autenticado no tiene una ficha de paciente."));
        return citas.findByCorreoPaciente(correo).stream().map(this::aRespuesta).toList();
    }

    private CitaRespuesta aRespuesta(Cita cita) {
        return new CitaRespuesta(
                cita.getId(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos(),
                cita.getMedico().getId(),
                cita.getMedico().getNombres() + " " + cita.getMedico().getApellidos(),
                cita.getMedico().getEspecialidad(),
                cita.getFecha(),
                cita.getHora(),
                cita.getMotivo(),
                cita.getEstado(),
                cita.getObservaciones());
    }
}
