# 📋 Documentación de Scripts - Playwright Boilerplate

Este documento detalla cada script disponible en el proyecto, su funcionamiento paso a paso, ejemplos de uso y cómo resolver problemas comunes.

---

## 📑 Índice
1. [Resumen de Scripts](#resumen-de-scripts)
2. [npm run test](#npm-run-test)
3. [npm run test:ui](#npm-run-testui)
4. [npm run test:e2e](#npm-run-teste2e)
5. [npm run test:api](#npm-run-testapi)
6. [npm run report](#npm-run-report)
7. [Resolución de Problemas](#resolución-de-problemas)
8. [Variables de Entorno](#variables-de-entorno)

---

## Resumen de Scripts

| Script | Comando | Propósito | Uso |
|--------|---------|-----------|-----|
| **test** | `npm run test` | Ejecutar TODOS los tests (E2E + API) en modo headless | CI/CD, validación general |
| **test:ui** | `npm run test:ui` | Interfaz gráfica interactiva para escribir/depurar tests | Desarrollo local |
| **test:e2e** | `npm run test:e2e` | Ejecutar solo tests de UI/E2E (interfaz gráfica) | Validar flujos de usuario |
| **test:api** | `npm run test:api` | Ejecutar solo tests de API (backend) | Validar endpoints |
| **report** | `npm run report` | Abrir el reporte HTML de la última ejecución | Análisis post-test |

---

## `npm run test`

### ¿Qué hace?
Ejecuta todos los tests del proyecto (E2E y API) en modo **headless** (sin interfaz gráfica visible) de forma paralela. Genera reportes HTML, videos y screenshots automáticamente.

### Paso a Paso de Ejecución

```
┌─────────────────────────────────────────────────────────┐
│ 1. Valida configuración (playwright.config.ts)          │
│    - Lee variables de entorno (.env)                     │
│    - Verifica URL_BASE y USUARIO_TEST                   │
│    - Valida ausencia de test.only() en CI               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Descubre todos los tests                              │
│    - Escanea carpeta ./tests recursivamente             │
│    - Localiza archivos *.spec.ts                         │
│    - Lee y registra todos los test cases                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Inicia navegadores (en paralelo)                      │
│    - Abre instancias de Chromium/Chrome                 │
│    - Por defecto: múltiples workers (CPU-dependent)     │
│    - En CI: 1 worker para no sobrecargar                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Ejecuta tests en paralelo                             │
│    - Cada worker ejecuta tests independientes           │
│    - Timeout individual: 30 segundos por test           │
│    - Timeout de aserciones: 10 segundos                 │
│    - Reintenta fallos: 1 vez (local) / 2 veces (CI)    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Recopila evidencias                                   │
│    - Captura pantallazos de cada test                   │
│    - Graba videos de ejecución (WEBM)                   │
│    - Recopila trazas (trace files)                      │
│    - Guarda en ./reports/test-results                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Genera reporte HTML                                   │
│    - Compila todos los resultados                       │
│    - Crea visualización interactiva                     │
│    - Abre automáticamente en navegador                  │
│    - Guarda en ./reports/html-report                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Global Teardown (limpieza final)                      │
│    - Ejecuta ./tests/global-teardown.ts                 │
│    - Convierte videos WEBM → MP4                        │
│    - Libera recursos de navegadores                     │
│    - Retorna código de salida (0=éxito, 1=fallos)      │
└─────────────────────────────────────────────────────────┘
```

### Ejemplos de Uso

**Ejecución básica (todos los tests):**
```bash
npm run test
```
✅ Resultado esperado:
```
✓ 100+ tests ejecutados
✓ Reporte HTML abierto automáticamente
✓ Carpeta reports/test-results llena de evidencias
```

**Ejecutar solo un archivo de test:**
```bash
npm run test -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts
```

**Ejecutar tests que coincidan con un patrón (regex):**
```bash
npm run test -- --grep "Login"
```
✅ Ejecuta solo tests con "Login" en el nombre

**Ejecutar solo en navegador específico:**
```bash
npm run test -- --project=chromium
npm run test -- --project=chrome
```

**Ejecutar con salida detallada (verbose):**
```bash
npm run test -- --reporter=verbose
```

**Detener después de N fallos:**
```bash
npm run test -- --max-failures=5
```
Útil si hay muchos fallos y quieres parar temprano

**Usar modo debug interactivo:**
```bash
npm run test -- --debug
```
⚠️ Abre Inspector de Playwright en tiempo real

### Archivos Generados

```
reports/
├── html-report/          # Reporte interactivo (abrirlo en navegador)
│   ├── index.html        # Entrada principal
│   ├── trace/            # Trazas de ejecución (debug)
│   └── ...
└── test-results/         # Evidencias crudas
    ├── screenshots/      # PNG de cada test
    ├── videos/           # MP4 grabados (post-conversión)
    └── traces/           # Archivos .zip de trazas
```

### Configuración (desde playwright.config.ts)

| Parámetro | Valor | Significado |
|-----------|-------|-------------|
| `testDir` | `./tests` | Dónde buscar tests |
| `timeout` | `30000ms` | Máximo por test individual |
| `expect.timeout` | `10000ms` | Máximo para aserciones |
| `retries` | 1 (local) / 2 (CI) | Reintentos automáticos |
| `workers` | ilimitados (local) / 1 (CI) | Procesos paralelos |
| `baseURL` | `https://bo-dexorder-qa.dexmanager.com` | URL por defecto |
| `screenshot` | `on` | Capturar screenshots |
| `video` | `on` | Grabar videos |
| `trace` | `on` | Recolectar trazas |

---

## `npm run test:ui`

### ¿Qué hace?
Abre la **Interfaz Gráfica de Pruebas de Playwright** (UI Mode). Permite escribir, editar y depurar tests visualmente con un navegador abierto en paralelo donde ves cada acción en tiempo real.

### Paso a Paso de Ejecución

```
┌─────────────────────────────────────────────────────────┐
│ 1. Inicia Playwright Test UI                            │
│    - Lanza servidor local (puerto ~3000)                │
│    - Carga configuración del proyecto                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Abre interfaz gráfica en navegador                   │
│    - Panel izquierdo: árbol de tests                    │
│    - Panel central: editor de código                    │
│    - Panel derecho: navegador de prueba en vivo        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Selecciona un test                                    │
│    - Click en test → aparece código fuente             │
│    - Muestra archivos relacionados (Page Object, etc.)  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Ejecuta test en vivo                                  │
│    - Click "Play" → test corre en navegador de la derecha│
│    - Ves CADA PASO en tiempo real                       │
│    - Paso a paso (Step through execution)               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Inspecciona selectores                               │
│    - Ícono de inspector para probar locators            │
│    - Prueba XPath, CSS, getByTestId en vivo           │
│    - Visualiza elemento resaltado en navegador          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Edita código y recarga                               │
│    - Modifica código en el editor central               │
│    - Auto-reload de cambios                             │
│    - Re-ejecuta test actualizado                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Cierra UI                                             │
│    - Ctrl+C en terminal                                 │
│    - Cierra servidor y navegadores                      │
└─────────────────────────────────────────────────────────┘
```

### Ejemplos de Uso

**Abrir UI Mode:**
```bash
npm run test:ui
```
✅ Se abre automáticamente en `http://localhost:3000`

**Abrir UI con un test específico:**
```bash
npm run test:ui -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts
```

**Ejecutar desde UI con un patrón:**
```bash
npm run test:ui -- --grep "Login"
```

### Pantalla Principal (UI Mode)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Playwright Test - UI Mode                                                   │
├─────────────────┬──────────────────────────┬──────────────────────────────┤
│   Tests Tree    │  Código del Test         │  Navegador en Vivo           │
│                 │                          │                              │
│ ✓ 1-acceso     │ test('Login Valid', ...) │  ┌──────────────────────┐   │
│   ├─ login     │                          │  │  Login Page          │   │
│   │  ├─ TC-01  │  await page.goto('...')  │  │ [usuario] [contraseña]│   │
│   │  ├─ TC-02  │  await page.fill(...)    │  │ [Ingresar]           │   │
│   └─ nav       │  await expect(...).ok()  │  └──────────────────────┘   │
│ ✓ 10-dashboard │                          │                              │
│ ✓ 2-org        │  ⏯ Play | ⏸ Pause       │                              │
│                 │  ▶ Step (paso a paso)    │                              │
│                 │                          │                              │
└─────────────────┴──────────────────────────┴──────────────────────────────┘
```

### Flujo Típico de Desarrollo

1. **Escribes nuevo test:**
   ```bash
   npm run test:ui
   ```

2. **Selecciona test en el panel izquierdo**

3. **Usa Inspector (ícono de lámpara)** para:
   - Encontrar el selector HTML correcto
   - Verificar que `getByTestId()` funciona
   - Explorar estructura DOM

4. **Ejecuta test paso a paso:**
   - Presiona Play → ves navegador hacer acciones
   - Verifica que funcione cada paso

5. **Si falla un selector:**
   - Edita el código en el editor central
   - Auto-reload recarga el test
   - Reintentas

6. **Cuando está bien:** Cierra UI (Ctrl+C) y confirma con `npm run test`

---

## `npm run test:e2e`

### ¿Qué hace?
Ejecuta **SOLO** los tests de E2E (End-to-End, interfaz gráfica/UI). Excluye tests de API. Corre todos los tests en la carpeta `tests/e2e` en modo headless paralelo.

### Paso a Paso de Ejecución

Idéntico a `npm run test`, pero **filtrando solo archivos en `tests/e2e/**`**

```
┌─────────────────────────────────────────────────────────┐
│ 1. Lee configuración de Playwright                      │
│ 2. Descubre tests SOLO en tests/e2e/                    │
│    - Ignora tests/api/                                  │
│ 3. Inicia navegadores Chromium en paralelo             │
│ 4. Ejecuta tests E2E                                    │
│    - Login tests                                        │
│    - Dashboard tests                                    │
│    - Organización / Tenants tests                       │
│    - etc.                                               │
│ 5. Genera reporte + videos + screenshots                │
│ 6. Global Teardown (conversión WEBM → MP4)             │
│ 7. Abre reporte HTML                                    │
└─────────────────────────────────────────────────────────┘
```

### Ejemplos de Uso

**Ejecutar todos los tests E2E:**
```bash
npm run test:e2e
```

**Ejecutar solo tests de Login:**
```bash
npm run test:e2e -- --grep "Login"
```

**Ejecutar solo un archivo E2E:**
```bash
npm run test:e2e -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts
```

**Ejecutar tests de un módulo específico (ej: Dashboard):**
```bash
npm run test:e2e -- --grep "MOD-DASH"
```

**Ejecutar en modo headed (ver navegador):**
```bash
npm run test:e2e -- --headed
```
📌 Útil para debugging: ves el navegador ejecutarse

**Ejecutar con un solo worker (secuencial):**
```bash
npm run test:e2e -- --workers=1
```
⏱️ Más lento, pero útil si hay conflictos de estado

**Ejecutar últimos tests fallidos:**
```bash
npm run test:e2e -- --last-failed
```

### Estructura de Tests E2E

```
tests/e2e/
├── 1-acceso/              # Módulo de acceso (Login, navegación)
│   ├── login/
│   │   ├── mod-acceso-log-tc-01.spec.ts  (Login válido)
│   │   ├── mod-acceso-log-tc-02.spec.ts  (Contraseña inválida)
│   │   ├── mod-acceso-log-tc-03.spec.ts  (Usuario inexistente)
│   │   ├── mod-acceso-log-tc-04.spec.ts  (Campos en blanco)
│   │   └── mod-acceso-log-tc-05.spec.ts  (Email inválido)
│   └── navegación/
│       ├── mod-acc-nav-tc-01.spec.ts     (Logout)
│       ├── mod-acc-nav-tc-02.spec.ts     (Bloqueo perimetral JWT)
│       ├── mod-acc-nav-tc-03.spec.ts     (Persistencia sesión)
│       └── mod-acc-nav-tc-04.spec.ts     (Rate limit)
├── 10-dashboard/          # Módulo Dashboard
│   ├── filtros/           (Tests de filtrado)
│   ├── gráficos-y-tablas-generales/
│   └── métricas-base/
├── 2-organizacion/        # Módulo Organización
│   ├── 1-tenants/         (Gestión de tenants)
│   └── 2-sucursales/      (Gestión de sucursales)
└── ... (más módulos)
```

### Métricas de Ejecución

```
Total E2E tests: ~50+
Tiempo promedio: 5-15 minutos (depende de paralelismo)
Coverage: Usuarios, seguridad, flujos críticos de negocio
```

---

## `npm run test:api`

### ¿Qué hace?
Ejecuta **SOLO** los tests de API (backend/servicios HTTP). Excluye tests E2E. Valida endpoints, payloads y códigos de respuesta sin abrir navegadores.

### Paso a Paso de Ejecución

```
┌─────────────────────────────────────────────────────────┐
│ 1. Lee configuración de Playwright                      │
│ 2. Descubre tests SOLO en tests/api/                    │
│    - Ignora tests/e2e/                                  │
│ 3. NO abre navegadores (tests API usan fetch/http)     │
│ 4. Ejecuta tests API en paralelo                        │
│    - POST /login, GET /tenants, etc.                   │
│    - Valida status codes (200, 400, 401, etc.)         │
│    - Verifica response JSON                             │
│ 5. Genera reporte (sin videos/screenshots)              │
│ 6. Retorna código de salida (0=éxito, 1=fallos)        │
└─────────────────────────────────────────────────────────┘
```

### Ejemplos de Uso

**Ejecutar todos los tests API:**
```bash
npm run test:api
```

**Ejecutar solo tests de un endpoint:**
```bash
npm run test:api -- --grep "POST.*login"
```

**Ejecutar con un solo worker:**
```bash
npm run test:api -- --workers=1
```

**Ejecutar con salida verbose:**
```bash
npm run test:api -- --reporter=verbose
```

### Estructura Esperada de Tests API

```
tests/api/
├── auth/
│   ├── login.spec.ts              (POST /auth/login)
│   ├── logout.spec.ts             (POST /auth/logout)
│   └── refresh-token.spec.ts      (POST /auth/refresh)
├── tenants/
│   ├── create-tenant.spec.ts      (POST /tenants)
│   ├── get-tenants.spec.ts        (GET /tenants)
│   ├── update-tenant.spec.ts      (PUT /tenants/:id)
│   └── delete-tenant.spec.ts      (DELETE /tenants/:id)
├── sucursales/
│   └── ... (similar)
└── ... (más endpoints)
```

**Nota:** Si la carpeta `tests/api` no existe o está vacía, este script no ejecutará nada.

---

## `npm run report`

### ¿Qué hace?
Abre el **reporte HTML interactivo** de la última ejecución de tests. Es un archivo estático que puedes compartir con el equipo.

### Paso a Paso de Ejecución

```
┌─────────────────────────────────────────────────────────┐
│ 1. Busca carpeta reports/html-report                    │
│ 2. Abre índice HTML en navegador predeterminado        │
│ 3. Carga resultado en pantalla con:                     │
│    - Listado de tests (pass/fail)                       │
│    - Duración de cada test                              │
│    - Trazas y videos de fallos                         │
│    - Mapa de flujo paso a paso                          │
└─────────────────────────────────────────────────────────┘
```

### Ejemplos de Uso

**Abrir reporte (después de ejecutar tests):**
```bash
npm run report
```
✅ Se abre en navegador: `file:///C:/bo_so/playwright-ts-boilerplate/playwright-ts-boilerplate/reports/html-report/index.html`

### Contenido del Reporte

```
Playwright HTML Report
├── Summary
│   ├── Total: 100 tests
│   ├── Passed: 95 ✓
│   ├── Failed: 5 ✗
│   ├── Skipped: 0
│   └── Duration: 12m 34s
├── Test Results (lista expandible)
│   ├── ✓ MOD-ACCESO-LOG-TC-01 | 2.5s
│   ├── ✗ MOD-DASH-FILT-TC-01 | 5.2s (FAILED)
│   │   └── Error message + stacktrace
│   │   └── Screenshots
│   │   └── Video (play inline)
│   └── ...
├── Traces (para análisis visual)
│   └── .zip con snapshots de cada paso
└── Attachments (screenshots, videos)
```

### Funcionalidades del Reporte

| Funcionalidad | Descripción |
|---------------|-------------|
| **Búsqueda** | Filtra tests por nombre (Ctrl+K) |
| **Videos** | Reproduce ejecución fallida |
| **Screenshots** | Visualiza captura del error |
| **Trace Viewer** | Abre inspector visual paso a paso |
| **Estadísticas** | Gráficos de duración y resultados |
| **Filtrado** | Muestra solo passed/failed/skipped |

### Compartir Reporte

La carpeta `reports/html-report` puede comprimirse y compartirse:
```bash
# Linux/Mac
tar -czf reporte.tar.gz reports/html-report

# Windows (PowerShell)
Compress-Archive -Path reports/html-report -DestinationPath reporte.zip
```

---

## Resolución de Problemas

### ❌ Error: "URL_BASE not defined"

**Síntoma:**
```
⚠️ [ANTI-FLAKY WARN]: "URL_BASE" no está definido en tu .env. Usando entorno QA de fallback.
```

**Causa:** Falta archivo `.env` o no tiene `URL_BASE`

**Solución:**
```bash
# Copia el template
cp .env.example .env

# Edita .env y agrega
URL_BASE=http://localhost:3000  # O tu URL de desarrollo
USUARIO_TEST=usuario@test.com
CONTRASENA_TEST=password123
```

### ❌ Error: "USUARIO_TEST missing"

**Síntoma:**
```
⚠️ [ANTI-FLAKY WARN]: Faltan credenciales en el .env como "USUARIO_TEST"
```

**Causa:** Credenciales de test no configuradas

**Solución:** Agrega a `.env`:
```
USUARIO_TEST=usuario@dominio.com
CONTRASENA_TEST=contraseña_segura
```

### ❌ Error: "Timeout waiting for event"

**Síntoma:**
```
Timeout 30000ms exceeded while waiting for event "load"
```

**Causa:** Elemento no apareció en 30 segundos

**Solución:**
```typescript
// Aumenta timeout para un test específico
test.setTimeout(60000); // 60 segundos

// O aumenta timeout para una acción
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
```

### ❌ Error: "Connection refused"

**Síntoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Causa:** La aplicación no está corriendo en la URL

**Solución:**
```bash
# Inicia la app en otra terminal
npm start  # o según tu proyecto

# Luego ejecuta tests
npm run test
```

### ❌ Error: "Port 3000 already in use"

**Síntoma:**
```
EADDRINUSE: address already in use :::3000
```

**Causa:** Otro proceso ocupa el puerto

**Solución:**
```bash
# Mata proceso en puerto 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Stop-Process -Port 3000 -Force

# O usa puerto diferente en .env
UI_PORT=4000
```

### ❌ Error: "test.only() forbidden in CI"

**Síntoma:**
```
Forbidden: test.only() is not allowed on CI environments
```

**Causa:** Dejaste `test.only()` en el código y está en CI

**Solución:**
```typescript
// ❌ Malo en CI
test.only('Should login', async () => { ... })

// ✅ Correcto
test('Should login', async () => { ... })

// Remueve .only() y commitea
```

### ❌ Error: "Video conversion failed (WEBM → MP4)"

**Síntoma:**
```
Error: ffmpeg not found
```

**Causa:** FFmpeg no está instalado

**Solución:**
```bash
# Linux (Debian/Ubuntu)
apt-get install ffmpeg

# Mac (Homebrew)
brew install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# O desactiva videos en config si no los necesitas
# En playwright.config.ts cambiar:
video: 'off'  // En lugar de 'on'
```

### ❌ Error: "Worker crash"

**Síntoma:**
```
Worker process crashed
```

**Causa:** Test muy pesado o memory leak

**Solución:**
```bash
# Ejecuta con menos workers
npm run test -- --workers=1

# O ejecuta ese test aislado
npm run test -- tests/e2e/ruta/test-pesado.spec.ts
```

### ❌ Tests pasan local pero fallan en CI

**Síntoma:**
```
✓ Local: PASS
✗ CI: FAIL
```

**Causa Probable:**
- Diferencia en variables de entorno
- Timing/race conditions
- Navegador diferente en CI

**Solución:**
```bash
# Simula entorno CI localmente
CI=true npm run test

# O revisa logs de CI para variables faltantes
npm run test -- --reporter=verbose
```

---

## Variables de Entorno

### Variables Requeridas en `.env`

```bash
# URL de la aplicación a testear
URL_BASE=https://bo-dexorder-qa.dexmanager.com

# Credenciales de test
USUARIO_TEST=usuario@dominio.com
CONTRASENA_TEST=password123

# Opcional: Token pre-existente (si aplica)
AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variables de Control de Ejecución

```bash
# CI Environment (activado por GitHub Actions, Jenkins, etc.)
CI=true  # Activa política especial: 1 worker, retries=2

# Debug mode
DEBUG=pw:api  # Logs verbosos de Playwright
PWDEBUG=1      # Inspector interactivo

# Navegador específico
BROWSER=firefox  # En lugar de chromium (si está habilitado)

# Timeout personalizado
TIMEOUT=60000  # Milisegundos globales
```

### Variables Opcionales

```bash
# Para tests API
API_BASE_URL=https://api.ejemplo.com
API_TOKEN=token_para_autenticación

# Para reportes
REPORT_DIR=./mi-carpeta-reports
REPORT_ALWAYS_OPEN=true

# Para traces
TRACE=on  # Recolectar trazas detalladas
SCREENSHOT=on
VIDEO=on
```

### Estructura `.env` Completa (Recomendada)

```bash
# ============================================
# 🌐 CONFIGURACIÓN DE LA APLICACIÓN
# ============================================
URL_BASE=https://bo-dexorder-qa.dexmanager.com

# ============================================
# 🔐 CREDENCIALES DE TEST
# ============================================
USUARIO_TEST=usuario@dominio.com
CONTRASENA_TEST=password123
USUARIO_ADMIN=admin@dominio.com
CONTRASENA_ADMIN=admin123

# ============================================
# 🔧 CONFIGURACIÓN DE TIMEOUT (ms)
# ============================================
TIMEOUT=30000       # Timeout global por test
EXPECT_TIMEOUT=10000 # Timeout para aserciones

# ============================================
# 🎯 CONFIGURACIÓN DE NAVEGADORES
# ============================================
BROWSER=chromium    # chromium, firefox, webkit
HEADED=false        # true = ver navegador

# ============================================
# 🐛 DEBUG (descomenta según necesites)
# ============================================
# DEBUG=pw:api
# PWDEBUG=1

# ============================================
# ☁️ CI ENVIRONMENT (GitHub Actions, etc.)
# ============================================
# CI=true (se auto-detecta en CI, no necesita definir)
```

### Cómo Cargar Variables de Entorno

**Método 1: Archivo `.env` (recomendado para desarrollo)**
```bash
# Copia template
cp .env.example .env

# Edita con tu editor favorito
nano .env  # o VSCode, Notepad++, etc.

# Playwright las carga automáticamente (dotenv integrado)
npm run test
```

**Método 2: Desde línea de comandos**
```bash
# Linux/Mac
export URL_BASE=http://localhost:3000
npm run test

# Windows (PowerShell)
$env:URL_BASE="http://localhost:3000"
npm run test

# Windows (CMD)
set URL_BASE=http://localhost:3000
npm run test
```

**Método 3: `.env` por ambiente**
```bash
.env              # Variables locales (gitignored)
.env.example      # Template en repo
.env.ci           # Variables para CI
.env.staging      # Variables para staging
.env.production   # Variables para producción (¡CUIDADO!)
```

Para usar `.env.ci`:
```bash
npm run test -- --config=.env.ci
```

---

## 📊 Resumen Rápido

| Necesidad | Script | Comando |
|-----------|--------|---------|
| Correr todo en CI/CD | `test` | `npm run test` |
| Desarrollar/depurar test | `test:ui` | `npm run test:ui` |
| Validar flujos UI | `test:e2e` | `npm run test:e2e` |
| Validar APIs | `test:api` | `npm run test:api` |
| Ver resultados último run | `report` | `npm run report` |

---

## 📚 Referencias

- [Documentación Oficial Playwright](https://playwright.dev)
- [Playwright Test Documentation](https://playwright.dev/docs/intro)
- [Playwright Reporters](https://playwright.dev/docs/test-reporters)
- [Debugging Playwright Tests](https://playwright.dev/docs/debug)

---

**Última actualización:** Abril 2025 | Versión: 1.0.0

