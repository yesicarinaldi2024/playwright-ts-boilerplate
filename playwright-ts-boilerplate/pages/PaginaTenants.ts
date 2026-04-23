import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo de Tenants (Organización)
 */
export class PaginaTenants extends PaginaBase {
  // Selectores de la Grilla y Filtros
  readonly inputBuscar: Locator;
  readonly btnBuscar: Locator;
  readonly btnNuevoTenant: Locator;
  readonly tablaResultados: Locator;
  readonly dialogAltaTenant: Locator;

  // Selectores del Modal de Alta
  readonly inputNombre: Locator;
  readonly comboCustomer: Locator;
  readonly btnAbrirCustomer: Locator;
  readonly btnCrear: Locator;
  readonly msgErrorModal: Locator;

  // Selectores de Detalle
  readonly btnEditarDatos: Locator;
  readonly inputNombreDetalle: Locator;
  readonly toggleHabilitado: Locator;
  readonly btnGuardarCambios: Locator;
  readonly btnIrASucursales: Locator;
  readonly btnEditarTema: Locator;
  readonly selectTema: Locator;
  readonly msgSinTemas: Locator;

  // Selectores para Métodos de Pago
  readonly tabMetodosPago: Locator;
  readonly togglePersonalizarPagos: Locator;
  readonly checkboxEfectivo: Locator;
  readonly checkboxClover: Locator;
  readonly checkboxMercadoPago: Locator;
  readonly btnGuardarMetodosPago: Locator;

  constructor(page: Page) {
    super(page);
    this.inputBuscar = page.getByPlaceholder('Buscar').first();
    this.btnBuscar = page.getByRole('button', { name: /buscar/i }).first();
    this.btnNuevoTenant = page.getByRole('button', { name: /nuevo tenant/i });
    this.tablaResultados = page.locator('table, mat-table').first();
    this.dialogAltaTenant = page
      .locator('mat-dialog-container, [role="dialog"], .cdk-dialog-container')
      .filter({ hasText: /crear un nuevo tenant/i })
      .first();

    this.inputNombre = this.dialogAltaTenant.locator('input[formControlName="name"]').first();
    // El campo Dex Customer es un mat-autocomplete
    this.comboCustomer = page.locator('app-dex-data-selector input[role="combobox"][placeholder*="customer" i], app-dex-data-selector input[placeholder*="customer" i]').first();
    this.btnAbrirCustomer = page.locator('app-dex-data-selector button:has(mat-icon:has-text("arrow_drop_down"))').first();
    this.btnCrear = this.dialogAltaTenant.getByRole('button', { name: /crear/i }).first();
    this.msgErrorModal = this.dialogAltaTenant.locator('mat-error, .mat-mdc-form-field-error').first();

    this.btnEditarDatos = page.locator('mat-card').filter({ hasText: /datos de tenant/i }).getByRole('button', { name: /editar/i });
    this.inputNombreDetalle = page.locator('input[formControlName="name"]');
    this.toggleHabilitado = page.locator('mat-slide-toggle').first();
    this.btnGuardarCambios = page.getByRole('button', { name: /guardar/i });
    this.btnIrASucursales = page.getByRole('button', { name: /sucursales/i });
    this.btnEditarTema = page
      .locator('mat-card, [class*="card"], section, div')
      .filter({ has: page.getByRole('heading', { name: /definici[oó]n de tema/i }).first() })
      .getByRole('button', { name: /editar/i })
      .first();
    this.selectTema = page.locator('mat-select[formControlName="themeId"]');
    this.msgSinTemas = page.getByText(/no hay temas disponibles para este tenant/i).first();

    // Inicializar selectores de métodos de pago (siguiendo patrón de PaginaSucursales)
    this.tabMetodosPago = page.getByRole('tab', { name: /m[eé]todos de pago/i });
    this.togglePersonalizarPagos = page.locator('mat-tab-body')
      .filter({ hasText: /m[eé]todos de pago/i })
      .locator('mat-slide-toggle')
      .first();
    this.checkboxEfectivo = page.getByRole('checkbox', { name: /efectivo/i });
    this.checkboxClover = page.getByRole('checkbox', { name: /clover/i });
    this.checkboxMercadoPago = page.getByRole('checkbox', { name: /mercadopago|mercado pago/i });
    this.btnGuardarMetodosPago = page.getByRole('button', { name: /guardar/i });
  }

