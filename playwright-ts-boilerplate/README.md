# 🚀 Boilerplate de Playwright + TypeScript (Anti-Flaky)

Framework de pruebas automatizadas construido desde cero priorizando la estabilidad E2E y las mejores prácticas anti-flakiness con el respaldo nativo de **TypeScript**.

## 📖 Arquitectura y Filosofía

| Directorio | Propósito |
|---|---|
| `📂 directives/` | **Guías de Oro (Leanlas)**. Normativa técnica en selectores, esperas asíncronas y reintentos. |
| `📂 pages/` | Modelos de Vista (`Page Object Model`) que exponen acciones enrutables. |
| `📂 components/` | Bloques visuales anclados comunes, ejemplo un Navbar, que interactúan entre las Pages. |
| `📂 tests/fixtures/`| Clases extendidas inyectables donde todo Objeto está preconcebido. |
| `📂 utils/` | Helpers funcionales como mecanismos de espera avanzada sobre red o promesas sueltas. |

## 🛡️ ¿Cómo Trabajamos el Flakiness?

Nos apegamos a lineamientos precisos, por lo tanto si ves una falla:
1. **No hay *sleeps* temporales:** En este proyecto encontrarás `WaitHelper` para esperar a "desapariciones de loader" en red, no usamos "esperar 4 segundos", esa práctica queda censurada por los hooks de inspección.
2. **Prioridad Visual Web-first:** Se usa `await expect().toBeVisible()` como norma inmutable para forzar sondeos progresivos con un límite tope explícito.
3. **Data Dinámica**: Importamos JSON en `e2e` para probar las 3 vertientes de credenciales utilizando el patrón Data-Driven Testing en lugar de embutir el payload directamente.
4. **Locaters Protegidos**: Priorizamos `getByTestId` para el software interno, obligando a los dev font-end a darnos anclas incambiables que superviven todo Refactor CSS.

---

## 🛠️ Instalación y Setup

**Paso 1:** Instala las dependencias y sus tipados en el repositorio:
```bash
npm install
```

**Paso 2:** Instala el runtime de Playwright en tu equipo (descargará la paquetería de browser necesaria):
```bash
npx playwright install
```

---

## ▶️ Ejecución y Consola

Ejecutar todos los suites de forma paralela predeterminada y en modo consola o "headless":
```bash
npm run test
```

Interacción Asistida. **IDE Gráfico de testeo Playwright** interactivo (Ideal para escribir nuevos selectores):
```bash
npm run test:ui
```

Abrir el Resumen visual (Reporte HTML):
```bash
npm run report
```

### Separación en Sub-carpetas:
Correr netamente la capa `E2E`:
```bash
npm run test:e2e
```
Correr netamente el chequeo del Backend `API`:
```bash
npm run test:api
```
