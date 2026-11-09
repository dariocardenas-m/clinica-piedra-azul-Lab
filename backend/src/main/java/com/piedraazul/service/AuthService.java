package com.piedraazul.service;

import com.piedraazul.dto.LoginRespuesta;
import com.piedraazul.dto.LoginSolicitud;
import com.piedraazul.dto.PerfilRespuesta;
import com.piedraazul.entity.Usuario;
import com.piedraazul.exception.ExcepcionNegocio;
import com.piedraazul.repository.PacienteRepository;
import com.piedraazul.repository.UsuarioRepository;
import com.piedraazul.security.JwtService;
import com.piedraazul.security.UsuarioDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarios;
    private final PacienteRepository pacientes;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarios,
            PacienteRepository pacientes) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarios = usuarios;
        this.pacientes = pacientes;
    }

    public LoginRespuesta login(LoginSolicitud solicitud) {
        try {
            Authentication autenticacion = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(solicitud.correo().trim().toLowerCase(), solicitud.password()));
            Usuario usuario = ((UsuarioDetails) autenticacion.getPrincipal()).getUsuario();
            return new LoginRespuesta(
                    jwtService.generar(usuario),
                    "Bearer",
                    usuario.getCorreo(),
                    usuario.getRol().name(),
                    usuario.getNombreUsuario());
        } catch (DisabledException ex) {
            throw new ExcepcionNegocio(HttpStatus.UNAUTHORIZED, "La cuenta está inactiva.");
        } catch (AuthenticationException ex) {
            throw new ExcepcionNegocio(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
        }
    }

    public PerfilRespuesta perfil() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarios.findByCorreo(correo)
                .orElseThrow(() -> new ExcepcionNegocio(HttpStatus.UNAUTHORIZED, "La sesión no es válida."));
        String nombres = null;
        String apellidos = null;
        var paciente = pacientes.findByUsuarioCorreo(correo);
        if (paciente.isPresent()) {
            nombres = paciente.get().getNombres();
            apellidos = paciente.get().getApellidos();
        }
        return new PerfilRespuesta(
                usuario.getId(), usuario.getNombreUsuario(), usuario.getCorreo(), usuario.getRol().name(), nombres, apellidos);
    }
}
