package com.piedraazul.security;

import com.piedraazul.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarios;

    public UsuarioDetailsService(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) {
        return usuarios.findByCorreo(correo)
                .map(UsuarioDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("No existe una cuenta con ese correo."));
    }
}
