package com.piedraazul.config;

import com.piedraazul.entity.Cita;
import com.piedraazul.entity.EstadoCita;
import com.piedraazul.entity.EstadoPersona;
import com.piedraazul.entity.Medico;
import com.piedraazul.entity.Paciente;
import com.piedraazul.entity.Rol;
import com.piedraazul.entity.Usuario;
import com.piedraazul.repository.CitaRepository;
import com.piedraazul.repository.MedicoRepository;
import com.piedraazul.repository.PacienteRepository;
import com.piedraazul.repository.UsuarioRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Crea las cuentas de demostración solo si todavía no existen.
 * Contraseñas de laboratorio, guardadas con BCrypt:
 * administrador admin@clinicapiedraazul.test / Admin123*
 * paciente carlos.perez@clinicapiedraazul.test / Paciente123*
 * paciente andrea.ruiz@clinicapiedraazul.test / Paciente123*
 */
@Component
@Order(20)
public class DatosIniciales implements ApplicationRunner {

    private final UsuarioRepository usuarios;
    private final MedicoRepository medicos;
    private final PacienteRepository pacientes;
    private final CitaRepository citas;
    private final PasswordEncoder passwordEncoder;

    public DatosIniciales(
            UsuarioRepository usuarios,
            MedicoRepository medicos,
            PacienteRepository pacientes,
            CitaRepository citas,
            PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.medicos = medicos;
        this.pacientes = pacientes;
        this.citas = citas;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (usuarios.existsByCorreo("admin@clinicapiedraazul.test")) {
            return;
        }
        cuenta("admin", "admin@clinicapiedraazul.test", "Admin123*", Rol.ADMIN);
        Medico laura = medico();
        Paciente carlos = paciente(
                "Carlos", "Pérez Díaz", "9988776655", LocalDate.of(1998, 4, 12),
                "3115556677", "carlos.perez@clinicapiedraazul.test",
                "Carrera 8 # 10-15, Popayán", "carlos.perez", "Paciente123*");
        Paciente andrea = paciente(
                "Andrea", "Ruiz Mora", "1122334455", LocalDate.of(2001, 9, 3),
                "3204445566", "andrea.ruiz@clinicapiedraazul.test",
                "Calle 12 # 6-40, Popayán", "andrea.ruiz", "Paciente123*");

        cita(carlos, laura, LocalDate.now().plusDays(3), LocalTime.of(9, 0),
                "Control de medicina general", EstadoCita.PROGRAMADA, "Traer resultados anteriores.");
        cita(carlos, laura, LocalDate.now().minusDays(12), LocalTime.of(15, 30),
                "Revisión de exámenes", EstadoCita.ATENDIDA, "Se explicó el resultado al paciente.");
        cita(andrea, laura, LocalDate.now().plusDays(5), LocalTime.of(11, 0),
                "Valoración inicial", EstadoCita.PROGRAMADA, null);
    }

    private Usuario cuenta(String nombreUsuario, String correo, String password, Rol rol) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setCorreo(correo);
        usuario.setPasswordHash(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuario.setActivo(true);
        return usuarios.save(usuario);
    }

    private Medico medico() {
        Medico medico = new Medico();
        medico.setNombres("Laura");
        medico.setApellidos("Gómez Ríos");
        medico.setCedula("1020304050");
        medico.setEspecialidad("Medicina general");
        medico.setTelefono("3001234567");
        medico.setCorreo("laura.gomez@clinicapiedraazul.test");
        medico.setDireccion("Calle 5 # 4-20, Popayán");
        medico.setEstado(EstadoPersona.ACTIVO);
        return medicos.save(medico);
    }

    private Paciente paciente(
            String nombres,
            String apellidos,
            String cedula,
            LocalDate nacimiento,
            String telefono,
            String correo,
            String direccion,
            String nombreUsuario,
            String password) {
        Usuario usuario = cuenta(nombreUsuario, correo, password, Rol.PACIENTE);
        Paciente paciente = new Paciente();
        paciente.setNombres(nombres);
        paciente.setApellidos(apellidos);
        paciente.setCedula(cedula);
        paciente.setFechaNacimiento(nacimiento);
        paciente.setTelefono(telefono);
        paciente.setCorreo(correo);
        paciente.setDireccion(direccion);
        paciente.setEstado(EstadoPersona.ACTIVO);
        paciente.setUsuario(usuario);
        return pacientes.save(paciente);
    }

    private void cita(
            Paciente paciente,
            Medico medico,
            LocalDate fecha,
            LocalTime hora,
            String motivo,
            EstadoCita estado,
            String observaciones) {
        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFecha(fecha);
        cita.setHora(hora);
        cita.setMotivo(motivo);
        cita.setEstado(estado);
        cita.setObservaciones(observaciones);
        citas.save(cita);
    }
}
