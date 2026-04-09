# Plan de Pruebas: Organización (MOD-ORG)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Tenants (TEN)

### MOD-ORG-TEN-TC-01 | Alta Exitosa de Tenant Básico
* **Objetivo:** Disponer cliente raíz en la DB.
* **Pre-condiciones:** Acceder a "Organización > Tenants" con perfil Admin.
* **Pasos de Acción:**
  1. Botón superior derecho "+ Nuevo Tenant".
  2. Input Nombre: String en ejecución dinámico parametrizado.
  3. Clic Crear de ventana modal.
* **Resultado Esperado (Validaciones):**
  - **UI:** Modal finaliza y se dispara Toast verde de acción completada. La fila consta en tabla base.
  - **API:** Respuesta `200/201 Created` re-entregando hash code principal.

### MOD-ORG-TEN-TC-02 | Bloqueo al emitir Tenant con vacíos mandatorios
* **Objetivo:** Retenedor frontal de omisiones.
* **Pre-condiciones:** Formulario abierto.
* **Pasos de Acción:**
  1. Botón Form Create con Input "Nombre" nulo y Descripciones nulas.
  2. Efectuar Clic "Crear".
* **Resultado Esperado (Validaciones):**
  - **UI:** Notificación en texto color bermellón contiguo al input advirtiendo obligatoriedad; acción bloqueada.
  - **API:** Ninguna llamada propagada. Si forzada por red, responde `422 Unprocessable Entity` "Nombre Required".

### MOD-ORG-TEN-TC-03 | Modificación de Pestaña Info en Tenant
* **Objetivo:** CRUD Action (Update).
* **Pre-condiciones:** Tenant Pre-Existente Creado del Mod anterior.
* **Pasos de Acción:**
  1. Click en Entidad creada. Ingresa a Detalles.
  2. Subzona Información. Alterar Descripción.
  3. Guardar Cambios Superior.
* **Resultado Esperado (Validaciones):**
  - **UI:** Elemento refleja temporalmente alerta "Actualización confirmada". 
  - **API:** Request HTTP PATCH/PUT hacia `/api/tenants/<id>` devuelve HTTP status 200.

### MOD-ORG-TEN-TC-04 | Alternancia Métodos Pago Inicial (Efectivo y Clover)
* **Objetivo:** Setear facturadores habilitables.
* **Pre-condiciones:** Estar posicionado en Detalle de un Tenant.
* **Pasos de Acción:**
  1. Abrir sub-pestaña "Métodos de Pago".
  2. Habilitar la palanca "Efectivo" si no lo está. Setear inhabilitación en "Clover".
  3. Guardar cambios.
* **Resultado Esperado (Validaciones):**
  - **UI:** Cambio dinámico de color switches retenido al refrescar.
  - **API:** Carga de configuración heredable confirmada `HTTP 204/200`.

### MOD-ORG-TEN-TC-05 | Inyección de Pantalla Espera Media (Pre-Menú)
* **Objetivo:** Adjudicar customización media pre-start kiosks.
* **Pre-condiciones:** Entrar en Pestaña "Pantalla de Inicio" del Tenant. Tenant posee un asset Media global.
* **Pasos de Acción:**
  1. Mover Switch Activar prefiltro.
  2. Agregar subida desde local folder de una Pantalla de Fondo JPG, parametrizado en test.
  3. Guardar.
* **Resultado Esperado (Validaciones):**
  - **UI:** El recuadro presenta previz de lo alojado y el tenant lo registra como default para todos sus hijos.

---

## Submódulo: Sucursales (SUC)

### MOD-ORG-SUC-TC-01 | Alta Operativa de Local Comercial
* **Objetivo:** Registrar un local dependiente o franquiciado (Sucursal).
* **Pre-condiciones:** Posicionamiento en pestaña lateral Sucursales. Tenant matriz seleccionado.
* **Pasos de Acción:**
  1. Abrir modal "+ Nueva Sucursal".
  2. Ingresar Identificador, dex store (Opcional) y Descripciones.
  3. Confirmar Formulario.
* **Resultado Esperado (Validaciones):**
  - **UI:** La Entidad germina en tabla referencial con Estado Activo.
  - **API:** Disparo Post a `/locations/` retribuyendo ok 200+.

### MOD-ORG-SUC-TC-02 | Anexo de Detalles Geopolíticos y Testeo Mapping
* **Objetivo:** Integrar al API de Mapas interno las coordenadas directas.
* **Pre-condiciones:** Ingreso a los Detalles de la Sucur.
* **Pasos de Acción:**
  1. Informar País, Ciudad y Dirección.
  2. Validar con Botón en input de Map Component.
  3. Submitir general.
* **Resultado Esperado (Validaciones):**
  - **UI:** Visualización asertiva de Pin Drop dentro del canvas reactivo del mapa geolocalizado adjunto (El div inyectado no explota errático).

