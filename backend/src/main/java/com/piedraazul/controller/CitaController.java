package com.piedraazul.controller;

import com.piedraazul.dto.CitaRespuesta;
import com.piedraazul.dto.CitaSolicitud;
import com.piedraazul.service.CitaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CitaRespuesta crear(@Valid @RequestBody CitaSolicitud solicitud) {
        return citaService.crear(solicitud);
    }

    @GetMapping
    public List<CitaRespuesta> listar() {
        return citaService.listarTodas();
    }

    @GetMapping("/mis-citas")
    public List<CitaRespuesta> misCitas() {
        return citaService.listarPropias();
    }
}
