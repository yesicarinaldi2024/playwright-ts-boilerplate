import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo de Kioscos (Organización)
 */
export class PaginaKioscos extends PaginaBase {
  // Grilla
  readonly inputBuscar: Locator;
  readonly btnBuscar: Locator;
  readonly btnNuevoKiosco: Locator;

  // Modal de Alta
  readonly inputNombre: Locator;
  readonly toggleCanalVirtual: Locator;
  readonly comboSucursal: Locator;
  readonly comboGrupo: Locator;
  readonly btnCrear: Locator;

  // Detalle – Información
  readonly btnEditarInfo: Locator;
  readonly inputNombreDetalle: Locator;
  readonly comboSucursalDetalle: Locator;
  readonly comboGrupoDetalle: Locator;
  readonly btnGuardarCambios: Locator;

  // Detalle – Tabs
  readonly tabInformacion: Locator;
  readonly tabMenus: Locator;
  readonly tabMediosPago: Locator;
  readonly tablaResultados: Locator;

  constructor(page: Page) {
    super(page);

    // Grilla - Selectores más específicos y estables
    this.inputBuscar = page.locator('mat-form-field').filter({ has: page.locator('input[placeholder*="uscar" i], input[placeholder*="earch" i]') }).locator('input').first();
    this.btnBuscar = page.getByRole('button', { name: /buscar/i }).first();
    this.btnNuevoKiosco = page.getByRole('button', { name: /nuevo kiosco|new kiosk/i });
    // Tabla de resultados - con múltiples selectores para robustez
    this.tablaResultados = page.locator('mat-table, table, [role="grid"]').first();

    // Modal de Alta - Selectores más específicos para evitar colisiones
    this.inputNombre = page.locator('mat-dialog-container input[formcontrolname="name"], mat-dialog-container input[name*="name" i]').first();
    // Toggle de Canal Virtual - Más específico dentro del contexto del modal
    this.toggleCanalVirtual = page.locator('mat-dialog-container mat-slide-toggle[formcontrolname="virtualChannel"], mat-dialog-container mat-slide-toggle[formcontrolname="virtualchannel"]').first();
    this.comboSucursal = page.locator('mat-dialog-container mat-select[formcontrolname="storeId"], mat-dialog-container mat-select[formcontrolname="store_id"]').first();
    this.comboGrupo = page.locator('mat-dialog-container mat-select[formcontrolname="kioskGroupId"], mat-dialog-container mat-select[formcontrolname="kiosk_group_id"]').first();
    this.btnCrear = page.locator('mat-dialog-container button').filter({ hasText: /^crear$/i }).first();

    // Detalle - Usar selectores más restrictivos
    this.btnEditarInfo = page.locator('.mat-tab-body-active button').filter({ hasText: /editar información|editar|edit/i }).first();
    this.inputNombreDetalle = page.locator('.mat-tab-body-active input[formcontrolname="name"], .mat-tab-body-active input[name*="name" i]').first();
    this.comboSucursalDetalle = page.locator('.mat-tab-body-active mat-select[formcontrolname="storeId"], .mat-tab-body-active mat-select[formcontrolname="store_id"]').first();
    this.comboGrupoDetalle = page.locator('.mat-tab-body-active mat-select[formcontrolname="kioskGroupId"], .mat-tab-body-active mat-select[formcontrolname="kiosk_group_id"]').first();
    this.btnGuardarCambios = page.locator('button').filter({ hasText: /guardar cambios|save changes|guardar/i }).first();

    // Tabs - Más específicos con mejor manejo de variantes
    this.tabInformacion = page.getByRole('tab').filter({ name: /información|informacion|information/i }).first();
    this.tabMenus = page.getByRole('tab').filter({ name: /menús|menus|menu/i }).first();
    this.tabMediosPago = page.getByRole('tab').filter({ name: /medios de pago|payment methods/i }).first();
  }

  async navegarASeccion() {
    await this.visitar('/kiosks');
    await expect(this.btnNuevoKiosco).toBeVisible({ timeout: 15000 });
  }

  async crearKiosco(nombre: string, canalVirtual: boolean, sucursal?: string, grupo?: string) {
    await expect(this.btnNuevoKiosco).toBeVisible({ timeout: 15000 });
    await this.btnNuevoKiosco.click();

    // Esperar a que el modal esté visible
    const modal = this.page.locator('mat-dialog-container');
    await expect(modal).toBeVisible({ timeout: 10000 });

    await expect(this.inputNombre).toBeVisible({ timeout: 10000 });
    await this.inputNombre.fill(nombre);

    // Toggle Canal Virtual
    await expect(this.toggleCanalVirtual).toBeVisible({ timeout: 10000 });
    const isChecked = (await this.toggleCanalVirtual.getAttribute('class'))?.includes('mat-checked') || 
                      (await this.toggleCanalVirtual.getAttribute('aria-checked')) === 'true';
    
    if (canalVirtual !== isChecked) {
      await this.toggleCanalVirtual.click();
    }

    // Seleccionar sucursal si es requerido o se especifica
    if (sucursal) {
      await this.seleccionarEnCombo(this.comboSucursal, sucursal);
    } else if (!canalVirtual) {
      await this.seleccionarPrimeraOpcionEnCombo(this.comboSucursal);
    }

    // Seleccionar grupo si se especifica
    if (grupo) {
      await this.seleccionarEnCombo(this.comboGrupo, grupo);
    }

    // Crear el kiosco
    await expect(this.btnCrear).toBeEnabled({ timeout: 10000 });
    await this.btnCrear.click();
    
    // Esperar a que el modal se cierre
    await expect(modal).not.toBeVisible({ timeout: 15000 });
  }

