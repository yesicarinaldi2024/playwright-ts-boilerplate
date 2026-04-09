# Plan de Pruebas: Acceso al Sistema (MOD-ACCESO)

**Ref. Documento:** `contexto/Manual SO.pdf`
**Módulo Principal:** Acceso (Autenticación y Sesión)
**Regla de Datos:** Toda credencial e identificador en estas pruebas se consume desde parametrización en código (`.env` o gestor seguro) y nunca de forma explícita en los pasos descriptos.

---

## Submódulo: Login (LOG)

### MOD-ACCESO-LOG-TC-01 | Ingreso exitoso con credenciales válidas
* **Objetivo:** Garantizar que el sistema habilita el ingreso a quien provea datos verificados.
* **Pre-condiciones:**
  - El ambiente de red es accesible.
  - Se cuenta con un par usuario/clave enrolado en el sistema con un estado Activo.
* **Pasos de Acción:**
  1. Ingresar a la URL raíz del login.
  2. Completar el input "Usuario o email" con la cuenta parametrizada.
  3. Completar el input "Contraseña" con su par válido.
  4. Presionar el botón "Iniciar sesión".
* **Resultado Esperado (Validaciones):**
  - **UI:** El flujo no arroja interrupciones visuales en formulario. Redirección final hacia la URL `/dashboard`.
  - **UI:** Renderizado correcto del Drawer Menú a la izquierda y desaparición del layout centrado de login.
  - **API:** Petición HTTP POST a `/auth/login` (o equivalente) responde `200 OK` retornando un Hash/Bearer Token en los Headers/Cookies.

### MOD-ACCESO-LOG-TC-02 | Intento de ingreso con contraseña inválida
* **Objetivo:** Comprobar la negación ante fallos de coincidencia Auth garantizando seguridad de cuentas.
* **Pre-condiciones:** Conocer un usuario válido empadronado.
* **Pasos de Acción:**
  1. Ingresar a la pantalla de Login.
  2. Proveer un mail genuino del `.env`.
  3. Emitir un string random con formato incorrecto en el campo clave.
  4. Presionar "Iniciar sesión".
* **Resultado Esperado (Validaciones):**
  - **UI:** Mensaje de error en pantalla rojo con advertencia de "Credenciales inválidas" o texto equivalente provisto en el manual.
  - **UI:** No ocurre cambio en el pathname del browser (sigue en `/login`).
  - **API:** El intento contra el endpoint devuelve `401 Unauthorized` y previene el seteo de Cookies en el Storage.

### MOD-ACCESO-LOG-TC-03 | Intento de ingreso con usuario inexistente
* **Objetivo:** Impedir fugas de acceso de agentes no reconocidos.
* **Pre-condiciones:** N/A
* **Pasos de Acción:**
  1. Navegar al Login.
  2. Proveer un email inventado random en tiempo de ejecución (`test-not-exist-[timestamp]@mail.com`).
  3. Proveer clave `Testing123!`.
  4. Solicitar Iniciar Sesión.
* **Resultado Esperado (Validaciones):**
  - **UI:** Despacho de feedback frontal alertando que "La cuenta no existe".
  - **API:** `401 Unauthorized` o `404 Not Found` en el servicio de identidades.

### MOD-ACCESO-LOG-TC-04 | Comportamiento frente a campos obligatorios en Blanco
* **Objetivo:** Asegurar validaciones Web-forms (HTML5 / Cliente) para evitar peticiones basura al servidor.
* **Pre-condiciones:** N/A
* **Pasos de Acción:**
  1. Navegar al Login.
  2. Mantener limpios ambos inputs.
  3. Realizar clic directo en submit.
* **Resultado Esperado (Validaciones):**
  - **UI:** TextHelpers rojos debajos de los cajones alertando "El campo es requerido".
  - **API:** El interceptor cancela el disparo. No debe existir evento XHR a la red.

