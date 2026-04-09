# Plan de Pruebas: Catálogo (MOD-CAT)

**Ref. Documento:** `contexto/Manual SO.pdf`
**Regla de Pre-condiciones:** Variables extraídas explícitamente desde Archivos Secretos o `.env` (Ej: RUTAS DE IMÁGENES MOCKS, NOMBRES DE PRUEBAS DINÁMICOS).

---

## Submódulo: Categorías (CAT)

### MOD-CAT-CAT-TC-01 | Alta de Categoría con Imagen Representativa
* **Objetivo:** Armar un primer nivel visual para el catálogo del kiosco.
* **Pre-condiciones:** Acceso al Backoffice con perfil apto para Catálogos. Archivo local estandar `.jpg` disponible en raíz.
* **Pasos de Acción:**
  1. Navegar a **Catálogo > Categorías**.
  2. Presionar "+ Nueva Categoría".
  3. Ingresar Nombre dinámico evaluado por variable de test.
  4. Arrastrar y soltar imagen base del set de QA.
  5. Apretar "Crear".
* **Resultado Esperado (Validaciones):**
  - **UI:** Alerta "Categoría creada con éxito". Aparece la entidad en tabla con una pre-visualización miniatura del asset adjunto.
  - **API:** Responde con status `HTTP 201 Created` en el endpoint `/api/categories/`.

### MOD-CAT-CAT-TC-02 | Falla en validación Mandatory Field `Nombre`
* **Objetivo:** Comprobación defensiva del input form de Catálogos.
* **Pasos de Acción:**
  1. Dirigirse al modal Crear Categoría.
  2. Emitir "Crear" sin proveer letras en Nombre.
* **Resultado Esperado (Validaciones):**
  - **UI:** Texto restrictivo color punzó "El campo Nombre es Requerido" debajo del input interceptando el clicker. No muta la tabla.

### MOD-CAT-CAT-TC-03 | Modificación Color Hexadecimal (Edición Visual)
* **Objetivo:** Validar persistencia de color.
* **Pasos de Acción:**
  1. Editar la categoría creada en TC-01.
  2. Cambiar parámetro de `Hex` de #000000 a otro proporcionado en entorno constante.
  3. Guardar.
* **Resultado Esperado:** 
  - **UI:** Contenedor refleja actualizacion. **API:** Http `200 Success` a método PATCH/PUT de Categorías. 

### MOD-CAT-CAT-TC-04 | Configuración de Restricción Temporizada en Calendario
* **Objetivo:** Regla funcional pág 30 (Días Recurrentes).
* **Pasos de Acción:**
  1. Editar categoría > Pestaña `Calendario`.
  2. Entrar a `Días Recurrentes`.
  3. Fijar Martes a Jueves con un límite "Desde 10 AM / Hasta 11 AM".
  4. Activar flag: "Determinar el mismo horario para todos los días seleccionados".
* **Resultado Esperado:**
  - **UI:** Renderizado en grilla local del horario propagado a todos los nodos T/W/T. **API:** Payload del objeto calendario guardado `200 OK`.

---

## Submódulo: Productos (PROD)

### MOD-CAT-PROD-TC-01 | Instanciar Producto Standalone Base
* **Objetivo:** Proveer existencia comercializable pura.
* **Pasos de Acción:**
  1. Catálogo > Productos > "+ Nuevo Producto".
  2. Tipiar SKU dinámico de prueba.
  3. Asignar nombre random variable.
  4. Adherir la "Categoría parametrizada en test anterior". Click en Crear.
* **Resultado Esperado:**
  - **UI:** Cierra modal y aparece en vista grilla.
  - **API:** Servicio Items acepta con código 201.

### MOD-CAT-PROD-TC-02 | Producto con Tag +18 (Disclaimer Mandatario)
* **Objetivo:** Configuración per-item de la política de ventas a mayoría de edad.
* **Pasos de Acción:**
  1. Al crear nuevo producto "Bebida Espirituosa", tildar check "Este producto requiere confirmación de mayoría de edad".
  2. Agregar Description contextual.
* **Resultado Esperado:**
  - **UI:** Configuración se alinea permanentemente.
  - **API:** Atributo de flag boolean de edad pasa satisfactoriamente a `true`.

---

## Submódulo: Opciones y Adicionales (OPC)

### MOD-CAT-OPC-TC-01 | Alta Agrupada de Modificadores Múltiples (Salsas Extra)
* **Objetivo:** Validar reglas de mínimos y máximos para el customizador de Kiosco.
* **Pasos de Acción:**
  1. Ir a Tab Opciones y Adicionales.
  2. Crear Nuevo > Grupo de opciones.
  3. Asignar Nombre "Aderezo Promo", setear selección `Múltiple` o `Única`.
  4. Agregar Option 1 (Ketchup sin coste), Option 2 (Mayo Trufa con coste X).
* **Resultado Esperado:**
  - **UI:** Contenedor Parent aglutina Sub-Row hijos configurados correctos.

### MOD-CAT-OPC-TC-02 | Acople de Grupo de Modificadores a Sub-Producto Base
* **Objetivo:** Funcionalidad integradora pag 38 (Productos Vinculados).
* **Pasos de Acción:**
  1. Seleccionar Modal de Acciones (tres puntos) > "Productos Vinculados" sobre el grupo recién armado.
  2. Checkboxear el producto "StandAlone Base" provisto por test automatizado.
* **Resultado Esperado:**
  - **UI:** Confirmación visual. **API Crossover:** Inyección de relación entre tablas.

---

## Submódulo: Combos (CMB)

### MOD-CAT-CMB-TC-01 | Alta de Combo Estructurado (CLÁSICO)
* **Objetivo:** Consolidar una asociación unitaria compuesta de múltiples Skus.
* **Pasos de Acción:**
  1. Tabulador Combos > "+ Nuevo Combo".
  2. Select: Tipo CLÁSICO.
  3. Indicar SKU combo, un nombre y anexarlo a la Categoría Genérica del test suite.
  4. En select de "Productos Asociados", adherir dos líneas de productos mock provenientes de pruebas anteriores (Ej: Coca, Burger).
* **Resultado Esperado:**
  - **UI / API:** Aceptación 200 HTTP, El tipo resalta como 'CLÁSICO' en el badge de tabla.

---

## Submódulo: Menú (MNU)

### MOD-CAT-MNU-TC-01 | Inserción Limpia y Asociación de Local
* **Objetivo:** Proveer la capa última expuesta a las pantallas de Kiosk/Pantallas táctiles.
* **Pasos de Acción:**
  1. Ir a Pestañas Laterales > "Menú" > "+ Nuevo menú".
  2. Establecer identificadores.
  3. En panel detale Menú ir a > Sucursales.
  4. Atar "Vincular Sucursal" y seleccionar la Sucursal Default paramétrica de red de pruebas.
* **Resultado Esperado:**
  - **UI:** Renderizado de lista Sucursales confirmando 'Habilitado'.
  - **API:** Success Request 200 apuntando id store vinculado exitosamente a Menu.
