# Plan de Pruebas: Gestión de Media (MOD-MED)

**Ref. Documento:** `contexto/Manual SO.pdf`
**Regla de Pre-condiciones:** `Archivos binarios adjuntos` utilizados provienen localmente del runner de pruebas Cypress/Playwright, nunca de C:\\Users hardcodeados. 

---

## Submódulo: Archivos Centralizados (ARCH)

### MOD-MED-ARCH-TC-01 | Alta Integra Raster (.JPG)
* **Objetivo:** Adquisición de recurso imagen base.
* **Pre-condiciones:** Token de Sesión Inyectado. 
* **Pasos de Acción:**
  1. Clic "+ Subir media". 
  2. Emitir FileChooser event hacia Mock `.jpg` de 100kb. 
* **Resultado Esperado (Validaciones):**
  - **UI:** Render del miniatura preview. 
  - **API:** AWS S3 o Bucket Service devuelve Success 2xx.

### MOD-MED-ARCH-TC-02 | Falla Control Límite de Peso (Over 20MB)
* **Objetivo:** Evadir agotamiento de storage innecesario.
* **Pasos de Acción:**
  1. Emitir Filechooser mandando Mock PDF/JPG de 50 Megas.
* **Resultado Esperado:**
  - **UI:** Alerta Helper "KB a 20MB en tamaño máximo permitido".
  - **API:** Evento rechazado `413 Payload Too Large`.

### MOD-MED-ARCH-TC-03 | Formato no Autorizado (Infectado o Video)
* **Objetivo:** Confirmación Regex Types (`png`, `jpg`, `svg`, `webp`).
* **Pasos de Acción:**
  1. Forzar subida de `script.js` o `video.mp4`.
* **Resultado Esperado:**
  - **UI:** Bloque de prevención React Uploader impidiendo la carga "Formatos permitidos...".

### MOD-MED-ARCH-TC-04 | Modal Detalle Extenso
* **Objetivo:** Lectura de Hashes UUID para tracking e inyección de datos accesorios.
* **Pasos de Acción:**
  1. Hacer Tap / Clic directo sobre la tarjeta de un Media inyectado en TC-01.
* **Resultado Esperado:**
  - **UI:** Presenta Modal Pop-Over con Labels puros "Tipo", "Formato", "Hash", "Dimensioens". Ningún valor como "Undefined".

### MOD-MED-ARCH-TC-05 | Edición Metadatos Aditivos (Description / Alt)
* **Objetivo:** Cumplir requisitos de Accesibilidad.
* **Pasos de Acción:**
  1. Menú 3 Puntos Tarjeta > Editar Archivo.
  2. Agregar campo "Alternative Text" al `Logo` y Descripción Genérica.
  3. Submit.
* **Resultado Esperado:**
  - **UI:** Modal confirma Success y desaparece.
  - **API:** PUT request `200` con alteración payload.

### MOD-MED-ARCH-TC-06 | Falla Colisión Conflicto de Nominación Identica
* **Objetivo:** Prevenir reemplazos fantasmas en Producción de assets vitales.
* **Pasos de Acción:**
  1. Renombrar un Archivo subido y Forzar Re-subida con la misma variante idéntica y nombre desde local folder.
* **Resultado Esperado:**
  - **UI:** Modal de Dialog Interactivo "Existe archivo", "Desea sobreescribir".

### MOD-MED-ARCH-TC-07 | Interceptación Funcional Drag & Drop
* **Objetivo:** El EventListener reacciona al Canvas principal.
* **Pasos de Acción:**
  1. Triggerear mediante Playwright event dispatcher un `drop` de un .webp Mock válido.
* **Resultado Esperado:**
  - **UI:** Progress bar inicia al instante sin invadir la ventana native Browser open-files.

### MOD-MED-ARCH-TC-08 | Portapapeles URL Hosting
* **Objetivo:** Traspaso manual del URL de asset publico.
* **Pasos de Acción:**
  1. Acceder al detalle visual y Picar enlace en "URL Enlace".
* **Resultado Esperado:**
  - **Browser:** Pestaña Host Navigation detectada mediante `page.waitForEvent('popup')` para validar el CDN.

### MOD-MED-ARCH-TC-09 | Filtrado Activo Búsqueda Selecta
* **Objetivo:** Render Virtual Grids eficaces.
* **Pasos de Acción:**
  1. Buscar parte del Alt-Text o Nombre de Archivo mockeado.
* **Resultado Esperado:**
  - **UI:** Exterminación de todo contenedor que incumple el param de búsqueda, persistiendo la tarjeta test.

### MOD-MED-ARCH-TC-10 | Destrucción Completa Física (Error Warning Evaluado)
* **Objetivo:** Remover assets inútiles.
* **Pasos de Acción:**
  1. Tarjeta (... menú) > `Eliminar Archivo` rojo.
  2. Dialogo "Aceptar".
* **Resultado Esperado:**
  - **UI:** Componente DOM Expurgado de grilla.
  - **API:** Evento Delete al Storage de backend entrega StatusCode `2xx`.
