package com.piedraazul.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Prueba de rebanada web: levanta únicamente el controlador, sin MySQL y sin
 * los filtros de Spring Security. Comprueba el contrato de GET /api/salud.
 */
@WebMvcTest(
        controllers = SaludController.class,
        excludeAutoConfiguration = UserDetailsServiceAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class SaludControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void saludRespondeEstadoOperativo() throws Exception {
        mockMvc.perform(get("/api/salud"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.aplicacion").value("Clínica Piedra Azul"))
                .andExpect(jsonPath("$.estado").value("operativa"));
    }
}
