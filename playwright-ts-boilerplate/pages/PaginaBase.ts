import { Page, expect } from '@playwright/test';

/**
 * Clase Base de la cual heredan todos los Page Objects.
 * Contiene la instanciación principal manejando contexto de una página Playwright.
 */
export abstract class PaginaBase {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a una ruta asegurándose predeterminadamente que la interfaz estabilice minimizando fallos concurrentes.
   * 
   * @param ruta - URL relativa a la baseURL del config o URL absoluta
   */
  async visitar(ruta: string) {
    await this.page.goto(ruta, { waitUntil: 'domcontentloaded' });
    // Asegurar que la página está lista
    await this.page.waitForLoadState('networkidle');
  }

  async verificarTextoVisible(texto: string) {
    // Playwright auto-wait gestiona la aparición sin bloquearse tontamente con networkidle
    await expect(this.page.getByText(new RegExp(texto, 'i')).first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Valida que la URL actual contenga un segmento esperado (Guard de navegación).
   */
  async validarRutaContiene(segmento: string) {
    await this.page.waitForURL(new RegExp(`.*${segmento}.*`), { timeout: 15000 });
  }
}
