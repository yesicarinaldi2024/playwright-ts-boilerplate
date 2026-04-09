# Plan de Pruebas: Operaciones (MOD-OPE)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Sesiones Activas (SES)

### MOD-OPE-SES-TC-01 | Renderizado Exitoso y Estructura de Tabla Frontal (Flujo Seguro)
* **Objetivo:** Certificar la exposición visual general de conexiones concurrentes en los Dispositivos Físicos o QRs Virtuales.
* **Pre-condiciones:** Cuenta parametrizada con nivel de Acceso Backoffice Viewer/Admin. Sistema de log de kiosco base simulado.
* **Pasos de Acción:**
  1. Despliegue de Panel > Operaciones > Sesiones.
  2. Constatar grilla.
* **Resultado Esperado (Validaciones):**
  - **UI:** Columnas dispuestas (Sesión ID, Sucursal, Menú, Duración). Tablas pobladas de componentes funcionales paginator (`Items per page 10`).

### MOD-OPE-SES-TC-02 | Filtrado Exitoso Univalente de Hash Identifier
* **Objetivo:** Recuperación del track exacto de usuario de ATM.
* **Pasos de Acción:**
  1. Extraer el primer UUID o "Id Sesión" visible de forma dinámica (`77E14...xx` pág 53 manual).
  2. Pegar este Hash exacto dentro del componente `input[type="search"]` superior de "Buscar".
* **Resultado Esperado (Validaciones):**
  - **UI:** Eliminación visual de toda conexión ajena mostrando Únicamente el renglón indexado buscado.
  - **API:** Evento Fetch de lista arroja matriz de 1 ítem devuelto (`200 Success`).

### MOD-OPE-SES-TC-03 | Reacción a Sesiones Fallidas ("Timeout" Inactivo Status Tag)
* **Objetivo:** Chequeo integral semántico del manual: Timeout por inactividad debe predecirse como tag alertada en la celda Status.
* **Pasos de Acción:**
  1. Navegar por Paginador hasta dar con un evento no-completado y de status cancelada pre-cargado.
* **Resultado Esperado (Validaciones):**
  - **UI:** La etiqueta en pantalla debe rendir estado de texto Cancelada / Timeout sin permisión manual de enrutamiento destructivo. 

### MOD-OPE-SES-TC-04 | Extracción Local Side Drawer de Data Transaccional
* **Objetivo:** Obtención de reportes técnicos JSON.
* **Pasos de Acción:**
  1. Hacer tap / Clic a la fila extraída del TC-02.
  2. Levantar el "Historial de Sesión" lateral derecho.
  3. Clicar en botón funcional nativo "Copiar JSON".
* **Resultado Esperado (Validaciones):**
  - **UI:** Se dispara prompt React/MUI confirmatorio 'Copiado'.
  - **Browser:** API asertiva Portapapeles (navigator clipboard) contiene la estructura llévalo validando que no haya corrupciones nulas o promesas sin resolver `[Object object]`.

---

## Submódulo: Órdenes Consumadas (ORD)

### MOD-OPE-ORD-TC-01 | Aserción Visual Status Color "Verde Completada" (Semántica Visual)
* **Objetivo:** Validar componente pág. 55 indicando etiqueta Verde.
* **Pasos de Acción:**
  1. Sección `Operaciones > Órdenes`.
  2. Búsqueda general.
* **Resultado Esperado (Validaciones):**
  - **UI:** Render HTML del chip o tag encolumno de Status posee clase semántica css `success`, `green` exhibiéndose afirmativamente en contraste a una anulada.

### MOD-OPE-ORD-TC-02 | Despliegue Componente Resumen de Instancias de Venta 
* **Objetivo:** Corroborar render en Layout Modal de Side Menu con Subtotales financieros validos.
* **Pasos de Acción:**
  1. Cliquear un registro listado completado.
* **Resultado Esperado (Validaciones):**
  - **UI:** Expansión visual con datos inyectados para: Producto iterado, cantidad (ej. 1x$X), Monto unidad y Opciones Adicionales adheridas a él si el objeto en base lo admite.

### MOD-OPE-ORD-TC-03 | Visualización Integral de "Instrucciones Especiales"
* **Objetivo:** Atapar string descriptivo especial que deja un cliente final desde el Kiosco.
* **Pasos de Acción:**
  1. Generar / Mockear Orden en Base con un texto comentario "Sin sal ni aderezos por favor".
  2. Ver el Side Panel de dicha comprobante de pago en el módulo Operaciones.
* **Resultado Esperado (Validaciones):**
  - **UI:** El casillero o bloque DOM `Instrucciones Especiales` asimila y renderiza el string text literal para el backoffice QA.

### MOD-OPE-ORD-TC-04 | Extracción Ciega por Archivo (Descargar Json Orden Pura)
* **Objetivo:** Emitir Blob download técnico de orden.
* **Pasos de Acción:**
  1. Click Action Menu Black "Descargar" in Lateral drawer order resumen.
* **Resultado Esperado:**
  - **API/Browser:** Ejecución file handler descargas nativo, confirmando un Filetype Text/Json íntegra expedido sin fallar a promesas interceptado en EventListen de PW.

### MOD-OPE-ORD-TC-05 | Modificador de Paginación Escalada de Tablas Reactivas
* **Objetivo:** Forzado de recursos red sobre Orders List (Pag 55).
* **Pasos de Acción:**
  1. Pie de Tabla Orders > Mutar de Select (10) Items per pagings a `(50)`.
* **Resultado Esperado:**
  - **API:** Un llamado de `Limit=50&Offset=0` ataca la BD.
  - **UI:** Redibuja 50 tarjetas si aplican sin provocar crashes Memory Heap ni bloqueos visuales blancos en DOM, con correcta carga en Footer text (Ej. 1-50 de x).
