import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Operaciones
 */
export class PaginaOperaciones extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/operations');
    await this.validarRutaContiene('/operations');
  }
}
