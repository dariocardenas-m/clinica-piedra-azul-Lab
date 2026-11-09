package com.piedraazul.repository;

import com.piedraazul.entity.EstadoPersona;
import com.piedraazul.entity.Medico;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository extends JpaRepository<Medico, Long> {

    boolean existsByCedula(String cedula);

    boolean existsByCorreo(String correo);

    List<Medico> findByEstadoOrderByApellidosAscNombresAsc(EstadoPersona estado);
}
