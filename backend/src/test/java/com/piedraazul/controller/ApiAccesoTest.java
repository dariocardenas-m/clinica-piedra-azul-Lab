package com.piedraazul.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.piedraazul.dto.LoginSolicitud;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class ApiAccesoTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper json;

    @Test
    void loginCorrectoDevuelveToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(
                                new LoginSolicitud("admin@clinicapiedraazul.test", "Admin123*"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("ADMIN"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void loginIncorrectoResponde401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(
                                new LoginSolicitud("admin@clinicapiedraazul.test", "clave-mala"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void medicosPublicosNoExigenToken() throws Exception {
        mockMvc.perform(get("/api/medicos/publicos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].especialidad").value("Medicina general"))
                .andExpect(jsonPath("$[0].cedula").doesNotExist());
    }

    @Test
    void listarMedicosSinTokenResponde401() throws Exception {
        mockMvc.perform(get("/api/medicos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void pacienteNoListaMedicosAdministrativos() throws Exception {
        mockMvc.perform(get("/api/medicos").header("Authorization", "Bearer " + tokenPaciente()))
                .andExpect(status().isForbidden());
    }

    @Test
    void pacienteSoloVeSusCitas() throws Exception {
        mockMvc.perform(get("/api/citas/mis-citas").header("Authorization", "Bearer " + tokenPaciente()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$[0].paciente").value("Carlos Pérez Díaz"))
                .andExpect(jsonPath("$[?(@.paciente == 'Andrea Ruiz Mora')]").isEmpty());
    }

    @Test
    void pacienteNoListaTodasLasCitas() throws Exception {
        mockMvc.perform(get("/api/citas").header("Authorization", "Bearer " + tokenPaciente()))
                .andExpect(status().isForbidden());
    }

    @Test
    void administradorListaTodasLasCitas() throws Exception {
        mockMvc.perform(get("/api/citas").header("Authorization", "Bearer " + tokenAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(3)));
    }

    private String tokenAdmin() throws Exception {
        return token("admin@clinicapiedraazul.test", "Admin123*");
    }

    private String tokenPaciente() throws Exception {
        return token("carlos.perez@clinicapiedraazul.test", "Paciente123*");
    }

    private String token(String correo, String password) throws Exception {
        MvcResult resultado = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(new LoginSolicitud(correo, password))))
                .andExpect(status().isOk())
                .andReturn();
        return json.readTree(resultado.getResponse().getContentAsString()).get("token").asText();
    }
}
