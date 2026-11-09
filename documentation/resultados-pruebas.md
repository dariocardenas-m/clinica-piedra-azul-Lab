# Resultados de las pruebas

Medidas el 5 de noviembre de 2026 en este computador, con MySQL 8 en el puerto 3306, la API en el 8080 y Angular en el 4200.

## Backend automático

`.\mvnw.cmd test` terminó en `BUILD SUCCESS`.

| Clase | Pruebas |
| --- | --- |
| `SaludControllerTest` | 1 |
| `ApiAccesoTest` | 8 |
| Total | 9, sin fallos |

`ApiAccesoTest` cubre el login del administrador, la contraseña incorrecta en 401, el directorio público sin cédula, `GET /api/medicos` sin token en 401, el mismo listado con token de paciente en 403, las citas de Carlos sin las de Andrea, el listado general de citas con token de paciente en 403 y el listado general con token de administrador.

## API, petición por petición

Estas llamadas se hicieron contra el proceso en ejecución. No se usó la ventana de Postman: la colección de `documentation/postman` reproduce las mismas rutas para importarla en Postman o Thunder Client.

| Petición | Código |
| --- | --- |
| `POST /api/auth/login` administrador | 200, con token y rol `ADMIN` |
| `POST /api/auth/login` Carlos | 200, con rol `PACIENTE` |
| `POST /api/auth/login` con clave incorrecta | 401 |
| `GET /api/medicos/publicos` sin token | 200. Aparece Medicina general y no el campo cédula. |
| `GET /api/medicos` con token de administrador | 200 |
| `GET /api/pacientes` con token de administrador | 200 |
| `GET /api/medicos/verificar-cedula?cedula=1020304050` | 200 y la cédula existe |
| `POST /api/medicos` con la cédula de Laura | 409 |
| `POST /api/medicos` Mateo Quintero, cédula `5566778899` | 201 |
| `POST /api/pacientes` Lucía Noguera | 201 |
| `POST /api/citas` horario libre | 201 |
| `POST /api/citas` mismo médico, fecha y hora | 409 |
| `GET /api/citas` administrador | 200 |
| `GET /api/citas/mis-citas` Carlos | 200, solo sus citas |
| `GET /api/citas` sin token | 401 |
| `GET /api/medicos` con token de Carlos | 403 |
| `GET /api/citas/mis-citas` con token de administrador | 403 |
| `GET /api/pacientes` sin token | 401 |

## Frontend automático

El 9 de noviembre de 2026, `npx ng test --watch=false` terminó con 4 archivos y 12 pruebas en verde:

- creación de la aplicación;
- `AuthGuard`: sin token redirige a `/ingreso` y con token vigente deja pasar;
- `RoleGuard`: sin sesión va al ingreso, el administrador entra a su ruta, el paciente entra a las suyas y el paciente queda fuera de una ruta de administrador (`/panel?aviso=sin-permiso`);
- interceptor: adjunta `Bearer` en rutas privadas, no lo adjunta al directorio público, ante un 401 privado cierra la sesión, un 401 del login no redirige y un 403 muestra el aviso.

## Colección de Postman

`documentation/postman/Clinica-Piedra-Azul.postman_collection.json` incluye las consultas públicas, los accesos por rol, los 401 y los 403, y la carpeta «Escritura del administrador» con registrar médico, registrar paciente, crear cita y repetir el horario. Esa carpeta se ejecuta después del login del administrador. Cada alta genera un sufijo nuevo para no chocar con registros anteriores. La segunda cita del mismo médico, fecha y hora debe responder 409.

## Recorrido en el navegador

| Paso | Resultado |
| --- | --- |
| `/medicos` sin sesión | Tabla con nombre y especialidad. Enlace “Ingresar”. |
| `/gestion/medicos` sin sesión | Redirección a `/ingreso`. El botón sigue deshabilitado hasta que el formulario es válido. |
| Login de Carlos | Panel con Carlos Pérez Díaz, próximas citas e historial. El pie de página identifica el laboratorio. |
| `/mis-citas` como Carlos | Tres citas de Laura Gómez Ríos. No aparece Andrea. |
| `/gestion/medicos` como Carlos | Vuelve a `/panel?aviso=sin-permiso` y muestra “Su rol no puede abrir esa página.” |
| Cerrar sesión | Vuelve a `/ingreso` y borra el token. |
| Login de administrador | Panel con médicos, pacientes, citas y la cita de Andrea. |
| Registrar médico con cédula `1020304050` | “Esta cédula ya está registrada.” |
| Registrar a Elena Vargas por el formulario | Queda en el listado administrativo, con cédula, teléfono y correo. |
| Registrar a Sofía Mora por el formulario | Queda en el listado de pacientes. |
| Crear cita Sofía–Elena el 2026-12-02 a las 10:00 | Queda en el listado de citas. |
| Repetir ese horario | El formulario muestra “El médico ya tiene una cita en esa fecha y hora.” |
| Ancho de 390 px | El logo, el encabezado y el menú se reorganizan. El menú queda en una fila con desplazamiento. El directorio público sigue mostrando solo nombre y especialidad. |

El directorio público también se vio sin sesión, antes de iniciar como administrador. La captura posterior conserva la sesión porque el recorrido continuó en la misma pestaña.
