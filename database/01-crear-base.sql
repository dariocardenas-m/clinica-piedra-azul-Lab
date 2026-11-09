-- Clínica Piedra Azul
-- Etapa 1: crear la base de datos.
--
-- Cómo ejecutarlo:
-- 1. Abre MySQL Workbench.
-- 2. Conéctate con el usuario administrador de tu instalación local (normalmente root).
-- 3. Abre este archivo y ejecútalo completo.
--
-- No crea tablas. Hibernate las generará en la etapa 2, cuando existan las entidades.
-- No crea usuarios de la aplicación (administrador y paciente). Eso corresponde a la etapa 2.

CREATE DATABASE IF NOT EXISTS clinica_piedra_azul
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE clinica_piedra_azul;
