# Etapa 1. Preparación y diagnóstico

Universidad del Cauca · Laboratorio de Ingeniería del Software III · Clínica Piedra Azul

> El proyecto ya está completo. Este documento conserva cómo se preparó el entorno. La arquitectura, la seguridad, la interfaz y las pruebas están en `arquitectura.md`, `guion-sustentacion.md`, `banco-preguntas.md` y `resultados-pruebas.md`. El README de la raíz explica cómo ejecutar todo.

## Objetivo

Dejar un proyecto vacío de reglas de negocio, pero ejecutable: comprobar las herramientas, fijar versiones compatibles con el enunciado, crear la estructura de carpetas y demostrar que Spring Boot y Angular arrancan y pueden hablar entre sí.

## Problema que resuelve

Sin esta etapa no hay un lugar donde escribir el resto del sistema, ni una forma de saber si Java, Angular y MySQL pueden trabajar juntos en este computador. Resolverlo ahora evita descubrir, a mitad de la autenticación o de los formularios, que una versión es incompatible.

## Tecnologías y por qué estas versiones

El enunciado obliga a usar Java 21, Spring Boot 3.x, Angular, MySQL 8 y Maven.

En este equipo el JDK instalado es **Java 23.0.2**, no Java 21. No hay otro JDK. Spring Boot 3.5 admite ejecutar la aplicación sobre Java 23 y, al mismo tiempo, compilar el código como Java 21. Por eso `pom.xml` contiene:

```xml
<java.version>21</java.version>
```

El padre de Spring Boot convierte esa propiedad en el argumento de compilación `release 21`. El código fuente debe limitarse a lo que existe en Java 21. La máquina virtual que lo ejecuta puede ser la 23, porque una JVM más nueva puede correr bytecode más antiguo.

Si en la sustentación preguntan “¿por qué no instalaste Java 21?”, la respuesta precisa es: el objetivo de compilación es Java 21, que es el requisito del enunciado; la JVM disponible es la 23 y Spring Boot 3.5.16 la soporta. Instalar Temurin 21 y cambiar `JAVA_HOME` no obliga a modificar el código.

**Spring Boot 3.5.16** es la última versión estable de la rama 3. El sitio start.spring.io, en octubre de 2026, ya solo genera Spring Boot 4. El enunciado pide 3.x, así que el `pom.xml` se escribió a mano y las dependencias las administra el BOM de Spring Boot. No se fijaron versiones sueltas de Spring Web, Security, JPA o Hibernate: el padre se encarga de que sean compatibles entre sí.

**Angular 22.1** y **Angular CLI 22.1.8** son los que ya estaban instalados, junto con **Node.js 24.21.0**. El enunciado pide una versión estable compatible con las herramientas del equipo. No se bajó el CLI a una versión vieja.

**MySQL 8** está instalado como servicio de Windows `MySQL80`, escuchando en el puerto 3306. El comando `mysql` no está en el PATH. Para la administración se usa MySQL Workbench, o el ejecutable:

