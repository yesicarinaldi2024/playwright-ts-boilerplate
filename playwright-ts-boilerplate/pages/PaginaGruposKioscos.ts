import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo de Grupos de Kioscos (Organización)
 */
export class PaginaGruposKioscos extends PaginaBase {
  // Grilla
  readonly inputBuscar: Locator;
  readonly btnBuscar: Locator;
  readonly btnNuevoGrupo: Locator;

  // Modal de Alta
  readonly inputNombre: Locator;
  readonly comboSucursal: Locator;
  readonly btnCrear: Locator;

  // Detalle – Información
  readonly btnEditarInfo: Locator;
  readonly inputNombreDetalle: Locator;
  readonly comboSucursalDetalle: Locator;
  readonly toggleActivo: Locator;
  readonly btnGuardarCambios: Locator;

  // Detalle – Tabs / Secciones
  readonly tabInformacion: Locator;
  readonly tabKioscosVinculados: Locator;
  readonly tabQR: Locator;
  readonly tablaResultados: Locator;

  // Sección QR
  readonly contenedorQR: Locator;

  constructor(page: Page) {
    super(page);

    // Grilla
    this.inputBuscar = page.getByPlaceholder(/buscar/i).first();
    this.btnBuscar = page.getByRole('button', { name: /buscar/i }).first();
    this.btnNuevoGrupo = page.getByRole('button', { name: /nuevo grupo/i });
    this.tablaResultados = page.locator('table, mat-table').first();

    // Modal de Alta
    this.inputNombre = page.locator('input[formcontrolname="name" i], input[formControlName="name"]');
    this.comboSucursal = page.locator('app-dex-data-selector [formcontrolname="storeId" i], mat-select[formcontrolname="storeId" i], mat-select[formControlName="storeId"]');
    this.btnCrear = page.getByRole('button', { name: 'Crear' });

    // Detalle
    this.btnEditarInfo = page.getByRole('button', { name: /editar/i }).first();
    this.inputNombreDetalle = page.locator('input[formcontrolname="name" i], input[formControlName="name"]');
    this.comboSucursalDetalle = page.locator('app-dex-data-selector [formcontrolname="storeId" i], mat-select[formcontrolname="storeId" i], mat-select[formControlName="storeId"]');
    this.toggleActivo = page.locator('mat-slide-toggle').first();
    this.btnGuardarCambios = page.getByRole('button', { name: /guardar cambios/i });

    // Tabs
    this.tabInformacion = page.getByRole('tab', { name: /información/i });
    this.tabKioscosVinculados = page.getByRole('tab', { name: /kioscos/i });
    this.tabQR = page.getByRole('tab', { name: /qr/i });

    // QR
    this.contenedorQR = page.locator('qrcode, canvas, img[alt*="QR"], .qr-container').first();
  }

  async navegarASeccion() {
    await this.visitar('/kiosk-groups');
    await this.page.waitForLoadState('networkidle');
    await this.validarRutaContiene('/kiosk-groups');
    // Esperar a que la tabla esté visible
    await expect(this.tablaResultados).toBeVisible({ timeout: 15000 }).catch(() => {});
  }

  async crearGrupo(nombre: string, sucursal?: string) {
    await expect(this.btnNuevoGrupo).toBeVisible({ timeout: 15000 });
    await expect(this.btnNuevoGrupo).toBeEnabled({ timeout: 15000 });
    await this.btnNuevoGrupo.click();
    await this.page.waitForTimeout(500);

    await expect(this.inputNombre).toBeVisible({ timeout: 15000 });
    await this.inputNombre.fill(nombre);
    await this.page.waitForTimeout(300);

    if (sucursal) {
      await this.seleccionarEnCombo(this.comboSucursal.first(), sucursal);
    }

    await expect(this.btnCrear).toBeVisible({ timeout: 15000 });
    await this.btnCrear.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async buscar(nombre: string) {
    await expect(this.inputBuscar).toBeVisible({ timeout: 15000 });
    await expect(this.inputBuscar).toBeEnabled({ timeout: 15000 });

    await this.inputBuscar.fill('');
    await this.page.waitForTimeout(300);
    await this.inputBuscar.fill(nombre);
    await this.page.waitForTimeout(500);

    try {
      await this.inputBuscar.press('Enter');
    } catch (e) {
      if (await this.btnBuscar.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.btnBuscar.click();
      }
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async irADetalle(nombre: string) {
    await this.buscar(nombre);

    const fila = this.tablaResultados.locator('tr, mat-row').filter({ hasText: nombre }).first();
    await expect(fila).toBeVisible({ timeout: 15000 });
    await expect(fila).toBeEnabled({ timeout: 15000 });
    await this.page.waitForTimeout(500);

    await fila.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/.*\/kiosk-groups\/.*/, { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  async cambiarSucursal(nuevaSucursal: string) {
    await expect(this.tabInformacion).toBeVisible({ timeout: 15000 });
    await this.tabInformacion.click();
    await this.page.waitForTimeout(500);

    await expect(this.btnEditarInfo).toBeVisible({ timeout: 15000 });
    await this.btnEditarInfo.click();
    await this.page.waitForTimeout(500);

    await this.seleccionarEnCombo(this.comboSucursalDetalle.first(), nuevaSucursal);

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 15000 });
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
  }

  async activarGrupo() {
    await expect(this.tabInformacion).toBeVisible({ timeout: 15000 });
    await this.tabInformacion.click();
    await this.page.waitForTimeout(500);

    await expect(this.btnEditarInfo).toBeVisible({ timeout: 15000 });
    await this.btnEditarInfo.click();
    await this.page.waitForTimeout(500);

    await expect(this.toggleActivo).toBeVisible({ timeout: 15000 });
    const checked = await this.toggleActivo.getAttribute('aria-checked');
    if (checked === 'false') {
      await this.toggleActivo.click();
      await this.page.waitForTimeout(500);
    }

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 15000 });
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
  }

  private async seleccionarEnCombo(combo: Locator, valor: string) {
    await expect(combo).toBeVisible({ timeout: 15000 });
    await expect(combo).toBeEnabled({ timeout: 15000 });
    await combo.click();
    await this.page.waitForTimeout(500);

    const inputCombo = combo.locator('input').first();
    if (await inputCombo.isVisible({ timeout: 5000 }).catch(() => false)) {
      await inputCombo.fill('');
      await this.page.waitForTimeout(200);
      await inputCombo.fill(valor);
      await this.page.waitForTimeout(500);
    }

    const opcionExacta = this.page.getByRole('option', { name: new RegExp(`^${valor}$`, 'i') }).first();
    const opcionAproximada = this.page.getByRole('option', { name: new RegExp(valor, 'i') }).first();
    const opcionFallback = this.page.locator('.cdk-overlay-container [role="option"], .cdk-overlay-container mat-option').first();

    try {
      if (await opcionExacta.isVisible({ timeout: 5000 }).catch(() => false)) {
        await opcionExacta.click();
        return;
      }
    } catch (e) {
      // Continuar
    }

    try {
      if (await opcionAproximada.isVisible({ timeout: 5000 }).catch(() => false)) {
        await opcionAproximada.click();
        return;
      }
    } catch (e) {
      // Continuar
    }

    await expect(opcionFallback).toBeVisible({ timeout: 10000 });
    await opcionFallback.click();
    await this.page.waitForTimeout(500);
  }
}
