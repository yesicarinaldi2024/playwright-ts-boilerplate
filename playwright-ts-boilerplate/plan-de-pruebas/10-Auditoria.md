# Plan de Pruebas: Auditoría (MOD-AUD)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Logs Históricos (LOG)

### MOD-AUD-LOG-TC-01 | Render Defensivo Data Table Global ("Read" First)
* **Objetivo:** Panel de lectura pasiva debe ser indestructible con fallos de front.
* **Pre-condiciones:** Sesión Ejecutiva logada por parametrización en Base Fixture.
* **Pasos de Acción:**
  1. Diridir clic "Auditoría" lateral.
* **Resultado Esperado:**
  - **UI:** Componente Matriz "React Data Grid / Table" dibuja las columnas puras sin acciones destructivas asociadas (Sin tachos de basura / Sin Botones Edit) y paginadas.
  - **API:** 200 GET Log Trail.

### MOD-AUD-LOG-TC-02 | Falla de Carga 403 Forbidden por IAM Limitativo (Control Acceso Escudo)
* **Objetivo:** Prevenir que un empleado visor lea logs sensibles de Operaciones Owner.
* **Pre-condiciones:** LogIn Kiosk con usuario Creado Local con permisión Viewer Kiosk.
* **Pasos de Acción:**
  1. Forzar URL `https://../auditoria`.
* **Resultado Esperado:**
  - **UI:** Modulo denegado, redireccion a `/` home panel forzado por Router Watcher en Front.
  - **API:** De atacar la API fetch `GET /logs` directo emite contundente `403 Access Denied`.

### MOD-AUD-LOG-TC-03 | Aislamiento Temporal DatePicker "Desde > Hasta"
* **Objetivo:** Comprimir data devuelta para no trancar Navegador del Owner.
* **Pasos de Acción:**
  1. Establecer Componente Desde = Hace 1 día.
  2. Hasta = Mañana.
  3. Ejecutar Botón Lupa (Búsqueda o Aplicar).
* **Resultado Esperado:**
  - **UI:** Exterminación de Logs del rango fuera de vigencia en Listado Base de Rows.
  - **API:** Parámetros Query Request recogen milisegundos absolutos conformando restricción temporal limpia en Query SQL generada devuelta confirmada.

### MOD-AUD-LOG-TC-04 | Parametrización Búsqueda Filter Type "DELETE" Exclusivo
* **Objetivo:** Filtrar logs destructivos.
* **Pasos de Acción:**
  1. Desplegable "Acción". Check en `DELETE` únicamente. 
  2. Búsqueda.
* **Resultado Esperado:**
  - **UI:** Render HTML del badge coloreado (Ej Rojo/Amarillo). Ningún Row indica CREATE o UPDATE.

### MOD-AUD-LOG-TC-05 | Inyección Lateral Detalle JSON Raw Information
* **Objetivo:** Trazabilidad profunda Endpoint Microservico.
* **Pasos de Acción:**
  1. Expandir el Eye Icon u "Ver Detalle" de una fila iterada.
* **Resultado Esperado:**
  - **UI:** Popup Window In Central Vision. Etiquetas como RUTA endpoint invocada, VERBO REST utilizado, y SERVICE (ej `user-service`) figuran inyectados e hidratados válidos.

### MOD-AUD-LOG-TC-06 | Funcionalidad Botón Restablecer Limpiar Base
* **Objetivo:** Destuir filtros aplicados y reset.
* **Pasos de Acción:**
  1. Estando presentes el Desde, Hasta, Delete del TC 03/04.
  2. Presionar Componente Link "X Limpiar".
* **Resultado Esperado:**
  - **UI:** Selector de Acción dice "Todas" otra vez. Fechas vacían campos input strings.
  - **API:** Fetch Call recuperando generalidad logs reinicia con Code Response Success.

### MOD-AUD-LOG-TC-07 | Descarga Integral Exportativa Libre a CSV File Node
* **Objetivo:** Extraer Reportancia de Compliance Manual en Blanco (Toda Base Histórica Limitada Paginador).
* **Pasos de Acción:**
  1. Clickez "Descarga / Export CSV".
* **Resultado Esperado:**
  - **Browser Context:** Instanciación Evento `Download Stream`. Capturado y el File Path en /downloads test aserta extension final `.csv`.

### MOD-AUD-LOG-TC-08 | Filtrado Estrecho Input "Servicio Múltiple"
* **Objetivo:** Comprobación lógica que soporta combinaciones lógicas de microservicios afectados.
* **Pasos de Acción:**
  1. Combo Select: `user-service`  o el nombre que defina micro.
* **Resultado Esperado:**
  - **UI:** Matriz solo expone alteraciones de credenciales u ABM Cuentas.

### MOD-AUD-LOG-TC-09 | Identificación Cruzada Específica de Actor (Búsqueda Email Parametrizada)
* **Objetivo:** Auditoría individualizada por sujeto peligro.
* **Pasos de Acción:**
  1. Inyectar en Input Originante Usuario/Email el string referenciado `${env.USUARIO_TEST}`.
* **Resultado Esperado:**
  - **UI:** Row list col Usuario comparte la misma estampa literal idéntica de principio a fin de página iterador sin mezclas.

### MOD-AUD-LOG-TC-10 | Aserción ClipBoard Native Copié Portapapeles (Copy JSON)
* **Objetivo:** Función operativa del Debugging técnico manual pág 69.
* **Pasos de Acción:**
  1. Al Interior Modal Detalles Logs (TC05).
  2. Botón Botón Aqua "Copiar JSON".
* **Resultado Esperado:**
  - **Nativo OS:** Event Eventlistener `clipboard-read` retorna string contenido con caracter brackets `{ ... }` confirmando volcado JSON estructurado válido y no nulo al portapapel.
