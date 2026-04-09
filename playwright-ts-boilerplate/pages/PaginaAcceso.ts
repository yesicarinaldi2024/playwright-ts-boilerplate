import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

export class PaginaAcceso extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }
}
