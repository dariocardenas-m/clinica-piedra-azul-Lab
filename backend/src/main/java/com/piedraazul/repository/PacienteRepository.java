package com.piedraazul.repository;

import com.piedraazul.entity.Paciente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    boolean existsByCedula(String cedula);

    boolean existsByCorreo(String correo);

    Optional<Paciente> findByUsuarioCorreo(String correo);
}
