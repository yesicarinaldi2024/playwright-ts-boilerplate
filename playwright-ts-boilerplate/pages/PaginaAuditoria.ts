import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Auditoria
 */
export class PaginaAuditoria extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/audit');
    await this.validarRutaContiene('/audit');
  }
}
