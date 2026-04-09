# Plan de Pruebas: Dashboard y Métricas (MOD-DASH)

**Ref. Documento:** `contexto/Manual SO.pdf`

---

## Submódulo: Filtros (FILT)

### MOD-DASH-FILT-TC-01 | Comportamiento Global del Rango Predefinido
* **Objetivo:** Comprobar la ingesta de parámetros estandarizados de calendario en las métricas.
* **Pre-condiciones:** Entorno autorizado cargado con metadata contable simulada.
* **Pasos de Acción:**
  1. Clic sobre componente selector de "Período".
  2. Elegir opción "Día Anterior".
  3. Apretar "Aplicar Filtros".
* **Resultado Esperado (Validaciones):**
  - **UI:** Re-render de KPIs excluyendo cifras macro, acotándose al segmento de 24hs solicitado.
  - **API:** Llamada `GET /metrics` inyecta en query parameter de rango de fechas la franja UNIX exacta. Status HTTP 200.

### MOD-DASH-FILT-TC-02 | Set de Calendario Personalizado
* **Objetivo:** DatePicker reacciona correctamente a inserciones custom.
* **Pre-condiciones:** Ninguna particular.
* **Pasos de Acción:**
  1. Usar el filtro "Rango de fechas" y seleccionar un Mes entero en el plano modal.
  2. Aplicar el Filtro.
* **Resultado Esperado (Validaciones):**
  - **UI:** Inputs reflejan visualmente "DD/MM/YYYY - DD/MM/YYYY" de manera semántica.
  - **API:** Request incorpora las fechas de borde exactas sin truncamientos defectuosos.

### MOD-DASH-FILT-TC-03 | Re-filtrado dinámico utilizando Segmento Sucursal
* **Objetivo:** Garantizar limpieza cruzada de datos mediante segundo parámetro de acotación.
* **Pre-condiciones:** Tenant base debe poseer al menos 1 Sucursal con ventas asignadas.
* **Pasos de Acción:**
  1. Accionar Select "Sucursales".
  2. Quitar el checkbox de todas y aplicar únicamente el store referenciado (Parametrizada en Fixture).
  3. Confirmar Aplicación.
* **Resultado Esperado (Validaciones):**
  - **UI:** Reducción sustancial del marco de 'Órdenes Totales' ya que descarta los locales anexos.
  - **API:** Payload transita con query String `&storeId=[ID_DE_LA_SUCURSAL]`.

### MOD-DASH-FILT-TC-04 | Funcionalidad Botón 'Limpiar Todos' (Reset)
* **Objetivo:** Vuelta inmediata a valor primigenio sin reseteo duro por F5.
* **Pre-condiciones:** Existencia de filtros custom (TC-02, TC-03 aplicados).
* **Pasos de Acción:**
  1. Ejecutar click nativo sobre UI link "Limpiar Todos".
* **Resultado Esperado (Validaciones):**
  - **UI:** Las dropboxes vuelven al estado de manual (Período: "Mes Anterior", Sucursal "Seleccionar/Todas").
  - **API:** Endpoint métrico recupera y solicita el chunk de data maestra mensual.

### MOD-DASH-FILT-TC-05 | Visor de Auto-Recarga Automática (Auto-Refresh)
* **Objetivo:** Refetching programado por UI.
* **Pre-condiciones:** Estar posicionado viendo la gráfica principal y un poller de red abierto en background.
* **Pasos de Acción:**
  1. Identificar el ícono Switch superior derecho junto al botón aplicar filtros.
  2. Modificarlo hacia "On" o encendido.
* **Resultado Esperado (Validaciones):**
  - **UI:** El chip pasa a estado iluminado/activo.
  - **API:** En la pestaña Network (Playwright Interception), se acusa el recibo de llamadas HTTP constantes a intervalo regular (Polling) sin intervención física del mouse.

### MOD-DASH-FILT-TC-06 | Multi-Tenant Selection desde Switcher Superior Admins
* **Objetivo:** El rol Super Admin muta todo el canvas base al cambiar globalmente.
* **Pre-condiciones:** El rol de acceso debe tener potestad de escalar varios Tenants.
* **Pasos de Acción:**
  1. Visualizar Select Cb superior Pautenant (Context switcher).
  2. Seleccionar un Tenant N°2 en la organización.
* **Resultado Esperado (Validaciones):**
  - **UI:** El Dashboard hace un re-render intensivo. Las ventas reflejan los fondos de ese segundo tenant excluyendo absolutamente los datos previos.
  - **API:** Emisión `200 Success` a las llamadas de `/dashboard` con Head o Query anclado al nuevo `TenantID`.

---

## Submódulo: Métricas Base (MET)

### MOD-DASH-MET-TC-01 | Presencia de Tarjetones Principales Básicos (KPI Check)
* **Objetivo:** Confirmar diseño íntegro descripto en el manual pág 5.
* **Pre-condiciones:** Dashboard instanciado.
* **Pasos de Acción:**
  1. Inspeccionar componente visual "Ventas Netas".
  2. Inspeccionar componente "Órdenes Totales".
  3. Inspeccionar componente "Promedio Órdenes".
* **Resultado Esperado (Validaciones):**
  - **UI:** Los bloques se renderizan con clase Card sin devolver estado `null` o errores de renderizado javascript. Existen indicadores visuales de tendencia monetaria.

### MOD-DASH-MET-TC-02 | Falla de Carga Simulada de Métricas (HTTP Delay)
* **Objetivo:** El UI debe contemplar fallos del network devolviendo estados vacíos sanos (Skeletons).
* **Pre-condiciones:** Interceptar servidor de pruebas con función Fallover.
* **Pasos de Acción:**
  1. Emitir Delay u Error 400 simulado por Playwright en ruta `/api/kpi`.
* **Resultado Esperado (Validaciones):**
  - **UI:** Renderizado de cartel amigable "Datos insuficientes" o Componentes Cargador (Loaders). No deforma el contenedor Flex o Grid de la página.

---

## Submódulo: Gráficos y Tablas Generales (GFX)

### MOD-DASH-GFX-TC-01 | Presentación de Gráfico 'Ventas por Hora' (SVG/Canvas)
* **Objetivo:** Comprobación lógica que no recae en aserción puramente pixel a pixel, comprobando existencia in-node.
* **Pre-condiciones:** Conjunto de ventas ingresado en backend.
* **Pasos de Acción:**
  1. Ubicar zona inferior "Ventas por hora".
* **Resultado Esperado (Validaciones):**
  - **UI:** Existencia del DOM wrapper de chartisj u otro similar en pie de página con el Tooltip dinámico asociado sobre curva dibujada.

### MOD-DASH-GFX-TC-02 | Integridad Componentes de Barras Top Puestos (Rankings)
* **Objetivo:** Grilla complementaria se hidrata.
* **Pre-condiciones:** Menú con historial de transacciones.
* **Pasos de Acción:**
  1. Realizar scroll local visual al fondo de dashboard.
  2. Ubicar la caja componente "Top Categorías" o "Top Productos".
* **Resultado Esperado (Validaciones):**
  - **UI:** Devuelve las sub-cajas listando barras horizontales numéricas.
  - **API:** Consumo interno de endpoint rankings devuelve estructura estricta `{ result:[..items] }` sin desbordamiento.
