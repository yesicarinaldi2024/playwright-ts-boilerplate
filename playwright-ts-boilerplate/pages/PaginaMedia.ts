import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Media
 */
export class PaginaMedia extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/media');
    await this.validarRutaContiene('/media');
  }
}
