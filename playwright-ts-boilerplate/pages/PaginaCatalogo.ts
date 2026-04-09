import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Catalogo
 */
export class PaginaCatalogo extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/catalog');
    await this.validarRutaContiene('/catalog');
  }
}