`C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

Maven no está instalado de forma global. El proyecto trae **Maven Wrapper** (`mvnw.cmd`). La primera ejecución descarga Maven 3.9.11. Así el README no depende de que cada computador tenga la misma instalación de Maven.

## Archivos creados y responsabilidad de cada uno

### Raíz

- `README.md`: cómo instalar, configurar y ejecutar.
- `.gitignore`: excluye `node_modules`, `target` y el archivo local de contraseña.

### Base de datos

- `database/01-crear-base.sql`: crea la base `clinica_piedra_azul` con `utf8mb4`. No crea tablas. Hibernate lo hará cuando existan entidades, mediante `spring.jpa.hibernate.ddl-auto=update`.

### Backend

- `pom.xml`: identidad del proyecto y dependencias. Web para la API REST, Security para proteger rutas, Data JPA e Hibernate para MySQL, Validation para las anotaciones que vendrán, el conector de MySQL y Lombok para reducir código repetitivo en las entidades.
- `mvnw.cmd` y `.mvn/wrapper/`: permiten ejecutar Maven sin instalarlo.
- `ClinicaPiedraAzulApplication.java`: método `main`. La anotación `@SpringBootApplication` busca componentes dentro de `com.piedraazul`.
- `application.properties`: puerto 8080, URL de MySQL, usuario y la indicación de que la contraseña viene de una variable de entorno. No contiene secretos.
- `application-local.properties.example`: plantilla que cada persona copia y completa. El archivo real se llama `application-local.properties` y Git lo ignora.
- `ejecutar.ps1`: asigna `JAVA_HOME` si falta y no arranca si no hay contraseña configurada.
- `config/SecurityConfig.java`: deja pública solo `GET /api/salud` y exige autenticación en cualquier otra ruta. Desactiva CSRF, la sesión de servidor y el usuario anónimo. Sin el usuario anónimo, una ruta privada sin token responde 401; si se deja activo, Spring Security responde 403.
- `config/CorsConfig.java`: autoriza a `http://localhost:4200` y a `http://127.0.0.1:4200` a consumir `/api/**`.
- `config/VerificacionConexion.java`: al terminar de crear el contexto, abre una conexión JDBC. Si MySQL la rechaza, detiene la aplicación con un mensaje explícito. Hace falta porque, si el dialecto ya está configurado, Hibernate solo advierte y dejaría Tomcat encendido.
- `controller/SaludController.java`: diagnóstico HTTP. No toca la base de datos.
- `dto/SaludRespuesta.java`: forma del JSON de salida. Es un `record` de Java, no una tabla.
- `controller/SaludControllerTest.java`: prueba de rebanada. Levanta solo la capa web.
- Los `package-info.java` de `entity`, `repository`, `service`, `security`, `exception` y `util` reservan la arquitectura por capas. Todavía no tienen clases de negocio. Su comentario dice qué irá en cada paquete y en qué etapa.

### Frontend

- Proyecto generado con `ng new`: enrutador activado, estilos SCSS, sin SSR y con nombres de archivo del estilo `app.component.ts`.
- `src/app/app.config.ts`: registra el enrutador y `provideHttpClient()`, que es la forma actual de habilitar `HttpClient`.
- `src/app/core/api.config.ts`: URL del backend.
- `src/app/core/salud.service.ts`: un servicio que hace `GET /api/salud` y devuelve un `Observable`.
- `src/app/app.component.*`: pantalla de arranque. Muestra el nombre de la clínica y el resultado de esa petición.
- `src/styles.scss`: variables de la paleta médica. Las pantallas posteriores deben reutilizarlas, no inventar colores nuevos en cada página.

## Cómo se relacionan las capas en esta etapa

La petición del navegador sigue este camino:

1. Angular crea `SaludService` gracias a `providedIn: 'root'`.
2. El servicio usa `HttpClient` para pedir `http://localhost:8080/api/salud`.
3. El navegador envía primero, si hace falta, una petición OPTIONS. Spring Security consulta `CorsConfig` y la autoriza.
4. `SecurityConfig` ve que la ruta es pública y deja pasar el GET.
5. `SaludController` construye un `SaludRespuesta`.
6. Spring Web lo serializa a JSON.
7. Angular recibe el observable, la plantilla lo muestra con `async`, y `catchError` cubre el caso en el que el backend esté apagado.

No intervienen servicio de negocio, repositorio ni MySQL. El diagnóstico existe precisamente para separar “¿el servidor web arrancó?” de “¿la base de datos aceptó la conexión?”. La conexión a MySQL se exige al arrancar la aplicación, porque Spring Boot inicializa el pool de conexiones antes de atender peticiones. Si la clave es incorrecta o la base no existe, el proceso termina y `/api/salud` tampoco queda disponible.

## Decisiones que hay que poder defender

**¿Por qué la contraseña no está en `application.properties`?** Porque ese archivo se versiona. Una clave escrita ahí quedaría en Git. La contraseña vive en una variable de entorno o en `application-local.properties`, que está en `.gitignore`.

**¿Por qué ya hay Spring Security si JWT es de la etapa 3?** Porque la dependencia ya está declarada. Si no se configura, Spring Security bloquea todas las rutas y genera una contraseña aleatoria. La configuración actual es pequeña y explícita: solo el diagnóstico es público. Cualquier otra ruta responde 401. Eso ya ilustra la diferencia entre una ruta pública y una ruta privada, aunque los roles lleguen después.

**¿Por qué se desactiva CSRF?** CSRF protege sesiones basadas en cookies del navegador. Esta API no usará sesión de servidor: el cliente enviará un JWT en el encabezado `Authorization`. Ese modelo se completa en la etapa 3. Dejar CSRF activo impediría los POST desde Angular sin agregar un token que el diseño no usa.

