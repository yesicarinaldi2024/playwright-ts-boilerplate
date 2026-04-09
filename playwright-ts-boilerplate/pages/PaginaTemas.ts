import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Temas
 */
export class PaginaTemas extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/themes');
    await this.validarRutaContiene('/themes');
  }
}