### MOD-ORG-SUC-TC-03 | Eliminación de Manager (Contactos Multiples)
* **Objetivo:** Acciones destructivas en arreglos anidados secundarios.
* **Pre-condiciones:** La tienda debe poseer al menos 1 manager inyectado como array list en "Contactos".
* **Pasos de Acción:**
  1. Ingreso a Sucursal > Tab: Contactos.
  2. Observando el rol de encargado listado en fila anidada, presionar Action Delete (Tacho basura negro).
* **Resultado Esperado (Validaciones):**
  - **UI:** Desaparición del front row de contactos.
  - **API:** Efectividad DELETE request devolviendo estatus OK evitando Orphans Data.

### MOD-ORG-SUC-TC-04 | Sobreescritura Forzada Pestaña Pago en Sucursal (Des-Heredar)
* **Objetivo:** Cortar el comportamiento centralizado en post de autonomía particular de una sola tienda sucursal.
* **Pre-condiciones:** El Tenant matriz posee por configuracion inicial "Efectivo", Sucursal debe ser configurada independientemente para "Mercado Pago" forzádamente.
* **Pasos de Acción:**
  1. Pestaña Métodos > Accionar el botón de sobreescribir "Personalizar para esta sucursal".
  2. Tachar Efectivo, Encender Mercado pago y seleccionar el API Key en combo de facturación.
  3. Guardar edición.
* **Resultado Esperado (Validaciones):**
  - **UI:** El candado de cascada se retira. La configuración local diverge permanentemente de matriz central, acoplando un aviso UI (No heredado).

---

## Submódulo: Kioscos (KIO)

### MOD-ORG-KIO-TC-01 | Inicialización Standalone de Kiosco Virtual Automático
* **Objetivo:** Capacidad de disponer de autogestión sin dispositivo harware de fondo por el local.
* **Pre-condiciones:** Sección Listado Kioscos abierta.
* **Pasos de Acción:**
  1. Alta -> Nuevo Kiosco.
  2. Encender flag "Canal Virtual". Setear Store contenedor y guardar.
  3. Dentro del equipo configurado, apuntar a pestaña "QR".
* **Resultado Esperado (Validaciones):**
  - **UI:** El sistema omite solicitar campo "Dex Device Hardware". Exposición visual tab QR que da código base64 y un Link HTML copiable a host. 

### MOD-ORG-KIO-TC-02 | Falla de alta de dispositivo Físico carente de Matriz Device (Flujo de Error)
* **Objetivo:** Exigencia mandatoria para items pesados (Requiere DEX HW ID).
* **Pre-condiciones:** Modal kiosco físico.
* **Pasos de Acción:**
  1. Desmarcar o NO marcar el canal virtual.
  2. Omitir combobox "Dex Device" (En blanco).
  3. Continuar creación.
* **Resultado Esperado (Validaciones):**
  - **UI:** Falla en el lado cliente notificando "Dato Obligatorio" faltante requerido para el mapeo MDM de fondo, no avanza la solicitud modal de kiosco.

### MOD-ORG-KIO-TC-03 | Aplicaciones Múltiples de Kioscos en la grilla: Refuerzo en Grupo Virtual Genérico
* **Objetivo:** La grilla principal estandariza la vista separando en "Sin Grupo".
* **Pre-condiciones:** Creados kioscos múltiples.
* **Pasos de Acción:**
  1. Inspeccionar Grilla Kioscos en raíz.
* **Resultado Esperado (Validaciones):**
  - **UI:** Aserción Playwright evaluará un Tree Row con Sub-Drop Down nombrado "Sin Grupo" albergando kioscos huérfanos generados hasta no ser asignados grupalmente.

### MOD-ORG-KIO-TC-04 | Acción Especial "Bloquear/Reiniciar" Múltiple
* **Objetivo:** Disparo masivo de comandos hacia el parque informático Dex.
* **Pre-condiciones:** 2 o más kioscos listados presentes desde tabla principal front.
* **Pasos de Acción:**
  1. Click checkboxes laterales correspondientes en fila múltiple.
  2. Activar Componente Inferior Global desplegando "Más Acciones".
  3. Clicar "Bloquear" emitido al parque seleccionado.
* **Resultado Esperado (Validaciones):**
  - **UI:** Modal con advertencia inminente para la desconexión.
  - **API:** Un POST batch array `[id1, id2]` direccionado al servicio microcontrolador para su reboot y emitirá el 200 Success asertado.

---

## Submódulo: Grupos de Kioscos (GRP)

### MOD-ORG-GRP-TC-01 | Adhesión Grupal y Sub-Edición Masiva
* **Objetivo:** Acople aglutinante logístico ("Todos los kioscos piso 1 norte, actúan igual").
* **Pre-condiciones:** Vista Grupo kioscos abierta.
* **Pasos de Acción:**
  1. `+ Nuevo Grupo de opciones` de K. 
  2. Seleccionar dos o más kioscos del selector múltiple.
  3. Asignar Menu Local Custom por Encima de la Matriz. Guardar.
* **Resultado Esperado (Validaciones):**
  - **UI:** En tabla root todos sus componentes acoplan pertenencia de subcarpeta aglutinada ("Grupo Ala Norte"), permitiendo edición simultánea a todos por defecto de ahora en más.
  - **API:** 201 Ok.
