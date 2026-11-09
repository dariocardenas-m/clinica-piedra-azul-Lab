package com.piedraazul.controller;

import com.piedraazul.dto.SaludRespuesta;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Diagnóstico público para comprobar que el proceso Spring Boot está en marcha.
 * No consulta la base de datos y no sustituye los endpoints de negocio.
 */
@RestController
@RequestMapping("/api/salud")
public class SaludController {

    @GetMapping
    public SaludRespuesta consultar() {
        return new SaludRespuesta(
                "Clínica Piedra Azul",
                "operativa",
                "El backend Spring Boot responde correctamente.");
    }
}
