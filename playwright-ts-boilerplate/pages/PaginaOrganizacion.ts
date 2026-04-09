import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Organizacion
 */
export class PaginaOrganizacion extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/organization');
    await this.validarRutaContiene('/organization');
  }
}
