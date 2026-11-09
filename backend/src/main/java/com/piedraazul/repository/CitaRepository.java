package com.piedraazul.repository;

import com.piedraazul.entity.Cita;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    boolean existsByMedicoIdAndFechaAndHora(Long medicoId, LocalDate fecha, LocalTime hora);

    @Query("""
            select c from Cita c
            join fetch c.paciente p
            join fetch p.usuario
            join fetch c.medico
            order by c.fecha, c.hora
            """)
    List<Cita> findAllConDetalle();

    @Query("""
            select c from Cita c
            join fetch c.medico
            join fetch c.paciente p
            join fetch p.usuario
            where p.usuario.correo = :correo
            order by c.fecha, c.hora
            """)
    List<Cita> findByCorreoPaciente(String correo);
}
