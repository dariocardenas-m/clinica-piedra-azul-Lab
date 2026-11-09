# Clínica Piedra Azul

Aplicación web académica para gestionar información básica de una clínica. Incluye un directorio público de médicos, inicio de sesión y funciones de administración para médicos, pacientes y citas. Los pacientes pueden consultar sus propias citas.

## Información académica

- **Materia:** Laboratorio de Software III
- **Universidad:** Universidad del Cauca
- **Periodo académico:** 2026-2
- **Autores:** Carlos Eduardo Dorado Joaqui y Dario Alexander Cardenas Guerrero

## Tecnologías

- **Frontend:** Angular 22, TypeScript, HTML y CSS.
- **Backend:** Java 21, Spring Boot 3.5, API REST, Spring Security y JWT.
- **Base de datos:** MySQL 8; Spring Data JPA/Hibernate crea las tablas.
- **Herramientas:** Visual Studio Code, Node.js/npm y Maven Wrapper incluido (`mvnw.cmd`).

## Requisitos

- JDK 21. Comprueba la versión en una terminal: `java -version`.
- Node.js y npm. Comprueba con `node -v` y `npm -v`.
- MySQL 8 en ejecución y acceso a una cuenta que pueda crear la base de datos.
- Visual Studio Code (opcional, recomendado para abrir y editar el proyecto).

> El proyecto compila con Java 21 (`backend/pom.xml`). Java 20 o anterior no sirve. No es necesario instalar Maven por separado: se usa el wrapper incluido.

## Preparar la base de datos

1. Abre `database/01-crear-base.sql` en MySQL Workbench y ejecútalo. Crea la base `clinica_piedra_azul`; las tablas se generan al iniciar el backend.
2. En MySQL Workbench, revisa el puerto de tu conexión (comúnmente `3306`).
3. En una terminal, crea la configuración local a partir del ejemplo:

   ```powershell
   Copy-Item backend/application-local.properties.example backend/application-local.properties
   ```

4. Edita `backend/application-local.properties`: configura el puerto, usuario y contraseña de MySQL, y reemplaza el secreto JWT por una cadena propia de al menos 32 caracteres. El archivo local está excluido de Git; no compartas sus credenciales.

## Ejecutar desde Visual Studio Code

Abre en VS Code la carpeta `clinica-piedra-azul` (la que contiene este README, `backend`, `frontend` y `database`). Inicia los servicios de MySQL y abre dos terminales integradas.

**Terminal 1 — backend** (PowerShell):

```powershell
cd backend
\.\mvnw.cmd spring-boot:run
```

Si abriste la terminal en la raíz del proyecto, usa `cd backend` antes del comando.

**Terminal 2 — frontend:**

```powershell
cd frontend
npm install
npm start
```

Cuando ambos procesos estén iniciados, abre <http://localhost:4200>. La API queda en <http://localhost:8080>; el endpoint de estado es <http://localhost:8080/api/salud>.

Para detener cada servidor, vuelve a su terminal y pulsa `Ctrl+C`.

## Problemas comunes

- **Error de conexión a MySQL:** confirma que el servicio esté iniciado y que el puerto, usuario y contraseña de `application-local.properties` coincidan con MySQL Workbench. Si tu servidor usa `3307` u otro puerto, actualiza también la URL allí.
- **Error de Java o compilación:** instala/configura JDK 21 y revisa que `java -version` muestre esa versión. Reinicia VS Code después de cambiar `JAVA_HOME` o `PATH`.
- **No abre la página o no carga datos:** comprueba que backend y frontend sigan ejecutándose en sus terminales; el frontend necesita la API y MySQL.
- **El puerto está ocupado:** cierra el proceso que ya usa el puerto o cambia el puerto de la aplicación antes de iniciarla.

## Estructura

```text
backend/        API Spring Boot, configuración local y Maven Wrapper
frontend/       Aplicación Angular
database/       Script para crear la base de datos
documentation/  Arquitectura, material de sustentación, resultados y colección Postman
```

## Documentación adicional

- `documentation/arquitectura.md`: descripción de la arquitectura.
- `documentation/banco-preguntas.md`: material de apoyo para la sustentación.
- `documentation/resultados-pruebas.md`: resultados documentados.
- `documentation/postman/Clinica-Piedra-Azul.postman_collection.json`: colección para probar la API.
