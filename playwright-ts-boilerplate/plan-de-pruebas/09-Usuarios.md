# Plan de Pruebas: Usuarios (MOD-USR)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Configuración Abm e Identidad (ABM)

### MOD-USR-ABM-TC-01 | Generación Exitosa Primer Instancia Administrador (Flujo Crítico)
* **Objetivo:** Validar motor de usuarios anclado al auth estricto.
* **Pre-condiciones:** Ejecución desde Owner.
* **Pasos de Acción:**
  1. Pestaña Usuarios > `+ Nuevo Usuario`.
  2. Nombre 'QA', Apellido 'Autom'. 
  3. Mail en formato String Inyectable Único. Telefono random. 
  4. Siguiente > Panel Permisos: Tildar Box "Super Administrador Global".
* **Resultado Esperado (Validaciones):**
  - **UI:** La identidad se asienta en lista y los íconos referenciales la describen como Super-User.
  - **API:** 201 Ok. Account Firebased u Identity Serviced Ok.

### MOD-USR-ABM-TC-02 | Intento Fallido Reuso de Hash (Correo Duplicado en Base Central)
* **Objetivo:** Abortar colisión Identity Hash.
* **Pre-condiciones:** El mail primario `.env` (Ej. `yesicarinaldi..`) está existente.
* **Pasos de Acción:**
  1. Formulario Alta Usuario ingresando idéntico correo al preexistente.
  2. Submit Datos.
* **Resultado Esperado (Validaciones):**
  - **UI:** Toast Error Modal: "Identity already exists" o equivalente al manual.
  - **API:** Interceptor 409 Conflict.

### MOD-USR-ABM-TC-03 | Intento Invalido Formateado Correo Regex Base
* **Objetivo:** Excluir inserciones nulas tempranas.
* **Pasos de Acción:**
  1. Campo Mail de nuevo user: "usuario-sin-extesion@..-..nada"
  2. Submit.
* **Resultado Esperado:** 
  - **UI:** Tooltip "Email inválido". No procesa a Paso Siguiente Modal de asginaciones.

### MOD-USR-ABM-TC-04 | Cambio Atributo "Activo/Inactivo" Toggle Lateral
* **Objetivo:** Bloqueo momentáneo laboral de agentes.
* **Pasos de Acción:**
  1. Detalle del ABM Usuario Inyectado Libre. 
  2. Quitar el Check "Estado".
* **Resultado Esperado:**
  - **UI:** Componente Lista emite badge Rojo "Inactivo".
  - **API:** El intento de sesión por Playwright Request en base a este Token genera Expulsión 401 unauth en el endpiont login.

### MOD-USR-ABM-TC-05 | Petición "Reset Contraseña" (Reset Password Service Link)
* **Objetivo:** Botón Header Activo funcional.
* **Pasos de Acción:**
  1. Detalle Usario ABM.
  2. Clic Componente Restablecedor de Contraseña.
* **Resultado Esperado:**
  - **UI:** Confirmando Envio Exitoso Flash.
  - **API:** Solicitud post hacia mail-provider API confirmada sin TimeOut en trazas.

---

## Submódulo: Roles de Sistema y Políticas IAM (ROL)

### MOD-USR-ROL-TC-01 | Alta Dinámica Lector Simplificado (Read-Only IAM Rule)
* **Objetivo:** Crear el andamiaje paramétrico del acceso.
* **Pre-condiciones:** Pantalla de "Administrar Roles" desde panel usuarios.
* **Pasos de Acción:**
  1. Input `Cajero Visor Automtización`.
  2. Dejar Desmarcado Tag "Global". Asignar al Tenant de Test Suites.
  3. En la matriz DOM de Checks inferiores Des-checkear todo salvo "Ver: Dashboard y Ver: Kioscos". Guardar.
* **Resultado Esperado (Validaciones):**
  - **UI:** Grid Refleja "Cajero Visor Aut..." Activo para ese único Tenant selecto.
  - **API:** Creada el Object Policy Roles en backend con éxito 2XX.

### MOD-USR-ROL-TC-02 | Privilegio Bloqueado Anti-Escalamiento
* **Objetivo:** Prevenir ataque Escalation (User bajo intenta crear Súper Admins Globales).
* **Pre-condiciones:** Loguear en Session Kiosk Runner Playwright con la cuenta limitada (Cajero Visor que posea chance de abrir "Modulo Roles").
* **Pasos de Acción:**
  1. Crear un Nuevo Rol y buscar el CheckBox "Global SuperAdmin".
* **Resultado Esperado:**
  - **UI:** Según manual Pag 64, este switch y permisos "No pueden ser creados con más privilegios de los que se tiene", el DOM los Oculta / Bloquea enteramente `Disabled`.

### MOD-USR-ROL-TC-03 | Mapeo Mixto Relacional (1 User = N Tenants Diferentes Jerarquías)
* **Objetivo:** Comprobación lógica que permite franquicias con mánagers compartidos.
* **Pasos de Acción:**
  1. Al Asignar Rol en Tab "Accesos de Usuario" al Editar Empleado.
  2. Insertar `Tenant_Test_A` con el permiso Dropdow `Owner Admin`.
  3. Clic "+ Agregar Tenant". Insertar `Tenant_Test_B` con Dropdwon Limitado Lector del TC-01-ROL.
* **Resultado Esperado:**
  - **UI:** DOM anexa los dos niveles divergentes independientemente guardándolos.
  - **API:** Envío Array de Objetos complejo cruzado en PUT Access persistido sin error fatal `200`.

### MOD-USR-ROL-TC-04 | Destrucción Política ROL Pre Existente (Lógica Cascada)
* **Objetivo:** Comprobar remoción y sus dependencias.
* **Pasos de Acción:**
  1. Trash-Delete Icon en Visor de Rol ("Lector Automtiz...").
  2. Aceptar confirm modal.
* **Resultado Esperado:**
  - **API:** El borrado de rol efectúa limpieza en cascada, si habia un usuario asignado a este, dicho usuario pierde ese link referenciado pasando a 0 permisos o bloqueado temporalmente. (Respuesta 2xx).
  
### MOD-USR-ROL-TC-05 | Visibilidad Barra Search Filtros por Nombre
* **Objetivo:** Uso reactivo.
* **Pasos de Acción:**
  1. Ingresar "Visor Automation" en barra.
* **Resultado Esperado:**
  - **UI:** Lista rol queda en 1 ítem exclusivo visible omitiendo superadmins o dueños.
