package com.piedraazul.controller;

import com.piedraazul.dto.CedulaRespuesta;
import com.piedraazul.dto.PacienteRespuesta;
import com.piedraazul.dto.PacienteSolicitud;
import com.piedraazul.service.CedulaService;
import com.piedraazul.service.PacienteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;
    private final CedulaService cedulaService;

    public PacienteController(PacienteService pacienteService, CedulaService cedulaService) {
        this.pacienteService = pacienteService;
        this.cedulaService = cedulaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteRespuesta registrar(@Valid @RequestBody PacienteSolicitud solicitud) {
        return pacienteService.registrar(solicitud);
    }

    @GetMapping
    public List<PacienteRespuesta> listar() {
        return pacienteService.listar();
    }

    @GetMapping("/verificar-cedula")
    public CedulaRespuesta verificarCedula(@RequestParam String cedula) {
        return cedulaService.consultar(cedula);
    }
}
