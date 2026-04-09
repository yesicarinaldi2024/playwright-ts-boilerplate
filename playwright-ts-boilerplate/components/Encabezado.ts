import { Page, Locator, expect } from '@playwright/test';

/**
 * Componentes Reutilizables de Interfaz.
 * Permite evitar la duplicación de código para partes modulares como Header, Menús, Footers.
 */
export class Encabezado {
  readonly tituloApp: Locator;
  readonly botonInteraccionMenu: Locator;

  constructor(public readonly page: Page) {
    // Se recomienda siempre presionar a Dev por el atributo `data-testid`
    this.tituloApp = page.locator('.app_logo');
    this.botonInteraccionMenu = page.getByRole('button', { name: 'Open Menu' });
  }

  /**
   * Sirve como validación general de que entramos exitosamente a una zona protegida.
   */
  async validarVisibilidadHeaderCorrecta() {
    await expect(this.tituloApp).toBeVisible();
  }
}
