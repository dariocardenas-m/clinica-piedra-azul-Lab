package com.piedraazul.config;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Al arrancar, exige una conexión real con MySQL.
 * <p>
 * Hibernate puede limitarse a advertir que no leyó los metadatos y dejar
 * Tomcat encendido. En ese estado {@code /api/salud} respondería, pero la
 * base no estaría disponible. Esta clase convierte ese caso en un fallo de
 * arranque, con un mensaje que indica qué revisar.
 */
@Component
public class VerificacionConexion implements ApplicationRunner {

    private final DataSource dataSource;

    public VerificacionConexion(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        try (Connection connection = dataSource.getConnection()) {
            if (!connection.isValid(5)) {
                throw new IllegalStateException("MySQL no validó la conexión.");
            }
        } catch (SQLException ex) {
            throw new IllegalStateException(
                    "No fue posible conectar con MySQL. Crea la base clinica_piedra_azul "
                            + "y configura la contraseña en application-local.properties o en la variable DB_PASSWORD.",
                    ex);
        }
    }
}
