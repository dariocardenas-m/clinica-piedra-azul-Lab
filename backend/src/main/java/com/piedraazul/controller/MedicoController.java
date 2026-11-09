package com.piedraazul.controller;

import com.piedraazul.dto.CedulaRespuesta;
import com.piedraazul.dto.MedicoPublicoRespuesta;
import com.piedraazul.dto.MedicoRespuesta;
import com.piedraazul.dto.MedicoSolicitud;
import com.piedraazul.service.CedulaService;
import com.piedraazul.service.MedicoService;
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
@RequestMapping("/api/medicos")
public class MedicoController {

    private final MedicoService medicoService;
    private final CedulaService cedulaService;

    public MedicoController(MedicoService medicoService, CedulaService cedulaService) {
        this.medicoService = medicoService;
        this.cedulaService = cedulaService;
    }

    @GetMapping("/publicos")
    public List<MedicoPublicoRespuesta> publicos() {
        return medicoService.listarPublicos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicoRespuesta registrar(@Valid @RequestBody MedicoSolicitud solicitud) {
        return medicoService.registrar(solicitud);
    }

    @GetMapping
    public List<MedicoRespuesta> listar() {
        return medicoService.listar();
    }

    @GetMapping("/verificar-cedula")
    public CedulaRespuesta verificarCedula(@RequestParam String cedula) {
        return cedulaService.consultar(cedula);
    }
}
