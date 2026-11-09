# Banco de preguntas

Respuestas cortas, atadas a este proyecto. Sirven para estudiar la sustentación.

## Arquitectura

1. **¿Por qué el controlador no devuelve la entidad `Usuario`?** Porque la entidad contiene `passwordHash`. El login devuelve `LoginRespuesta` y el perfil devuelve `PerfilRespuesta`. El hash no sale de la API.

2. **¿Qué hace cada capa cuando se registra un médico?** `MedicoController` valida el DTO con `@Valid`. `MedicoService` revisa cédula y correo. `MedicoRepository` inserta. Si la base detecta un duplicado que el servicio no alcanzó a ver, el manejador convierte la violación de integridad en 409.

3. **¿Por qué hay DTO público y DTO administrativo para el médico?** `MedicoPublicoRespuesta` solo tiene id, nombres, apellidos y especialidad. `MedicoRespuesta` incluye cédula, teléfono, correo, dirección y estado. Así el directorio no puede filtrar datos por un descuido del frontend.

4. **¿Quién crea las tablas?** Hibernate, con `ddl-auto=update`, a partir de las entidades. El script SQL solo crea la base `clinica_piedra_azul`.

5. **¿Qué relación hay entre usuario y paciente?** Uno a uno. `Paciente` apunta a un `Usuario` con `usuario_id` único. El rol de esa cuenta es `PACIENTE`. El médico no tiene usuario.

## Seguridad

6. **¿Dónde se guarda la contraseña y con qué algoritmo?** En `usuarios.password_hash`, con BCrypt. El encoder es el bean `BCryptPasswordEncoder` de `SecurityConfig`.

7. **¿Qué viaja dentro del JWT?** El correo en `sub`, el rol y el id de usuario. Lo firma HMAC SHA-256 con el secreto de `app.jwt.secret`. Vence a las dos horas.

8. **¿Por qué el secreto no está en `application.properties`?** Ese archivo sí se versiona. El valor real está en `application-local.properties`, ignorado por Git, o en la variable `JWT_SECRET`. `JwtService` no arranca si el secreto tiene menos de 32 caracteres.

9. **¿Por qué una ruta privada sin token responde 401 y no 403?** Porque se desactivó el usuario anónimo. Sin autenticación, el `authenticationEntryPoint` responde 401. El 403 queda para un token válido con el rol incorrecto.

10. **¿Por qué `/api/medicos` y `/api/medicos/**` aparecen las dos?** En Spring Security el patrón `/**` no cubre la ruta exacta de la colección. Si solo estuviera el comodín, `GET /api/medicos` quedaría apenas “autenticado” y un paciente podría listar los datos completos.

11. **¿Cómo se evita que un paciente pida las citas de otro?** `GET /api/citas/mis-citas` no recibe el id del paciente. `CitaService.listarPropias` toma el correo de `SecurityContextHolder` y busca las citas de ese correo.

12. **¿Qué pasa si el administrador llama a mis citas?** La regla exige `PACIENTE`. El administrador recibe 403. El paciente que llama a `GET /api/citas` también recibe 403.

13. **¿El filtro JWT rechaza el directorio público si alguien manda un token dañado?** No. Si el token no es válido, el filtro limpia el contexto y deja seguir la cadena. La ruta pública no exige autenticación. La ruta privada, ya sin autenticación, responde 401.

14. **¿Dónde se agrega el token en Angular y dónde no?** En `auth.interceptor.ts`. Lo agrega si hay token y la URL no contiene `/api/auth/login`, `/api/medicos/publicos` ni `/api/salud`.

15. **¿Cómo se evita un ciclo de redirección en el login?** El 401 solo limpia la sesión y navega a `/ingreso` cuando la petición no es el login y la página actual no es `/ingreso`. Un correo o una clave malos se quedan en el formulario y muestran el mensaje del backend.

16. **¿Qué diferencia hay entre `AuthGuard` y `RoleGuard`?** La primera solo pregunta si hay un token vigente. La segunda compara el rol del payload con `data.roles` de la ruta. Un paciente autenticado pasa la primera y falla la segunda en `/gestion/medicos`.

17. **¿El rol del menú es una autorización?** No. Sale del payload para ocultar enlaces. Alguien puede editar `sessionStorage` y ver el menú de administrador, pero cada petición privada vuelve a verificar la firma y el rol en Spring. Por eso la prueba de 403 se hace contra el backend.

## Reglas de negocio

