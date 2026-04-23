import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

export class PaginaDashboard extends PaginaBase {
  readonly txtVentasNetas: Locator;
  readonly btnAplicarFiltros: Locator;
  readonly btnLimpiarTodos: Locator;

  constructor(page: Page) {
    super(page);
    this.txtVentasNetas = page.getByRole('heading', { name: /ventas netas/i }).or(page.getByText(/ventas netas/i));
    this.btnAplicarFiltros = page.getByRole('button', { name: /aplicar/i });
    this.btnLimpiarTodos = page.getByRole('button', { name: /limpiar/i });
  }

  async elegirOpcionSelectGenerico(placeholder: string, opcion: string) {
     const selectCombo = this.page.getByRole('combobox', { name: new RegExp(placeholder, 'i') }).or(this.page.getByLabel(new RegExp(placeholder, 'i')));
     await selectCombo.first().click();
     await this.page.getByRole('option', { name: opcion, exact: false }).or(this.page.locator(`text=${opcion}`)).first().click();
  }

  async aplicar() {
     await this.btnAplicarFiltros.first().click();
  }

  async verificarVisibilidadDatoBasico(datoStr: string) {
     // IMPORTANTE: Eliminados los .catch(() => null) que provocaban Falsos Positivos de validación visual.
     await expect(this.page.getByText(new RegExp(datoStr, 'i')).first()).toBeVisible({ timeout: 15000 });
  }
}