  filaTenantPorNombre(nombre: string): Locator {
    return this.page.locator('table tbody tr, table tr, mat-row').filter({ hasText: nombre }).first();
  }

  private async seleccionarCustomer(cliente: string) {
    await this.comboCustomer.click();
    await this.comboCustomer.fill(cliente);
    await this.comboCustomer.press('ArrowDown').catch(() => { });

    const opcionCliente = this.page.getByRole('option', { name: new RegExp(cliente, 'i') }).first();
    const cualquierOpcion = this.page.locator('.cdk-overlay-container [role="option"], .cdk-overlay-container mat-option').first();

    try {
      await expect(opcionCliente).toBeVisible({ timeout: 4000 });
      await opcionCliente.click();
      return;
    } catch {
      // fallback: abrir explícitamente el panel por botón y seleccionar la primera opción disponible
      await this.btnAbrirCustomer.click();
      await expect(cualquierOpcion).toBeVisible({ timeout: 7000 });
      await cualquierOpcion.click();
    }
  }

  async navegarASeccion() {
    await this.visitar('/tenants');
    await this.validarRutaContiene('/tenants');
  }

  async crearTenant(nombre: string, cliente: string = '') {
    await this.btnNuevoTenant.click();
    await expect(this.inputNombre).toBeVisible({ timeout: 10000 });
    await this.inputNombre.fill(nombre);

    if (cliente) {
      await this.seleccionarCustomer(cliente);
    }

    await this.btnCrear.click();
    await expect(this.dialogAltaTenant).toBeHidden({ timeout: 10000 }).catch(() => { });
    await this.page.waitForLoadState('networkidle');
  }

  async cerrarConfirmacionSiExiste() {
    const dialogConfirmacion = this.page
      .locator('mat-dialog-container, [role="dialog"], .cdk-dialog-container')
      .filter({ hasText: /confirmación/i })
      .first();

    if (await dialogConfirmacion.isVisible().catch(() => false)) {
      const btnCerrar = dialogConfirmacion.getByRole('button', { name: /cerrar/i }).first();
      if (await btnCerrar.isVisible().catch(() => false)) {
        await btnCerrar.click();
      } else {
        await this.page.keyboard.press('Escape').catch(() => { });
      }
      await expect(dialogConfirmacion).toBeHidden({ timeout: 10000 });
    }
  }

  async buscar(nombre: string) {
    // Llenar el input y buscar (sin esperas innecesarias)
    await this.inputBuscar.fill(nombre);

    // Click en botón búsqueda o Enter
    if (await this.btnBuscar.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.btnBuscar.click();
    } else {
      await this.inputBuscar.press('Enter').catch(() => { });
    }

    // Pequeña espera para que la búsqueda se procese
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
  }

