# 🔧 Troubleshooting Avanzado - Scripts y Ejecución

Guía detallada para resolver problemas complejos en la ejecución de scripts.

---

## 📋 Índice Rápido de Errores

| Error | Sección | Solución |
|-------|---------|----------|
| URL_BASE not defined | [URL/Env](#url-y-env) | Crea/Edita `.env` |
| Port already in use | [Puertos](#puertos-ocupados) | Mata proceso o cambia puerto |
| Timeout waiting for element | [Timing](#timeouts-y-tiempos-de-espera) | Aumenta timeout |
| Video conversion failed | [Videos](#videos-y-ffmpeg) | Instala FFmpeg |
| Worker crash | [Resources](#recursos-y-memoria) | Reduce workers/paralelismo |
| Tests pass local, fail CI | [CI/CD](#cicd-y-entornos) | Revisa vars de entorno |

---

## 🌐 URL y Env

### Problema: "URL_BASE not defined"

**Síntomas:**
```
⚠️ [ANTI-FLAKY WARN]: "URL_BASE" no está definido en tu .env. 
   Usando entorno QA de fallback.
```

**Diagnóstico:**
```bash
# Verifica si .env existe
ls -la .env  # Linux/Mac
dir .env     # Windows

# Verifica contenido
cat .env  # Linux/Mac
type .env # Windows
```

**Soluciones:**

**Opción 1: Crear `.env` desde template (recomendado)**
```bash
# Si existe .env.example
cp .env.example .env

# Edita con tu URL
nano .env  # O abre con VSCode
```

**Opción 2: Crear `.env` manual**
```bash
# Windows (PowerShell)
@'
URL_BASE=http://localhost:3000
USUARIO_TEST=usuario@test.com
CONTRASENA_TEST=password123
'@ | Out-File -Encoding UTF8 .env

# Linux/Mac
cat > .env << 'EOF'
URL_BASE=http://localhost:3000
USUARIO_TEST=usuario@test.com
CONTRASENA_TEST=password123
EOF
```

**Opción 3: Variable de línea de comandos (temporal)**
```bash
# Linux/Mac
export URL_BASE=http://localhost:3000
npm run test

# Windows PowerShell
$env:URL_BASE="http://localhost:3000"
npm run test

# Windows CMD
set URL_BASE=http://localhost:3000
npm run test
```

**Verificación:**
```bash
npm run test -- --list
```
Si corre sin warnings, está bien.

---

### Problema: "Credenciales faltando (USUARIO_TEST)"

**Síntomas:**
```
⚠️ [ANTI-FLAKY WARN]: Faltan credenciales en el .env como "USUARIO_TEST". 
   Los tests que lo requieran arrojarán Error Crítico de setup.
```

**Solución:**

Agrega a `.env`:
```bash
USUARIO_TEST=usuario@dominio.com
CONTRASENA_TEST=SuContraseñaSegura123!
```

**Verificación en tests:**
```typescript
// Usa desde fixture
test('Login', async ({ page }) => {
  const usuario = process.env.USUARIO_TEST;
  const contra = process.env.CONTRASENA_TEST;
  
  // Verifica que existan
  if (!usuario || !contra) {
    throw new Error('Credenciales no configuradas en .env');
  }
  
  await page.fill('input[name="email"]', usuario);
  await page.fill('input[name="password"]', contra);
});
```

---

### Problema: Variables con espacios o caracteres especiales

**Síntomas:**
```
Error: Invalid URL
```

**Solución:**

En `.env`, usa quotes:
```bash
# ❌ Malo
URL_BASE=http://localhost:3000/path with spaces

# ✅ Correcto - sin espacios
URL_BASE=http://localhost:3000/path

# ✅ O si es necesario, usa URL encoding
URL_BASE=http://localhost:3000/path%20with%20spaces

# ✅ Para passwords, también quote
CONTRASENA_TEST="Mi@Contraseña!Con#Caracteres"
```

---

## 🔌 Puertos Ocupados

### Problema: "EADDRINUSE: Port 3000 already in use"

**Síntomas:**
```
Error: EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (net.js:1040:11)
```

**Causa:** Otro proceso usa el puerto (servidor anterior no cerrado, otra app, etc.)

**Solución 1: Matar proceso en el puerto (recomendado)**

```bash
# Linux/Mac - Encontrar y matar
lsof -ti:3000 | xargs kill -9

# O más seguro
lsof -i :3000
# Luego
kill -9 <PID>

# Windows PowerShell (Admin)
Stop-Process -Port 3000 -Force

# Windows CMD (Admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solución 2: Usar puerto diferente**

En `.env`:
```bash
# Cambiar puerto en la app
PORT=4000
URL_BASE=http://localhost:4000

# O variable de entorno
export PORT=4000
npm start
```

Luego en otro terminal:
```bash
npm run test
```

**Solución 3: Esperar a que se libere**

```bash
# En Linux/Mac, monitorear puerto
watch 'lsof -i :3000 || echo "Puerto libre"'

# En Windows, comprobar periódicamente
netstat -ano | findstr :3000
```

---

## ⏱️ Timeouts y Tiempos de Espera

### Problema: "Timeout 30000ms exceeded while waiting for event"

**Síntomas:**
```
Timeout 30000ms exceeded while waiting for element to be visible
at /path/to/test.spec.ts:25:7
```

**Causa:** Elemento no apareció en 30 segundos (timeout por defecto)

**Diagnóstico:**

```bash
# Ejecuta en modo headed para ver qué pasa
npm run test:e2e -- --headed --grep "tu-test"

# O usa test:ui
npm run test:ui
```

**Soluciones:**

**Opción 1: Aumentar timeout para un test**
```typescript
test.setTimeout(60000);  // 60 segundos

test('Debe cargar datos lentos', async ({ page }) => {
  // Código del test
});
```

**Opción 2: Aumentar timeout para una acción específica**
```typescript
// Para un goto
await page.goto('/dashboard', { 
  waitUntil: 'networkidle',
  timeout: 60000  // 60 seg
});

// Para un expect
await expect(page.locator('data-testid=resultado')).toBeVisible({ 
  timeout: 60000 
});

// Para un click
await page.click('#botón', { timeout: 20000 });
```

**Opción 3: Cambiar global en playwright.config.ts**
```typescript
export default defineConfig({
  timeout: 60000,  // Aumenta de 30s a 60s
  expect: {
    timeout: 20000,  // Aumenta assertions de 10s a 20s
  },
});
```

**Opción 4: Mejorar selectores (más específicos = más rápidos)**
```typescript
// ❌ Lento - selector muy general
await page.locator('button').click();

// ✅ Rápido - selector específico con testid
await page.getByTestId('submit-button').click();

// ✅ También bueno - CSS más específico
await page.locator('[data-testid="submit-button"]').click();
```

**Opción 5: Usar WaitFor helpers**
```typescript
// Crear helper personalizado
async function waitForElementAndClick(page, selector, timeout = 30000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
  await page.locator(selector).click();
}

// Uso
await waitForElementAndClick(page, '[data-testid="submit"]', 60000);
```

---

### Problema: Tests pasan a veces, fallan otras (flaky)

**Síntomas:**
```
✓ Run 1: PASS
✗ Run 2: FAIL - Timeout
✓ Run 3: PASS
```

**Causa:** Elemento no siempre tarda igual, red inestable, etc.

**Soluciones:**

```typescript
// ❌ Malo - timeout fijo
await page.waitForTimeout(2000);  // Esperar siempre 2 seg
await page.click('#boton');

// ✅ Bueno - esperar a que esté visible
await page.locator('#boton').waitFor({ state: 'visible' });
await page.click('#boton');

// ✅ Mejor - usar wait helpers
async function clickWhenVisible(page, selector) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout: 30000 });
  await element.scrollIntoViewIfNeeded();  // Asegura visible
  await element.click();
}

// Uso
await clickWhenVisible(page, '[data-testid="submit"]');
```

---

## 🎬 Videos y FFmpeg

### Problema: "ffmpeg not found" / "Video conversion failed"

**Síntomas:**
```
Error: ffmpeg not found
Error: ENOENT: no such file or directory, spawn 'ffmpeg'
```

**Causa:** FFmpeg no instalado, necesario para convertir WEBM → MP4

**Solución 1: Instalar FFmpeg**

```bash
# Linux (Debian/Ubuntu)
sudo apt-get update
sudo apt-get install ffmpeg

# Linux (Fedora/CentOS)
sudo dnf install ffmpeg

# Mac (Homebrew)
brew install ffmpeg

# Windows (Chocolatey - como Admin)
choco install ffmpeg

# Windows (Manual)
# Descarga de https://ffmpeg.org/download.html
# Agrega a PATH del sistema
```

**Verificación:**
```bash
ffmpeg -version
```

**Solución 2: Desactivar videos (si no los necesitas)**

En `playwright.config.ts`:
```typescript
export default defineConfig({
  use: {
    video: 'off',  // Desactiva grabar videos
    screenshot: 'on',  // Mantén screenshots
    trace: 'on',
  },
});
```

Luego re-ejecuta:
```bash
npm run test:e2e
```

**Solución 3: Usar contenedor Docker (evita instalar nada)**

```bash
# Ejecuta tests en Docker (si tienes Docker)
docker run -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.42.0 npm run test
```

---

## 💾 Recursos y Memoria

### Problema: "Worker process crashed" / "Out of memory"

**Síntomas:**
```
Worker process crashed unexpectedly
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**Causa:** Tests consumen mucha memoria, muchos workers paralelos, memory leak

**Soluciones:**

**Opción 1: Reducir workers (paralelismo)**
```bash
# Ejecuta con 1 worker (secuencial)
npm run test:e2e -- --workers=1

# O con pocos workers
npm run test:e2e -- --workers=2
```

**Opción 2: Ejecutar tests específicos (no todos)**
```bash
# Solo un test file
npm run test:e2e -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts

# Solo un módulo
npm run test:e2e -- --grep "MOD-ACCESO-LOG"
```

**Opción 3: Aumentar memoria del proceso Node**
```bash
# Linux/Mac
NODE_OPTIONS=--max-old-space-size=4096 npm run test

# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run test

# Windows CMD
set NODE_OPTIONS=--max-old-space-size=4096
npm run test
```

**Opción 4: Mejorar código (memory leaks)**
```typescript
// ❌ Malo - acumula pages sin cerrar
test('Multi page test', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  // ... pages no se cierran automáticamente
});

// ✅ Bueno - limpia recursos
test('Multi page test', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  
  // ... código ...
  
  // Limpia explícitamente
  await page1.close();
  await page2.close();
  await context.close();
});

// ✅ Mejor - usar scope automático
test('Multi page test', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // ...
  } finally {
    await context.close();  // Cierra todo
  }
});
```

**Diagnóstico avanzado:**
```bash
# Monitorear memoria mientras corren tests
# Linux/Mac
watch 'ps aux | grep -E "node|playwright"'

# Windows
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*playwright*"} | Select ProcessName, @{Name="Memory(MB)";Expression={$_.WorkingSet / 1MB -as [int]}}
```

---

## 🚦 CI/CD y Entornos

### Problema: "Tests pasan local, fallan en CI"

**Síntomas:**
```
✓ Local:
  15 passed
  
✗ CI (GitHub Actions):
  3 passed
  12 failed
```

**Causa más común:** Diferencia en variables de entorno

**Diagnóstico:**

```bash
# Simula entorno CI localmente
CI=true npm run test

# O ejecuta como lo hace CI
export CI=true
npm run test:e2e
```

**Soluciones:**

**Opción 1: Verificar variables de entorno en CI**

En `.github/workflows/test.yml` o tu CI config:
```yaml
env:
  URL_BASE: ${{ secrets.QA_URL }}
  USUARIO_TEST: ${{ secrets.QA_USER }}
  CONTRASENA_TEST: ${{ secrets.QA_PASSWORD }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test
```

**Opción 2: Verbose output en CI**

```bash
# Añade reportes verbose
npm run test -- --reporter=verbose

# O con debug
DEBUG=pw:api npm run test
```

**Opción 3: Ajustar config para CI**

En `playwright.config.ts`:
```typescript
export default defineConfig({
  // Config específica para CI
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60000 : 30000,  // Más tiempo en CI
  
  use: {
    // En CI, toma evidencia de TODO
    screenshot: 'only-on-failure',  // Solo fallos
    video: 'retain-on-failure',  // Solo fallos
    trace: 'on-first-retry',  // En reintentos
  },
});
```

**Opción 4: Revisar logs de CI**

```bash
# En GitHub Actions, descarga artifacts
# En GitLab, revisa logs del runner
# En Jenkins, revisa console output

# Busca patrones:
# - "Timeout" → aumenta timeout
# - "Connection refused" → URL incorrecta
# - "Authentication failed" → credenciales wrong
```

---

### Problema: Tests corren diferente en Docker

**Síntomas:**
```
✓ Windows local: PASS
✗ Docker/Linux CI: FAIL
```

**Causa:** Diferencias de sistema operativo, navegador, etc.

**Soluciones:**

```bash
# Ejecuta en Docker mismo entorno que CI
docker run -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.42.0-focal bash -c "npm install && npm run test"

# O con variables de entorno
docker run \
  -v $(pwd):/app \
  -w /app \
  -e URL_BASE="http://host.docker.internal:3000" \
  -e USUARIO_TEST="test@test.com" \
  mcr.microsoft.com/playwright:v1.42.0-focal \
  npm run test
```

---

## 🔍 Debug Avanzado

### Modo Debug Interactivo

```bash
# Abre inspector en vivo
npm run test:e2e -- --debug

# O con un test específico
npm run test -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts --debug
```

Comandos en Inspector:
```
runStep()     - Ejecuta siguiente paso
pause()       - Pausa ejecución
resume()      - Continúa
exit()        - Sale del debug
```

### Logs Detallados

```bash
# Logs de Playwright
DEBUG=pw:api npm run test

# Logs de navegadores
DEBUG=pw:browser npm run test

# Todos los logs
DEBUG=* npm run test

# Guardar logs a archivo
DEBUG=pw:* npm run test > test.log 2>&1
```

### Screenshots/Videos de Fallos

Automáticamente generados en:
```
reports/test-results/
├── screenshots/
│   └── [test-name]-[timestamp].png
└── videos/
    └── [test-name]-[timestamp].mp4
```

Ver reporte:
```bash
npm run report
```

---

## 📊 Checklist de Troubleshooting

Cuando un test falla:

- [ ] ¿Existe `.env` con `URL_BASE`?
- [ ] ¿Está la aplicación corriendo en esa URL?
- [ ] ¿El selector es específico (usa `data-testid`)?
- [ ] ¿El timeout es suficiente (≥30s)?
- [ ] ¿Hay flakiness? (prueba varias veces)
- [ ] ¿Funciona en `test:ui`?
- [ ] ¿Los logs muestran algo útil? (usar `--reporter=verbose`)
- [ ] ¿Es un problema de timing? (usa `waitFor` en lugar de `sleep`)
- [ ] ¿Diferencia local vs CI? (simula con `CI=true`)

---

## 🆘 Últimas Opciones

Si nada funciona:

```bash
# 1. Nuclear option - limpia todo
rm -rf node_modules reports
npm install
npx playwright install

# 2. Ejecuta un test desde cero
npm run test -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts --headed --max-failures=1

# 3. Genera debugging report
npm run test -- --reporter=html reports/debug-report

# 4. Revisa CLAUDE.md y SCRIPTS.md completos
cat SCRIPTS.md | grep -i "tu-error"
```

---

**¿Problema no resuelto?** 

1. Revisa [SCRIPTS.md](./SCRIPTS.md) sección "Resolución de Problemas"
2. Abre issue en GitHub con:
   - Tu OS (Windows/Mac/Linux)
   - Output de `node -v` y `npm -v`
   - El log completo del error
   - Pasos para reproducir

