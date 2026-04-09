import { Page, Locator } from '@playwright/test';

/**
 * Módulo de Utilidades Centralizadas para Esperas Robustas
 * 
 * Este helper nos abstrae de lógica repetitiva en las páginas
 * orientada a una filosofía Anti-Flakiness.
 */

export class WaitHelper {
  
  /**
   * Garantiza que la página y su árbol dom mínimo estén montados.
   */
  static async esperarCargaDOMBasica(page: Page) {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * En SPA o frameworks muy asíncronos y con cargas diferidas (loaders infinitos),
   * esperamos de forma inteligente hasta que el spinner esté fuera de nuestro panorama,
   * sin depender de timeouts forzados.
   */
  static async esperarDesaparicionDelLoader(locatorLoader: Locator, testTimeout = 15000) {
    // Al esperar un estado de visualización hidden u oculto nos aseguramos que interactuar después no lance error "elemento bloqueado"
    await locatorLoader.waitFor({ state: 'hidden', timeout: testTimeout });
  }

  /**
   * Método disuasivo solo bajo un escenario que realmente no tenga soporte alternativo.
   * Dispara una alerta o un warning de consola siempre recordando el Patrón.
   */
  static async pausaEstaticaDesaconsejada(page: Page, msTiempo: number, motivoRequerido: string) {
    console.warn(`[ANTI-PATRÓN ACTIVADO]: Ejecutando sleep estático de ${msTiempo} ms. Motivo justificado explícito: "${motivoRequerido}". Intente reemplazar esto mediante waitForResponse en un futuro.`);
    await page.waitForTimeout(msTiempo);
  }
}
