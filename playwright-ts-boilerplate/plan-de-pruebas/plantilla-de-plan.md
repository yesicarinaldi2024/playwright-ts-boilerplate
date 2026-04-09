# Plan de Pruebas: [Ej: Autenticación de Usuarios]

**Ref. Documento Funcional:** `contexto/Manual SO.pdf`
**Prioridad:** [Alta/Media/Baja]

---

## Suite de Pruebas 1: [Ej: Flujos Principales de Login]

### TS-001 | [Título descriptivo del Test Case, ej: Ingreso con credenciales válidas]
* **Objetivo:** Validar que un usuario registrado pueda ingresar exitosamente a su Dashboard.
* **Pre-condiciones:** 
  - Tener registro previo en Base de datos (o usar objeto mockeado en `data/usuarios.json`).
* **Pasos de Acción:**
  1. Ingresar a la URL principal de autenticación.
  2. Rellenar campo usuario con `[Valor esperado]`.
  3. Rellenar campo clave secreto con `[Valor esperado]`.
  4. Presionar "Ingresar".
* **Datos de Prueba:** `standard_user`
* **Resultado Esperado (Aserción):** 
  - La URL debe cambiar hacia `/dashboard`.
  - El `<Header>` debe reflejar la visibilidad de la alerta de bienvenida. 

---

### TS-002 | [Título de test case fallido (Edge Case)]
* **Objetivo:** [Meta]
* **Pre-condiciones:** [Setup previo]
...


Se deberan agrupar los casos de prueba segun los modulos indicados dentro del documento funcional alojado en la carpeta de contexto.

Los casos de prueba deberan contener el ID del caso y el modulo al cual pertenece (generar una nomenclatura unica) como identificador unico.