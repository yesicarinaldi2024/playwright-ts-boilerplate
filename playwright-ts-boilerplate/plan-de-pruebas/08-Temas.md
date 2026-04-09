# Plan de Pruebas: Temas (MOD-TEM)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Visual (VIS)

### MOD-TEM-VIS-TC-01 | Instanciación General Objeto Tema Base
* **Objetivo:** Cuna de los esquemas WhiteLabel para el Kiosco.
* **Pre-condiciones:** Sesión OK.
* **Pasos de Acción:**
  1. Temas > "+ Nuevo Tema". 
  2. Input Nombre parametrizado variable. Default. Grabar.
* **Resultado Esperado:**
  - **UI:** Tarjeta Activa añadida en la tabla central de Modificación.
  - **API:** 201 Ok de POST Themes.

### MOD-TEM-VIS-TC-02 | Falla de Carga de Tema Carente de Identidad (Sin Nombre)
* **Objetivo:** Restricción obligatoria según docs manual.
* **Pasos de Acción:**
  1. Modal Alta "+ Nuevo".
  2. Omitir input de texto "Nombre del Tema*". Submit.
* **Resultado Esperado:**
  - **UI:** Alerta Text Helper rojo in-form. Bloqueo Submit `Disabled`.

### MOD-TEM-VIS-TC-03 | Modificación Paramétrica Colores Hexadecimales (Header)
* **Objetivo:** Acoplamiento css per-tenant.
* **Pasos de Acción:**
  1. Editar Tema Genérico del Test Suite.
  2. Navegar Pestaña Estilos. Input `Header > Hex Color`.
  3. Inyectar `#0011FF` (Azul Test).
  4. Guardar.
* **Resultado Esperado:**
  - **UI:** Preview Box lateral de color muta dinámicamente al Tono inyectado como pre-render assertivo.
  - **API:** Componente guardado `2XX` sin corrupciones Json.

### MOD-TEM-VIS-TC-04 | Desvincular Banner y Elementos Adyacentes (Remove Media)
* **Objetivo:** Limpieza visual de un contenedor.
* **Pasos de Acción:**
  1. Editar Tema genérico. Pestaña `Media`.
  2. Ubicar la cruz (equis / delete) sobre la etiqueta previsualizada de `Banner Principal`.
  3. Clickez Cruz y Guardar Cambios.
* **Resultado Esperado:**
  - **UI:** Removido Asset Link de caja input in-form.
  - **API:** El Theme Update request entrega un Patch nulo al UUID banner logrando resetear el field correspondiente de forma segura.

### MOD-TEM-VIS-TC-05 | Inyección Asset Modal desde `Seleccionar Media`
* **Objetivo:** Uso de biblioteca de Storage interna frente a Drag and Drop.
* **Pasos de Acción:**
  1. Mismo input Banner, Click en el rectángulo vacío.
  2. Se levanta Modal Integrado de Banco de Imágenes (Grid media module interno).
  3. Picar un `JPG Valid`.
* **Resultado Esperado:**
  - **UI:** Input recibe la Preview Link.
  - **API:** Asociación relacional OK.

---

## Submódulo: Asignaciones en Cascada (ASIG)

### MOD-TEM-ASIG-TC-01 | Asignación Directa Inclusiva Nivel Raíz (Tenant)
* **Objetivo:** El Tema A rige todo por Default si es el Global del Account.
* **Pasos de Acción:**
  1. Asignarlo mediante toggle general.
* **Resultado Esperado:**
  - **API / UI:** La marca persiste de configuración, y el front-end Kiosko por Default lo heredaría al interconectar (Confirmable vía Unit API Testing Kiosk Fetch App).

### MOD-TEM-ASIG-TC-02 | Desactivación Total Flag "Tema Activo"
* **Objetivo:** Forzado de Default Global Base System App anulando costumizations.
* **Pasos de Acción:**
  1. En Info del Tema del Suite, clickear Toggle Estado a Desactivado.
* **Resultado Esperado:**
  - **UI:** El Tema aparece opaco/inactivo en el Listado y es inaccesible desde componentes dependientes de Sub-Kioscos de Configuración.

### MOD-TEM-ASIG-TC-03 | Quiebre de Herencia Visual ("Sobreescritura Local Sucursal")
* **Objetivo:** Validación Expresa Pag 60 manual "Aplicar un tema especial a un Kiosco o Sucursal Divergente".
* **Pasos de Acción:**
  1. Detalle del Tema "Navidad Especial Test".
  2. Pestaña "Sucursales" > Botón Vincular Sucursal.
  3. Checkmark en "Sucursal Testing Limitada". Activar Switch Guardar.
* **Resultado Esperado:**
  - **UI:** Elemento Asignado confirma "Activo" en la grilla visual de la Pestaña Sucursales.
  - **API:** Modela la relación asimétrica de 1 Tema => 1 Sucursal aislada.

### MOD-TEM-ASIG-TC-04 | Intento Restrictivo Cancelación Tema Unitario
* **Objetivo:** Resguardo Defensivo.
* **Pasos de Acción:**
  1. Intentar Botón Borrar Trash en el único tema presente de un Tenant base.
* **Resultado Esperado:**
  - **UI:** Impedimento Visual "No se puede eliminar único tema en uso".

### MOD-TEM-ASIG-TC-05 | Adoctrinación Formato Carrito SVG Limitante (Manejo Base Vectorial)
* **Objetivo:** Las sub-iconografías son frágiles si se suben HD jpgs pesados.
* **Pasos de Acción:**
  1. Media > `Icono Carrito Custom`. Send Archivo Test paramétrico Extensión `.SVG`.
* **Resultado Esperado:**
  - **UI:** Inyección de asset vectorial sin background negro errático, comprobando persistencia 200 de API.