### MOD-ACCESO-LOG-TC-05 | Chequeo de Patrón de Email inválido
* **Objetivo:** Verificar parseo Regex de correos antes del submit.
* **Pre-condiciones:** N/A
* **Pasos de Acción:**
  1. En el Login, enviar una cadena como "usuariosecreto#testing".
  2. Completar contraseña.
  3. Activar submit.
* **Resultado Esperado (Validaciones):**
  - **UI:** Advertencia de "Formato de correo electrónico inválido".

### MOD-ACCESO-LOG-TC-06 | Acceso Denegado por Cuenta Inactiva/Suspendida
* **Objetivo:** La tabla de usuarios marca a alguien inactivo; no debe poder loggear aunque recuerde clave.
* **Pre-condiciones:** El backoffice debe tener un usuario de pruebas y dicho usuario debe tener su 'Estado' en `false`.
* **Pasos de Acción:**
  1. Extraer credenciales suspendidas.
  2. Cursar el Request manual desde UI rellenando imputs autorizados temporalmente desativados.
* **Resultado Esperado (Validaciones):**
  - **UI:** Muestra la traza exacta de UI documentada: "La cuenta no está asociada a ningún cliente, contáctese con el administrador.".
  - **API:** Endpoint de login decodifica usuario correcto, comprueba estado, deniega devolviendo custom error (`403 Forbidden`).

---

## Submódulo: Navegación (NAV)

### MOD-ACC-NAV-TC-01 | Cierre voluntario de sesión (Logout Completo)
* **Objetivo:** Garantizar la liquidación del contexto de seguridad JWT/Session local.
* **Pre-condiciones:** Haber superado un Login Exitoso y poseer Tokens en el Browser Storage.
* **Pasos de Acción:**
  1. Interactuar con el menú izquierdo inferior clicando la opción "Cerrar sesión".
* **Resultado Esperado (Validaciones):**
  - **UI:** Expulsión al Login.
  - **Browser:** El Session Storage / Indexed DB debe destruír la clave de `auth_token` referenciada por el sistema. Intento de volver hacia atrás con navegador patea al Login.

### MOD-ACC-NAV-TC-02 | Bloqueo perimetral a rutas sin token
* **Objetivo:** Evaluador de Guards en app cliente.
* **Pre-condiciones:** Navegador Limpio en pestaña Privada (Trazas muertas).
* **Pasos de Acción:**
  1. Ingresar directo a url de módulo interno (Ej `https://bo-testing.com/tenants`).
* **Resultado Esperado (Validaciones):**
  - **UI:** Engranaje Router re-encamina a home `/login`.
  - **API:** Cualquier intento de llamar el layout de tenantes devolverá `401 Unauthorized`.

### MOD-ACC-NAV-TC-03 | Persistencia de vida de sesión tras Hard Refresh
* **Objetivo:** No exigir loggeos cíclicos si la ventana es recargada.
* **Pre-condiciones:** Contexto ingresado autorizado (Sesión iniciada).
* **Pasos de Acción:**
  1. Realizar una instrucción de browser Refresh (F5).
* **Resultado Esperado (Validaciones):**
  - **UI:** Sistema permanece en la ruta montada previa renderizando el panel Dashboard íntegramente. No solicita credenciales extra.

### MOD-ACC-NAV-TC-04 | Demostración Rate Limit o Throttle a nivel Acceso
* **Objetivo:** El sistema debe frenar ataques brutales hacia una cuenta.
* **Pre-condiciones:** Configurar bucle E2E para emitir ataques controlados.
* **Pasos de Acción:**
  1. Generar 20+ envíos hacia el input login a alta velocidad errando el password repetidamente.
* **Resultado Esperado (Validaciones):**
  - **UI / API:** A partir del intento límite parametrizado por arquitectura, la respuesta REST se torna `429 Too Many Requests` protegiendo contra Diccionario o DoS.
