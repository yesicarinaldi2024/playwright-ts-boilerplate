# Plan de Pruebas: Precios (MOD-PRE)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Tipos de Precio (TIP)

### MOD-PRE-TIP-TC-01 | Falla forzada en eliminación de "Default Price Type" 
* **Objetivo:** Seguridad arquitectónica: el manual asegura que un precio primitivo anclado no puede morir ("Una vez creado, el primer precio -Default- no puede eliminarse").
* **Pre-condiciones:** Tener seleccionado un Tenant activo provisto por `env` con configurador root en Precios.
* **Pasos de Acción:**
  1. Buscar el Tipo de Precio Default inicial parametrizado.
  2. Intentar buscar la papelera Destructora en acciones.
* **Resultado Esperado:**
  - **UI:** El DOM previene el renderizado del ícono Delete para esa instancia o expulsa notificación "Acción no permitida".
  - **API:** El interceptor de API bloquea llamadas `DELETE` al endpoint core del Default.

### MOD-PRE-TIP-TC-02 | Instanciación Exitosa de Nueva Modalidad Venta
* **Objetivo:** Validar inyección del contenedor "Precio Nocturno"  u otros.
* **Pasos de Acción:**
  1. Agregar Tipo Precio en configuración global.
  2. Configurar etiqueta base: "Delivery Exclusivo".
* **Resultado Esperado (Validaciones):**
  - **UI:** Elemento se lista para ser elegido en las casillas posteriores.
  - **API:** Solicitud Positiva 2XX conformando nuevo `PriceType`.

---

## Submódulo: Precios Productos (PPR)

### MOD-PRE-PPR-TC-01 | Alta Dinámica Referencial Simple (Precio Constante)
* **Objetivo:** Definición de rentabilidad base para un SKU.
* **Pre-condiciones:** Mínimamente un Producto generado en la DB con un SKU.
* **Pasos de Acción:**
  1. Menú Master de Precios > "+ Nuevo Precio".
  2. Búsqueda autocomplete del "Producto ó SKU" paramétrico. Seleccionarlo.
  3. Dejar vacíos segmentos opcionales (Aplica a Toda red).
  4. Ingresar un Entero "1050" en la casilla de Default Price Variante.
  5. Emitir formulario.
* **Resultado Esperado (Validaciones):**
  - **UI:** Se crea row table indicando "1050" en columna de Precio. Segmentos vacíos refutan la globalidad general `(-)`.
  - **API:** 201 Created re-entregando un UUID del Price object.

### MOD-PRE-PPR-TC-02 | Edición Preventiva - Inserción Caractéres Inválidos Letras (Flujo Error)
* **Objetivo:** Verificar parseo del lado del browser impidiendo NaN.
* **Pasos de Acción:**
  1. Pulsar Opción de Editar sobre el precio inyectado TC-01.
  2. Pisar casilla "Default Price Type" por String "Valor Cien".
* **Resultado Esperado (Validaciones):**
  - **UI:** El KeyBoard de UI cancela la entrada de evento o HTML input type=number arroja estado Native Error "Caracter No Autorizado, ingrese números".

### MOD-PRE-PPR-TC-03 | Condicionamiento Estricto por Filial Parametrizada (Sucursal)
* **Objetivo:** Aplicar regla diferenciadora de sobrecosto por store. 
* **Pasos de Acción:**
  1. "Crear precio" > Seleccionar Sub-Variante Producto.
  2. Activar "Seleccionar sucursal, etiqueta o menú".
  3. Tipiar la `Sucursal Test Mocks` proveída por env.
  4. Inyectar precio diferenciado (ej: 1200).
* **Resultado Esperado:**
  - **UI:** Row expone ahora 1200 y en la columna store declara su limitante a esa sóla tienda. 

### MOD-PRE-PPR-TC-04 | Condicionamiento Triple Restrictivo (Tag + Store + Menú)
* **Objetivo:** Combinación límite tolerada de las dependencias.
* **Pasos de Acción:**
  1. Editar Precio u Crear Precio.
  2. Definir una etiqueta (Tag parametrizado `Promo Amigos`).
  3. Definir la Sucursal y un Menú específico ("Extra Menú B").
  4. Cargar Precio final de Remate.
* **Resultado Esperado (Validaciones):**
  - **API:** El servidor no debe crashear ante triplicidad relacional y debe despachar Correcto.
  - **UI:** El renderizado comprime e inyecta la tri-tagg conjunta en los columnas descriptivas.

### MOD-PRE-PPR-TC-05 | Lógica Temporizada - Rango Base con Vigencia Promocional
* **Objetivo:** Promos efímeras de vencimiento.
* **Pasos de Acción:**
  1. Seleccionar componente "Fecha Desde" > Día corriente.
  2. Seleccionar "Fecha Hasta" > Día de Mañana.
  3. Aplicar valor base.
* **Resultado Esperado (Validaciones):**
  - **UI:** Las celdas de "Fecha Desde/Hasta" exhiben timestamps convertidos localmente en la grilla visual.

### MOD-PRE-PPR-TC-06 | Vigencia Módulo Horaria con Alta Precisión Analógica
* **Objetivo:** Las Promos de 'Pintas hasta x hora' son vitales de registrar.
* **Pasos de Acción:**
  1. Similar al previo pero se imputan Horas (De 18:00 hs a 21:00 hs) validando uso de widget clock nativo / TimePicker.
* **Resultado Esperado:**
  - **API:** ISO Date + Offset inyectado en Base de Datos satisfactorio.

### MOD-PRE-PPR-TC-07 | Cambio Update Fila Grilla Automática General
* **Objetivo:** Una actualización monetaria sobreescita impacta dinámicamente en vista.
* **Pasos de Acción:**
  1. Cambiar valor de "100" a "300" desde menú editor.
* **Resultado Esperado:**
  - **UI:** Confirmación reactiva in-table sin F5 exigido.

### MOD-PRE-PPR-TC-08 | Baja Eliminatoria Física Estándar y Warning Prompter
* **Objetivo:** Proceso irreversible de remoción final de Costes.
* **Pasos de Acción:**
  1. Icono menú Vertical celdas > Eliminar precio (Botón Rojo Trash bin).
  2. Aceptar el requerimiento modal intermedio.
* **Resultado Esperado:**
  - **UI:** La Tarjeta o tramo es expurgado del front.
  - **API:** Delete Command ejecutado, retorno limpio 204.
