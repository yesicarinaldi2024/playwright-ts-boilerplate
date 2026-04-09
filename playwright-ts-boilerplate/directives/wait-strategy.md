# Estrategia de Esperas (Waits)

## Problema de Sincronización 
Casi el 60% de inestabilidad en automatización sucede porque el FrameWork intenta actuar sobre elementos que "Aún no están listos" (No visibles, bloqueados, superpuestos).

## Solución auto-wait de Playwright
Playwright cuenta con [controles de accionamiento natural (actionability checks)](https://playwright.dev/docs/actionability) antes de proceder con un `click` o `fill` (espera visibilidad, estado habilitado, etc.).

### Prácticas Requeridas para un Código Consistente

1. **No integres Tiempos Estáticos**: `await page.waitForTimeout(5000);` es un anti-patrón de automatización que enaltece tiempos de ejecución innecesarios.

2. **Sincronización mediante red (API Response waits)**:
Si una caja o grilla se renderiza luego de una petición HTTP a back-end, la forma idónea es:
```typescript
// Espera de manera atada al evento de red, no un tiempo arbitrario.
const respuesta = await page.waitForResponse(response => 
  response.url().includes('/api/v1/productos') && response.status() === 200
);
// Ya tenemos certeza de que el payload llegó, procede a seleccionar en la UI:
await testPage.getByTestId('tabla-productos').waitFor({ state: 'visible' });
```

3. **Aserciones explícitas dinámicas**:
En vez del habitual assert que falla inmediato, confía en `expect():`
```typescript
// Aserción orientada a la red (web-first context): Playwright sondeará hasta 10 segundos continuos (timeout) por si esto de repende cambia de DOM a ser Visible u Oculto.
await expect(locator).toBeVisible(); 
```