18. **¿Cuándo responde 409 una cédula?** Cuando ya existe en `medicos` o en `pacientes`. La revisión está en `CedulaService`, así que registrar un paciente con la cédula de Laura también falla.

19. **¿Qué operadores de RxJS usa la cédula y para qué?** `debounceTime(400)` espera a que la persona deje de escribir. `distinctUntilChanged` no repite la misma consulta. `switchMap` cancela la petición anterior si el número cambia.

20. **¿Por qué el botón de registrar sigue deshabilitado mientras se consulta la cédula?** El formulario está `pending` durante el validador asíncrono. El botón usa `form.invalid || form.pending`.

21. **¿Qué impide dos citas del mismo médico a la misma hora?** La consulta del servicio y la restricción única `uk_cita_medico_horario` sobre `medico_id`, `fecha` y `hora`. La API responde 409 con el mensaje de horario ocupado. Dos pacientes sí pueden atenderse a la misma hora con médicos distintos.

22. **¿Se puede crear una cita en una fecha pasada?** Sí. El DTO acepta cualquier fecha. La cita histórica de Carlos, atendida hace doce días, la inserta `DatosIniciales` para que el panel tenga historial. El formulario también permite esa fecha porque la regla del enunciado limita el horario duplicado, no el calendario.

23. **¿Qué ocurre si el paciente o el médico están inactivos?** `CitaService` rechaza la cita. El formulario de citas solo ofrece personas en estado `ACTIVO`.

24. **¿La contraseña del paciente se confirma en el servidor?** No. `clavesIguales` compara los dos campos en el formulario. Al servidor viaja una sola clave, con longitud entre 8 y 72 caracteres, y allá se transforma con BCrypt.

## Interfaz

25. **¿Cuál es el átomo reutilizable de la rúbrica y cuál es la molécula?** El átomo es `app-table`. La molécula es `app-table-section`: título, resumen y esa tabla. La usan el listado de médicos, el de pacientes y el de citas.

26. **¿Qué cambia entre el listado administrativo de citas y “Mis citas”?** El mismo organismo `app-appointment-list` recibe `alcance`. Con `todas` llama a `/api/citas`. Con `propias` llama a `/api/citas/mis-citas`. Las columnas se arman en `ngOnInit` porque el valor de la entrada todavía no existe en el inicializador del campo.

27. **¿Por qué los selectores de nueva cita usan `toSignal`?** El proyecto no carga Zone.js. Asignar un arreglo dentro de `subscribe` actualiza el objeto y no la vista. `toSignal` avisa a la plantilla cuando llega la lista.

28. **¿Dónde está la animación?** Al cambiar de página, el enrutador usa `withViewTransitions()` y `styles.scss` define `salir-pagina` y `entrar`. Las filas de las tablas entran en cascada con `entrar-fila`. Al pasar el cursor, botones, menú, tarjetas de resumen y filas cambian con `transition`. Mientras carga, el punto de `.cargando` usa `pulso`.

29. **¿Qué pasa bajo 800 px?** `.cuerpo` pasa a una columna, el menú queda horizontal con desplazamiento y los formularios `.dos-columnas` pasan a una columna. El encabezado apila la marca y la sesión.

## Datos y pruebas

30. **¿Por qué al reiniciar el backend no se duplican Carlos y Laura?** `DatosIniciales` sale de inmediato si ya existe `admin@clinicapiedraazul.test`.

31. **¿Qué prueba que Carlos no ve las citas de Andrea?** `ApiAccesoTest` pide mis citas con el token de Carlos y comprueba que el nombre de Andrea no está. En la interfaz, “Mis citas” de Carlos muestra solo sus filas.

32. **¿Qué códigos se midieron en este computador?** Login correcto 200, clave mala 401, directorio público 200, alta de médico y de paciente 201, cédula repetida 409, cita creada 201, horario repetido 409, colección privada sin token 401 y token de paciente sobre `/api/medicos` 403. El detalle está en `resultados-pruebas.md`.

33. **¿Por qué el directorio de pacientes no es público?** La guía de roles y la primera página piden el directorio de médicos. Una tabla posterior marca pacientes como públicos. Publicarlos expondría cédula y correo. `GET /api/pacientes` exige `ADMIN`.

34. **¿Qué hay que decir si el profesor abre el frontend y cambia el rol en el token a mano?** El menú podría cambiar, porque lee el payload sin verificar la firma. La API no acepta ese token: la firma deja de coincidir o el rol firmado sigue siendo el original. La pantalla privada que llame a la API recibirá 401 o 403.