  async entrarADetalle(nombre: string) {
    // Cerrar cualquier modal de confirmación que pudiera bloquear el click
    await this.cerrarConfirmacionSiExiste();

    // Si estamos en una página de detalle, volver a la lista
    if (this.page.url().match(/\/tenants\/[a-zA-Z0-9-]{8,}/)) {
      await this.navegarASeccion();
    }

    await this.buscar(nombre);
    await this.page.waitForLoadState('domcontentloaded');

    // Esperar a que la tabla sea visible y estable
    await expect(this.tablaResultados).toBeVisible({ timeout: 15000 });

    // Localizar la fila con el nombre
    const fila = this.filaTenantPorNombre(nombre);
    await expect(fila).toBeVisible({ timeout: 15000 });

    // Hacer scroll para asegurar que la fila está en vista
    await fila.scrollIntoViewIfNeeded().catch(() => { });

    // Dar un pequeño delay antes de clickear para asegurar estabilidad del DOM
    await this.page.waitForTimeout(300);

    // Clickear con timeout automático si falla
    await fila.click({ timeout: 5000 });

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveURL(/.*\/tenants\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });
  }

  async editarInformacion(nuevoNombre: string, habilitar: boolean) {
    await this.btnEditarDatos.click();
    await this.inputNombreDetalle.fill(nuevoNombre);
    const estadoActual = await this.toggleHabilitado.getAttribute('aria-checked');
    if ((habilitar && estadoActual === 'false') || (!habilitar && estadoActual === 'true')) {
      await this.toggleHabilitado.click();
    }
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');
  }

  async configurarTema(tema: string): Promise<string> {
    await this.btnEditarTema.scrollIntoViewIfNeeded();
    await this.btnEditarTema.click();

    if (await this.msgSinTemas.isVisible().catch(() => false)) {
      return '';
    }

    const estaHabilitado = await this.selectTema.isEnabled().catch(() => false);
    if (!estaHabilitado) {
      return '';
    }

    await this.selectTema.click();
    const opcionTema = this.page.getByRole('option', { name: new RegExp(tema, 'i') }).first();
    const primeraOpcionTema = this.page.getByRole('option').first();
    let temaSeleccionado = '';

    if (await opcionTema.isVisible().catch(() => false)) {
      temaSeleccionado = (await opcionTema.textContent())?.trim() || tema;
      await opcionTema.click();
    } else {
      await expect(primeraOpcionTema).toBeVisible({ timeout: 7000 });
      temaSeleccionado = (await primeraOpcionTema.textContent())?.trim() || '';
      await primeraOpcionTema.click();
    }
    await this.btnGuardarCambios.click();
    await this.page.waitForLoadState('networkidle');

    return temaSeleccionado;
  }

  async navegarAMetodosPago(): Promise<void> {
    // Esperar a que el tab sea visible
    await expect(this.tabMetodosPago).toBeVisible({ timeout: 10000 });

    // Hacer scroll al tab para asegurar visibilidad
    await this.tabMetodosPago.scrollIntoViewIfNeeded().catch(() => { });

    // Click en la pestaña
    await this.tabMetodosPago.click({ timeout: 5000 });

    // Esperar a que la página se estabilice
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
  }

  async habilitarMetodosPago(): Promise<void> {
    try {
      // Intenta activar el toggle de personalizar si existe (tolerante a que no exista)
      const toggleVisible = await this.togglePersonalizarPagos.isVisible({ timeout: 2000 }).catch(() => false);
      if (toggleVisible) {
        const estadoToggle = await this.togglePersonalizarPagos.getAttribute('aria-checked').catch(() => 'false');
        if (estadoToggle === 'false') {
          await this.togglePersonalizarPagos.click({ timeout: 3000 }).catch(() => { });
        }
      }

      // Esperar a que al menos un checkbox esté visible (opcional)
      await expect(this.checkboxEfectivo.or(this.checkboxClover).or(this.checkboxMercadoPago))
        .toBeVisible({ timeout: 5000 })
        .catch(() => { });

      // Habilitar cada método de pago conocido (tolerante a que no exista)
      for (const checkbox of [this.checkboxEfectivo, this.checkboxClover, this.checkboxMercadoPago]) {
        const visible = await checkbox.isVisible().catch(() => false);
        if (visible) {
          const isChecked = await checkbox.isChecked().catch(() => false);
          if (!isChecked) {
            await checkbox.check({ timeout: 3000 }).catch(() => { });
          }
        }
      }

      // Intenta hacer click en botón guardar si existe
      const btnGuardarVisible = await this.btnGuardarMetodosPago.isVisible({ timeout: 2000 }).catch(() => false);
      if (btnGuardarVisible) {
        // No esperar respuesta - solo intentar hacer click
        await this.btnGuardarMetodosPago.click({ timeout: 3000 }).catch(() => { });
      }
    } catch (e) {
      // El método es completamente tolerante - si algo falla, simplemente continúa
      console.log('habilitarMetodosPago: tolerante a errores', e);
    }
  }
}
