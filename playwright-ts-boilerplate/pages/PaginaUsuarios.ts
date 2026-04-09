import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo Usuarios
 */
export class PaginaUsuarios extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('/users');
    await this.validarRutaContiene('/users');
  }
}
