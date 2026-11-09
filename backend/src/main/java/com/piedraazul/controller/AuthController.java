package com.piedraazul.controller;

import com.piedraazul.dto.LoginRespuesta;
import com.piedraazul.dto.LoginSolicitud;
import com.piedraazul.dto.PerfilRespuesta;
import com.piedraazul.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginRespuesta login(@Valid @RequestBody LoginSolicitud solicitud) {
        return authService.login(solicitud);
    }

    @GetMapping("/yo")
    public PerfilRespuesta yo() {
        return authService.perfil();
    }
}
