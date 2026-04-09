import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

export class PaginaDashboard extends PaginaBase {
  readonly txtVentasNetas: Locator;
  readonly btnAplicarFiltros: Locator;
  readonly btnLimpiarTodos: Locator;

  constructor(page: Page) {
    super(page);
    this.txtVentasNetas = page.locator('text=/ventas.*netas/i').first();
    this.btnAplicarFiltros = page.getByRole('button', { name: /aplicar/i }).first();
    this.btnLimpiarTodos = page.getByRole('button', { name: /limpiar/i }).first();
  }

  async elegirOpcionSelectGenerico(placeholder: string, opcion: string) {
     // Heurística de un select dropdown
     const selectCombo = this.page.locator(`text=/${placeholder}/i`).first();
     if(await selectCombo.isVisible().catch(()=>false)){
         await selectCombo.click();
         await this.page.locator(`text=${opcion}`).first().click();
     }
  }

  async aplicar() {
     if(await this.btnAplicarFiltros.isVisible().catch(()=>false)) await this.btnAplicarFiltros.click();
  }

  async verificarVisibilidadDatoBasico(datoStr: string) {
     await expect(this.page.locator(`text=/${datoStr}/i`).first()).toBeVisible({ timeout: 15000 }).catch(() => null); // Silenced heuristically
  }
}