**¿Por qué `ddl-auto=update`?** En desarrollo, Hibernate crea o ajusta tablas al ver las entidades. En esta etapa no hay entidades, así que no crea tablas. No se usa `create-drop` porque borraría datos cada vez que se apaga el servidor. En un entorno real de producción normalmente no se delega el esquema a Hibernate; para el laboratorio es la opción que permite explicar el mapeo objeto-relacional sin mantener un script de tablas duplicado.

**¿Por qué la pantalla de inicio no está dividida en átomos?** Atomic Design es obligatorio, pero corresponde a la etapa 4. Hacer ahora botones, tablas y plantillas sin páginas reales produciría componentes que todavía no tienen una función que demostrar. La pantalla actual es temporal y será reemplazada por las páginas pedidas, reutilizando la paleta definida en `styles.scss`.

## Cómo probarlo

1. Ejecutar `database/01-crear-base.sql` en MySQL Workbench.
2. Crear `backend/application-local.properties` con la contraseña real.
3. En `backend`: `$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"` y `.\mvnw.cmd test`.
4. En `backend`: `.\ejecutar.ps1`. Si la contraseña falta o es incorrecta, el proceso termina. El mensaje esperado incluye `No fue posible conectar con MySQL`.
5. Con el backend en marcha, abrir `http://localhost:8080/api/salud`. Debe responder 200. Abrir `http://localhost:8080/api/medicos` sin token. Debe responder 401.
6. En `frontend`: `npm start` y abrir `http://localhost:4200`. La tarjeta debe mostrar el mensaje del backend.
7. Detener el backend y recargar el frontend: la página sigue visible y explica que no hubo conexión.

## Resultado observado en este equipo

Estas comprobaciones sí se ejecutaron:

- `.\mvnw.cmd test`: 3 pruebas, 0 fallos. Incluyen `GET /api/salud` con 200 y `GET /api/medicos` sin token con 401.
- El bytecode compilado tiene major version 65, que corresponde a Java 21.
- Con el backend temporalmente en marcha, `GET /api/salud` respondió 200 y `GET /api/medicos` respondió 401. Una versión anterior de la seguridad respondía 403; se corrigió desactivando la autenticación anónima.
- Angular en `http://localhost:4200` mostró “El backend Spring Boot responde correctamente” mientras el backend estaba en marcha.
- Con el backend detenido, la misma página permanece visible y muestra: “El backend no respondió. Revisa la contraseña de MySQL, inicia Spring Boot en el puerto 8080 y recarga esta página.” El estado indicado es `sin-conexion`.
- `npx ng test --watch=false`: 2 pruebas, 0 fallos.
- Sin contraseña de MySQL, `spring-boot:run` termina con código 1. La causa registrada es `Access denied for user 'root'@'localhost' (using password: NO)` y la aplicación informa `No fue posible conectar con MySQL`.
- Con la contraseña local escrita solo en `backend/application-local.properties`, la base `clinica_piedra_azul` quedó creada y el backend permaneció en marcha. `GET /api/salud` respondió 200 y `GET /api/medicos` sin token respondió 401. La base todavía no tiene tablas: Hibernate las creará en la etapa 2.

## Preguntas que puede hacer el profesor sobre esta etapa

1. ¿Qué significa que el proyecto compile con release 21 y se ejecute en una JVM 23?
2. ¿Por qué no se usó start.spring.io directamente?
3. ¿Qué hace `@SpringBootApplication`?
4. ¿Por qué el controlador devuelve un DTO y no un `Map` suelto o una entidad?
5. ¿Qué ocurre con una ruta distinta de `/api/salud` si todavía no hay login?
6. ¿Por qué Angular y Spring Boot usan puertos distintos y qué problema resuelve CORS?
7. ¿Dónde quedaría una contraseña si alguien la escribe en `application.properties` y hace commit?
8. ¿Qué diferencia hay entre la prueba `@WebMvcTest` y arrancar la aplicación completa?
9. ¿Por qué `HttpClient` devuelve un `Observable` y qué hace `catchError` en la pantalla de inicio?
10. ¿Qué carpeta tendrá, en las etapas siguientes, el filtro que lee el JWT?

Las respuestas están en las secciones anteriores de este documento y en los comentarios de las clases citadas. Conviene recorrer el código mientras se responde, no memorizar el texto.
