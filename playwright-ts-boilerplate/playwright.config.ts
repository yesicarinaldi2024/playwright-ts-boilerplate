import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno del sistema local o del archivo .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Configuración de Playwright enfocada en estabilidad, determinismo y ejecución anti-flaky
 */
export default defineConfig({
  testDir: './tests',
  /* Script de conversión WEBM a MP4 */
  globalTeardown: require.resolve('./tests/global-teardown'),
  /* Ejecutar tests en archivos completamente en paralelo */
  fullyParallel: true,
  /* Fallar la compilación si accidentalmente se deja test.only() en el código fuente (CI) */
  forbidOnly: !!process.env.CI,
  /* Política de reintentos: 
   * Local: 1 (Para ver el problema y solucionarlo en lugar de depender del retry)
   * CI: 2 (Únicamente para mitigar interacciones reales de red anómalas)
   */
  retries: process.env.CI ? 2 : 1,
  /* Workers (procesos paralelos): Optimizados a nivel de la máquina en CI para no sobrecargar el entorno. */
  workers: process.env.CI ? 1 : undefined,
  /* Sistema de reportaje para análisis posteriores */
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'always' }],
    ['list']
  ],
  /* Carpeta para resultados de tests (evidencias) */
  outputDir: 'reports/test-results',
  /* Tiempo de espera general agresivo (30s) y aserciones explícitas de 10s. Previene bloqueos "hanged". */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  /* Opciones predeterminadas a usar por todos los tests */
  use: {
    /* La URL a la base del entorno, e.g. await page.goto('/') */
    baseURL: process.env.URL_BASE || 'https://bo-dexorder-qa.dexmanager.com',

    /* Recolección de trazas para diagnosticar fallos visual y programáticamente. */
    trace: 'on',
    
    /* Tomar capturas de pantalla de la página en cada test. */
    screenshot: 'on',

    /* Grabación de video disponible para cada ejecución. */
    video: 'on',

    /* Priorizar identificadores únicos y testeables. Ej: getByTestId('boton-guardar') */
    testIdAttribute: 'data-testid',
  },

  /* Diferentes proyectos/entornos a simular. Se simplifica a Chromium por defecto. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Usa la instalación de Google Chrome del sistema
      },
    },
    // Descomentar para habilitar testing en otros navegadores
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
});
