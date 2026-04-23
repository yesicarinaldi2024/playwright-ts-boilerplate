# ⚡ Guía Rápida de Scripts - Referencia Rápida

## 🎯 Elige tu Script Según tu Necesidad

### 👨‍💻 Desarrollo Local (Escribir/Depurar Tests)
```bash
npm run test:ui
```
✅ Abre interfaz gráfica interactiva  
✅ Ves el navegador en tiempo real  
✅ Inspecciona selectores visualmente  
✅ Paso a paso debugger  

**Duración:** Mientras trabajas  
**Navegador visible:** SÍ  

---

### ✅ Validar Antes de Hacer Commit
```bash
npm run test
```
✅ Ejecuta TODO (E2E + API)  
✅ Modo headless (sin GUI)  
✅ Reintenta fallos automáticamente  
✅ Genera reporte HTML  

**Duración:** 5-15 min  
**Navegador visible:** NO  

---

### 🎨 Validar Solo Flujos de UI
```bash
npm run test:e2e
```
✅ Solo tests de interfaz gráfica  
✅ Excluye tests de API  
✅ Paralelo y headless  
✅ Con videos + screenshots  

**Duración:** 5-10 min  
**Navegador visible:** NO  

---

### 🔌 Validar Solo APIs/Backend
```bash
npm run test:api
```
✅ Solo tests de endpoints  
✅ Sin abrir navegadores  
✅ Rápido y ligero  
✅ Valida JSON responses  

**Duración:** 30-60 seg  
**Navegador visible:** NO  
**Estado:** ⚠️ No hay tests API actualmente

---

### 📊 Ver Resultados Último Run
```bash
npm run report
```
✅ Abre reporte HTML interactivo  
✅ Visualiza videos de fallos  
✅ Screenshots de cada test  
✅ Timeline paso a paso  

**Duración:** Instantáneo  
**Navegador visible:** SÍ  

---

## 🚦 Matriz de Decisión

```
¿Necesitas ver el navegador?
├── SÍ → npm run test:ui
└── NO  →
    ¿Qué quieres testear?
    ├── Todo → npm run test
    ├── Solo UI → npm run test:e2e
    ├── Solo API → npm run test:api
    └── Ver resultados → npm run report
```

---

## 📋 Variantes Útiles

### Ejecutar Test Específico
```bash
# Todos los scripts aceptan filtros:

npm run test -- tests/e2e/1-acceso/login/mod-acceso-log-tc-01.spec.ts

npm run test:e2e -- --grep "Login"

npm run test -- --grep "MOD-DASH"
```

### Modo Headed (Ver Navegador)
```bash
npm run test:e2e -- --headed
npm run test -- --headed  # Solo primeros workers
```

### Ejecución Secuencial (No Paralela)
```bash
npm run test:e2e -- --workers=1
```
⏱️ Más lento pero evita conflictos de estado

### Debug Interactivo
```bash
npm run test -- --debug
```
Abre Playwright Inspector en vivo

### Último Intento (Retry Only)
```bash
npm run test -- --last-failed
```
Re-ejecuta SOLO tests que fallaron

---

## 🐛 Problemas Comunes & Soluciones Rápidas

| Problema | Comando | Resultado |
|----------|---------|-----------|
| Test no encontrado | `npm run test -- --list` | Lista TODOS los tests |
| Error de URL | Edita `.env` | Agrega `URL_BASE=...` |
| Navegador no se abre | `npx playwright install` | Instala browsers |
| Puerto ocupado | `npm run test -- --workers=1` | Reduce paralelismo |
| Test lento | `npm run test:e2e -- --headed` | Ve qué pasa visualmente |
| Muchos fallos | `npm run test -- --max-failures=3` | Para después de 3 fallos |

---

## ⏱️ Tiempos Esperados

| Script | Tiempo |
|--------|--------|
| `npm run test` | 10-15 min (depende CPU) |
| `npm run test:e2e` | 8-12 min |
| `npm run test:api` | < 1 min (sin tests actualmente) |
| `npm run test:ui` | Interactivo, sin límite |
| `npm run report` | Instantáneo |

**Nota:** Times estimados en máquina moderna (8+ cores)

---

## 🎮 Teclas de Atajo en test:ui

| Tecla | Acción |
|-------|--------|
| **Play** | Ejecuta test seleccionado |
| **Pause** | Pausa ejecución |
| **Step** | Avanza un paso |
| **Ctrl+K** | Búsqueda de tests |
| **Inspector** | Herramienta de selectores |
| **Ctrl+C** | Cierra UI Mode |

---

## 📁 Estructura de Reportes

Después de ejecutar tests:

```
reports/
├── html-report/
│   └── index.html          ← Abrí esto en navegador
│                              (o `npm run report`)
└── test-results/
    ├── screenshots/        ← Fotos de cada test
    ├── videos/             ← MP4 grabados
    └── traces/             ← Datos de debug
```

---

## 🚀 Flujo Típico de Trabajo

```
1. Escribo nuevo test
   → npm run test:ui
   → (Depuro visualmente en UI Mode)

2. Test funciona
   → Ctrl+C (cierro UI Mode)

3. Valido localmente
   → npm run test:e2e --grep "mi-test"
   ✓ PASS

4. Commit & Push
   → CI ejecuta npm run test automáticamente
   ✓ CI PASS

5. Después si algo falla
   → npm run report
   → Analizo videos y screenshots
```

---

## 🔐 Archivo .env Mínimo

```bash
URL_BASE=https://bo-dexorder-qa.dexmanager.com
USUARIO_TEST=usuario@dominio.com
CONTRASENA_TEST=password123
```

**Nota:** Nunca commitear `.env` (usa `.env.example` como template)

---

## 📚 Ver Documentación Completa

Para detalles completos sobre cada script:
→ Lee [SCRIPTS.md](./SCRIPTS.md)

---

**Pro Tips:** 
- 💡 Usa `--grep` para filtrar tests sin tocar código
- 💡 `npm run test:ui` es perfecto para aprender selectores
- 💡 Reportes HTML se pueden compartir por email/Slack
- 💡 Videos útiles para demostrar a Product/QA

