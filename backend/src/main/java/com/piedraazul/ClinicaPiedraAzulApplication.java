package com.piedraazul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada del backend.
 * <p>
 * {@code @SpringBootApplication} activa tres cosas a la vez: la configuración
 * automática de Spring Boot, el registro de componentes ({@code @Component},
 * {@code @Service}, {@code @RestController}) y los repositorios JPA que estén
 * dentro del paquete {@code com.piedraazul} o de sus subpaquetes.
 */
@SpringBootApplication
public class ClinicaPiedraAzulApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicaPiedraAzulApplication.class, args);
    }
}
