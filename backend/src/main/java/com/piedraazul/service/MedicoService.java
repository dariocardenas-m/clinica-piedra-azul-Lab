package com.piedraazul.service;

import com.piedraazul.dto.MedicoPublicoRespuesta;
import com.piedraazul.dto.MedicoRespuesta;
import com.piedraazul.dto.MedicoSolicitud;
import com.piedraazul.entity.EstadoPersona;
import com.piedraazul.entity.Medico;
import com.piedraazul.exception.ExcepcionNegocio;
import com.piedraazul.repository.MedicoRepository;
import com.piedraazul.repository.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MedicoService {

    private final MedicoRepository medicos;
    private final UsuarioRepository usuarios;
    private final CedulaService cedulas;

    public MedicoService(MedicoRepository medicos, UsuarioRepository usuarios, CedulaService cedulas) {
        this.medicos = medicos;
        this.usuarios = usuarios;
        this.cedulas = cedulas;
    }

    @Transactional
    public MedicoRespuesta registrar(MedicoSolicitud solicitud) {
        cedulas.exigirDisponible(solicitud.cedula());
        if (medicos.existsByCorreo(solicitud.correo()) || usuarios.existsByCorreo(solicitud.correo())) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "El correo ya está registrado.");
        }
        Medico medico = new Medico();
        medico.setNombres(solicitud.nombres().trim());
        medico.setApellidos(solicitud.apellidos().trim());
        medico.setCedula(solicitud.cedula());
        medico.setEspecialidad(solicitud.especialidad().trim());
        medico.setTelefono(solicitud.telefono());
        medico.setCorreo(solicitud.correo().trim().toLowerCase());
        medico.setDireccion(solicitud.direccion().trim());
        medico.setEstado(solicitud.estado());
        return aRespuesta(medicos.save(medico));
    }

    @Transactional(readOnly = true)
    public List<MedicoRespuesta> listar() {
        return medicos.findAll().stream()
                .map(this::aRespuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MedicoPublicoRespuesta> listarPublicos() {
        return medicos.findByEstadoOrderByApellidosAscNombresAsc(EstadoPersona.ACTIVO).stream()
                .map(medico -> new MedicoPublicoRespuesta(
                        medico.getId(), medico.getNombres(), medico.getApellidos(), medico.getEspecialidad()))
                .toList();
    }

    public Medico buscarActivo(Long id) {
        Medico medico = medicos.findById(id)
                .orElseThrow(() -> new ExcepcionNegocio(HttpStatus.NOT_FOUND, "El médico no existe."));
        if (medico.getEstado() != EstadoPersona.ACTIVO) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "El médico no está activo.");
        }
        return medico;
    }

    private MedicoRespuesta aRespuesta(Medico medico) {
        return new MedicoRespuesta(
                medico.getId(),
                medico.getNombres(),
                medico.getApellidos(),
                medico.getCedula(),
                medico.getEspecialidad(),
                medico.getTelefono(),
                medico.getCorreo(),
                medico.getDireccion(),
                medico.getEstado());
    }
}
