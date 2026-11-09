package com.piedraazul.service;

import com.piedraazul.dto.PacienteRespuesta;
import com.piedraazul.dto.PacienteSolicitud;
import com.piedraazul.entity.EstadoPersona;
import com.piedraazul.entity.Paciente;
import com.piedraazul.entity.Rol;
import com.piedraazul.entity.Usuario;
import com.piedraazul.exception.ExcepcionNegocio;
import com.piedraazul.repository.PacienteRepository;
import com.piedraazul.repository.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PacienteService {

    private final PacienteRepository pacientes;
    private final UsuarioRepository usuarios;
    private final CedulaService cedulas;
    private final PasswordEncoder passwordEncoder;

    public PacienteService(
            PacienteRepository pacientes,
            UsuarioRepository usuarios,
            CedulaService cedulas,
            PasswordEncoder passwordEncoder) {
        this.pacientes = pacientes;
        this.usuarios = usuarios;
        this.cedulas = cedulas;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public PacienteRespuesta registrar(PacienteSolicitud solicitud) {
        cedulas.exigirDisponible(solicitud.cedula());
        String correo = solicitud.correo().trim().toLowerCase();
        if (usuarios.existsByCorreo(correo) || pacientes.existsByCorreo(correo)) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "El correo ya está registrado.");
        }
        if (usuarios.existsByNombreUsuario(solicitud.nombreUsuario())) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(solicitud.nombreUsuario().trim());
        usuario.setCorreo(correo);
        usuario.setPasswordHash(passwordEncoder.encode(solicitud.password()));
        usuario.setRol(Rol.PACIENTE);
        usuario.setActivo(solicitud.estado() == EstadoPersona.ACTIVO);
        usuario = usuarios.save(usuario);

        Paciente paciente = new Paciente();
        paciente.setNombres(solicitud.nombres().trim());
        paciente.setApellidos(solicitud.apellidos().trim());
        paciente.setCedula(solicitud.cedula());
        paciente.setFechaNacimiento(solicitud.fechaNacimiento());
        paciente.setTelefono(solicitud.telefono());
        paciente.setCorreo(correo);
        paciente.setDireccion(solicitud.direccion().trim());
        paciente.setEstado(solicitud.estado());
        paciente.setUsuario(usuario);
        return aRespuesta(pacientes.save(paciente));
    }

    @Transactional(readOnly = true)
    public List<PacienteRespuesta> listar() {
        return pacientes.findAll().stream().map(this::aRespuesta).toList();
    }

    public Paciente buscarActivo(Long id) {
        Paciente paciente = pacientes.findById(id)
                .orElseThrow(() -> new ExcepcionNegocio(HttpStatus.NOT_FOUND, "El paciente no existe."));
        if (paciente.getEstado() != EstadoPersona.ACTIVO) {
            throw new ExcepcionNegocio(HttpStatus.CONFLICT, "El paciente no está activo.");
        }
        return paciente;
    }

    private PacienteRespuesta aRespuesta(Paciente paciente) {
        return new PacienteRespuesta(
                paciente.getId(),
                paciente.getNombres(),
                paciente.getApellidos(),
                paciente.getCedula(),
                paciente.getFechaNacimiento(),
                paciente.getTelefono(),
                paciente.getCorreo(),
                paciente.getDireccion(),
                paciente.getEstado(),
                paciente.getUsuario().getNombreUsuario());
    }
}