  async buscar(nombre: string) {
    await expect(this.inputBuscar).toBeVisible({ timeout: 15000 });
    await this.inputBuscar.fill(nombre);
    await this.inputBuscar.press('Enter');
    
    // Esperar a que la tabla se actualice (podemos esperar a que aparezca el texto o que la red se calme)
    await this.page.waitForLoadState('networkidle');
  }

  async irADetalle(nombre: string) {
    await this.buscar(nombre);

    // Esperar a que la tabla esté visible con contenido
    await expect(this.tablaResultados).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(800);

    // Buscar la fila que coincida con el nombre
    const fila = this.tablaResultados.locator('tr, mat-row').filter({ hasText: nombre }).first();

    // Esperar a que la fila sea visible y esté listo para hacer click
    await expect(fila).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(600); // Pequeña pausa antes de hacer click

    // Hacer click en la fila
    await fila.click();

    // Esperar a que se cargue la página de detalle
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/.*\/kiosks\/.*/, { timeout: 15000 });
    await this.page.waitForTimeout(800); // Pausa para asegurar que toda la página está cargada
  }

  async editarNombreYSucursal(nuevoNombre: string, nuevaSucursal: string) {
    await expect(this.tabInformacion).toBeVisible({ timeout: 15000 });
    await this.tabInformacion.click();
    await this.page.waitForTimeout(600);

    await expect(this.btnEditarInfo).toBeVisible({ timeout: 15000 });
    await this.btnEditarInfo.click();
    await this.page.waitForTimeout(700);

    await expect(this.inputNombreDetalle).toBeVisible({ timeout: 15000 });
    await expect(this.inputNombreDetalle).toBeEnabled({ timeout: 15000 });
    await this.inputNombreDetalle.fill(nuevoNombre);
    await this.page.waitForTimeout(500);

    if (nuevaSucursal) {
      await this.seleccionarEnCombo(this.comboSucursalDetalle, nuevaSucursal);
    }

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 15000 });
    await expect(this.btnGuardarCambios).toBeEnabled({ timeout: 15000 });
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);
  }

  async moverAGrupo(nuevoGrupo: string) {
    await expect(this.tabInformacion).toBeVisible({ timeout: 15000 });
    await this.tabInformacion.click();
    await this.page.waitForTimeout(600);

    await expect(this.btnEditarInfo).toBeVisible({ timeout: 15000 });
    await this.btnEditarInfo.click();
    await this.page.waitForTimeout(700);

    await this.seleccionarEnCombo(this.comboGrupoDetalle, nuevoGrupo);

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 15000 });
    await expect(this.btnGuardarCambios).toBeEnabled({ timeout: 15000 });
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);
  }

  async habilitarMediosDePago() {
    await expect(this.tabMediosPago).toBeVisible({ timeout: 15000 });
    await this.tabMediosPago.click();
    await this.page.waitForTimeout(700);

    const checkboxes = this.page.getByRole('checkbox');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      await expect(checkbox).toBeVisible({ timeout: 10000 });
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await checkbox.check();
        await this.page.waitForTimeout(300);
      }
    }

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 15000 });
    await expect(this.btnGuardarCambios).toBeEnabled({ timeout: 15000 });
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);
  }

  private async seleccionarEnCombo(combo: Locator, valor: string) {
    await expect(combo).toBeVisible({ timeout: 10000 });
    await combo.click();

    // Esperar a que el overlay de Material esté visible
    const overlay = this.page.locator('.cdk-overlay-container');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Buscar la opción
    const opcion = overlay.locator('mat-option').filter({ hasText: new RegExp(`^\\s*${valor}\\s*$`, 'i') }).first();
    
    // Si no aparece la opción exacta, intentar una búsqueda parcial si hay input de filtrado
    const inputFiltro = overlay.locator('input').first();
    if (await inputFiltro.isVisible().catch(() => false)) {
      await inputFiltro.fill(valor);
    }

    await expect(opcion).toBeVisible({ timeout: 5000 });
    await opcion.click();
    
    // Esperar a que el overlay desaparezca
    await expect(overlay).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  }

  private async seleccionarPrimeraOpcionEnCombo(combo: Locator) {
    // Esperar a que el combo esté visible
    await expect(combo).toBeVisible({ timeout: 15000 });
    await expect(combo).toBeEnabled({ timeout: 15000 });
    await combo.click();
    await this.page.waitForTimeout(600); // Esperar a que se abra el dropdown

    // Seleccionar la primera opción disponible
    const opcionFallback = this.page.locator('.cdk-overlay-container [role="option"], .cdk-overlay-container mat-option').first();
    await expect(opcionFallback).toBeVisible({ timeout: 10000 });
    await opcionFallback.click();
    await this.page.waitForTimeout(600);
  }
}
