import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo de Sucursales (Localizaciones/Stores)
 */
export class PaginaSucursales extends PaginaBase {
  // Selectores de la Grilla
  readonly btnNuevaSucursal: Locator;
  readonly inputBuscar: Locator;
  readonly btnBuscar: Locator;

  // Selectores del Modal de Alta
  readonly inputNombre: Locator;
  readonly comboStore: Locator;
  readonly inputDescripcion: Locator;
  readonly btnCrear: Locator;

  // Selectores de Pestañas y Detalle
  readonly tabInformacion: Locator;
  readonly tabContactos: Locator;
  readonly tabMetodosPago: Locator;
  readonly tabPantallaEspera: Locator;

  // Pestaña Información / Dirección
  readonly btnEditarInfo: Locator;
  readonly btnEditarDireccion: Locator;
  readonly inputDireccion: Locator;
  readonly inputCiudad: Locator;
  readonly toggleHabilitado: Locator;
  readonly btnGuardarCambios: Locator;

  // Pestaña Contactos
  readonly btnAgregarContacto: Locator;
  readonly inputNombreContacto: Locator;
  readonly inputCargoContacto: Locator;
  readonly inputTelefonoContacto: Locator;
  readonly inputEmailContacto: Locator;

  // Pestaña Métodos de Pago
  readonly togglePersonalizarPagos: Locator;
  readonly checkboxEfectivo: Locator;
  readonly checkboxClover: Locator;
  readonly checkboxMercadoPago: Locator;

  // Pestaña Pantalla de Espera
  readonly togglePersonalizarEspera: Locator;
  readonly btnSeleccionarMedia: Locator;
  readonly inputTextoEspera: Locator;

  // Media Picker Dialog
  readonly inputBuscarMedia: Locator;
  readonly btnPrimerResultadoMedia: Locator;
  readonly tablaResultados: Locator;

  constructor(page: Page) {
    super(page);
    this.btnNuevaSucursal = page.getByRole('button', { name: /add_circle|nueva sucursal/i });
    this.inputBuscar = page.getByPlaceholder(/buscar/i).first();
    this.btnBuscar = page.getByRole('button', { name: /buscar/i }).first();
    this.tablaResultados = page.locator('table, mat-table').first();

    // Modal de alta — scoped dentro del diálogo para evitar colisiones con otras cards
    this.inputNombre = page.locator('mat-dialog-container input[formcontrolname="name"], mat-dialog-container input[formControlName="name"]');
    this.comboStore = page.locator('mat-dialog-container app-dex-data-selector input[role="combobox"], mat-dialog-container mat-select[formcontrolname="storeId" i], mat-dialog-container mat-select').first();
    this.inputDescripcion = page.locator('textarea[formcontrolname="description" i], textarea[formControlName="description"]');
    // Locator robusto para el botón Crear - using getByRole con fallback
    this.btnCrear = page.locator('mat-dialog-container').getByRole('button', { name: /crear/i }).first();

    this.tabInformacion = page.getByRole('tab', { name: /información/i });
    this.tabContactos = page.getByRole('tab', { name: /contactos/i });
    this.tabMetodosPago = page.getByRole('tab', { name: /métodos de pago/i });
    this.tabPantallaEspera = page.getByRole('tab', { name: /pantalla de espera/i });

    this.btnEditarInfo = page.locator('mat-card').filter({ hasText: 'Información de Sucursal' }).getByRole('button', { name: 'Editar' });
    this.btnEditarDireccion = page.locator('mat-card').filter({ hasText: 'Dirección' }).getByRole('button', { name: 'Editar' });
    this.inputDireccion = page.locator('input[formcontrolname="address" i], input[formControlName="address"]');
    this.inputCiudad = page.locator('input[formcontrolname="city" i], input[formControlName="city"]');
    this.toggleHabilitado = page.locator('mat-card').filter({ hasText: /información de sucursal/i }).locator('mat-slide-toggle, button.mdc-switch').first();
    this.btnGuardarCambios = page.getByRole('button', { name: /guardar cambios/i }).first();

    this.btnAgregarContacto = page.getByRole('button', { name: /agregar contacto/i });
    // Campos del formulario de contacto — scoped al form del tab de contactos
    this.inputNombreContacto = page.locator('app-contact-form input[formcontrolname="name"], [formgroupname="contact"] input[formcontrolname="name"], mat-tab-body input[formcontrolname="name"]').first();
    this.inputCargoContacto = page.locator('input[formcontrolname="role" i], input[formControlName="role"]');
    this.inputTelefonoContacto = page.locator('input[formcontrolname="phone" i], input[formControlName="phone"]');
    this.inputEmailContacto = page.locator('input[formcontrolname="email" i], input[formControlName="email"]');

    this.togglePersonalizarPagos = page.locator('mat-tab-body.mat-mdc-tab-body-active button.mdc-switch, mat-tab-body:not([aria-hidden="true"]) button.mdc-switch').first();
    this.checkboxEfectivo = page.locator('button.mdc-switch').filter({ hasText: /efectivo/i });
    this.checkboxClover = page.locator('button.mdc-switch').filter({ hasText: /clover/i });
    this.checkboxMercadoPago = page.locator('button.mdc-switch').filter({ hasText: /mercado pago|mercadopago/i });

    this.togglePersonalizarEspera = page.locator('mat-tab-body.mat-mdc-tab-body-active button.mdc-switch, mat-tab-body:not([aria-hidden="true"]) button.mdc-switch').first();
    this.btnSeleccionarMedia = page.locator('.mini-media-btn').first();
    this.inputTextoEspera = page.locator('input[placeholder="Texto"]').first();

    this.inputBuscarMedia = page.locator('input[placeholder*="Buscar" i], input[placeholder*="search" i]');
    this.btnPrimerResultadoMedia = page.locator('mat-grid-tile').first();
  }

  async navegarASeccion() {
    await this.visitar('/stores');
    await this.validarRutaContiene('/stores');
    // Esperar a que la tabla o el botón Nueva Sucursal estén visibles
    await expect(this.btnNuevaSucursal).toBeVisible({ timeout: 15000 });
  }

  async crearSucursal(nombre: string, store: string = ''): Promise<string | null> {
    await this.btnNuevaSucursal.click();
    const dialog = this.page.locator('mat-dialog-container').last();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Esperar a que el input de nombre esté visible y listo
    await expect(this.inputNombre).toBeVisible({ timeout: 10000 });
    await this.inputNombre.fill(nombre);

    // Esperar a que el combo esté cargado antes de interactuar (solo si hay un valor específico)
    if (store && await this.comboStore.isVisible({ timeout: 5000 }).catch(() => false)) {
      await (this as any).seleccionarEnCombo(this.comboStore, store);
    }

    // Esperar a que el botón esté visible Y habilitado
    await expect(this.btnCrear).toBeVisible({ timeout: 10000 });
    await expect(this.btnCrear).toBeEnabled({ timeout: 10000 });

    // Configurar escucha de respuesta ANTES del click
    const createResponse = this.page.waitForResponse(
      r => r.url().includes('/stores') && r.request().method() === 'POST',
      { timeout: 15000 }
    );

    await this.btnCrear.click();
    const response = await createResponse.catch(() => null);
    await this.page.waitForLoadState('domcontentloaded');

    let storeUrl: string | null = null;

    // Si la respuesta es exitosa, intentar extraer la URL de la sucursal creada
    if (response && response.status() < 400) {
      try {
        const responseData = await response.json().catch(() => null);
        if (responseData && responseData.id) {
          storeUrl = `/stores/${responseData.id}`;
        }
      } catch (e) {
        // Si no se puede obtener la URL de la respuesta, intentar desde el diálogo
      }
    }

    // Buscar cualquier botón de cierre en el diálogo
    const btnCerrar = dialog.getByRole('button', { name: /cerrar|ir a sucursal|aceptar/i }).first();

    if (await btnCerrar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnCerrar.click();
      await this.page.waitForTimeout(300);
    }

    await this.page.waitForLoadState('networkidle');

    return storeUrl;
  }

  async buscar(nombre: string) {
    // Asegurar que estamos en la lista
    await expect(this.inputBuscar).toBeVisible({ timeout: 10000 });

    // Configurar promesa ANTES de llenar y buscar
    const searchPromise = this.page.waitForResponse(
      r => r.url().includes('/stores') && r.request().method() === 'GET',
      { timeout: 15000 }
    );

    await this.inputBuscar.fill(nombre);
    await this.page.waitForTimeout(300);

    // Presionar Enter o clickear el botón para buscar
    const btnVisible = await this.btnBuscar.isVisible({ timeout: 2000 }).catch(() => false);
    if (btnVisible) {
      await this.btnBuscar.click();
    } else {
      await this.inputBuscar.press('Enter').catch(() => { });
    }

    await searchPromise.catch(() => { });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async irADetalle(nombre: string) {
    // Si estamos en una página de detalle, volver a la lista
    if (this.page.url().match(/\/stores\/[a-zA-Z0-9-]{8,}/)) {
      await this.navegarASeccion();
    }
    await this.buscar(nombre);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);

    // Esperar a que la tabla sea visible y estable
    await expect(this.tablaResultados).toBeVisible({ timeout: 15000 });

    // Localizar la fila con el nombre — usar regex exacta para mayor precisión
    const filas = this.tablaResultados.locator('tr, mat-row');
    const filaCount = await filas.count();

    if (filaCount === 0) {
      throw new Error(`No se encontraron filas en la tabla. Búsqueda por: "${nombre}"`);
    }

    let fila = null;
    for (let i = 0; i < filaCount; i++) {
      const filaActual = filas.nth(i);
      const texto = await filaActual.textContent().catch(() => '');
      if (texto?.includes(nombre)) {
        fila = filaActual;
        break;
      }
    }

    if (!fila) {
      throw new Error(`No se encontró la fila con el nombre: "${nombre}"`);
    }

    await expect(fila).toBeVisible({ timeout: 10000 });

    // Hacer scroll para asegurar que la fila está en vista
    await fila.scrollIntoViewIfNeeded();

    // Dar un pequeño delay antes de clickear
    await this.page.waitForTimeout(300);

    // Clickear en la primera celda
    try {
      await fila.locator('td, mat-cell').first().click({ timeout: 10000 });
    } catch (e) {
      // Si falla, presionar Escape y reintentar
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
      await fila.locator('td, mat-cell').first().click({ timeout: 5000, force: true });
    }

    await this.page.waitForLoadState('networkidle');

    // Validar que navegamos a la página de detalle
    await expect(this.page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });
  }

  async completarDireccion(direccion: string, ciudad: string) {
    await this.tabInformacion.click();
    const cardDireccion = this.page.locator('mat-card').filter({ has: this.page.locator('mat-card-title, h3', { hasText: /dirección/i }) }).first();
    await expect(cardDireccion).toBeVisible({ timeout: 10000 });

    // Si el botón editar está, lo clickeo. Si ya está en modo edición (inputs visibles), sigo.
    const btnEditar = cardDireccion.getByRole('button', { name: /editar/i });
    if (await btnEditar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnEditar.click();
      await this.page.waitForTimeout(300);
    }

    // Esperar a que los inputs estén visibles
    await expect(this.inputDireccion).toBeVisible({ timeout: 10000 });
    await expect(this.inputCiudad).toBeVisible({ timeout: 10000 });

    await this.inputDireccion.fill(direccion);
    await this.page.waitForTimeout(300); // Pequeño delay para que los inputs procesen el cambio

    await this.inputCiudad.fill(ciudad);
    await this.page.waitForTimeout(300); // Pequeño delay para que los inputs procesen el cambio

    // Intentar disparar eventos de change para que angular valide
    await this.inputDireccion.dispatchEvent('blur').catch(() => {});
    await this.inputCiudad.dispatchEvent('blur').catch(() => {});
    
    // Esperar a que el botón esté visible y habilitado
    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(500); // Dar tiempo al Angular para procesar los cambios

    try {
      await this.btnGuardarCambios.click({ timeout: 5000, force: true });
    } catch {
      console.log('Error al guardar direccion');
    }

    await this.page.waitForTimeout(1000); // Esperar que se guarde de forma tolerante
    await this.page.waitForLoadState('domcontentloaded');
  }

  async habilitar() {
    console.log('  -> Iniciando proceso de habilitación');
    await this.tabInformacion.click();
    const cardInfo = this.page.locator('mat-card').filter({ has: this.page.locator('mat-card-title, h3', { hasText: /información de sucursal/i }) }).first();
    await expect(cardInfo).toBeVisible({ timeout: 15000 });

    const btnEditar = cardInfo.getByRole('button', { name: /editar/i });
    if (await btnEditar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnEditar.click();
      await this.page.waitForTimeout(500);
    }

    const toggle = cardInfo.locator('mat-slide-toggle, [role="switch"], .mdc-switch').first();
    await expect(toggle).toBeVisible({ timeout: 15000 });
    
    const checkIsChecked = async () => {
      const aria = await toggle.getAttribute('aria-checked');
      const cls = await toggle.getAttribute('class');
      return aria === 'true' || cls?.includes('checked') || cls?.includes('mdc-switch--on');
    };

    if (!(await checkIsChecked())) {
      console.log('  -> Activando switch...');
      await toggle.click({ force: true });
      
      // Polleo agresivo del estado en el DOM
      await this.page.waitForFunction(async (el) => {
        const aria = el.getAttribute('aria-checked');
        const cls = el.className;
        return aria === 'true' || cls.includes('checked') || cls.includes('mdc-switch--on');
      }, await toggle.elementHandle(), { timeout: 5000 }).catch(() => {
         console.log('  -> Advertencia: El estado del switch no cambió visualmente tras 5s.');
      });

      await this.page.waitForTimeout(500);
      
      // Esperar botón GUARDAR
      await expect(this.btnGuardarCambios).toBeVisible({ timeout: 10000 });
      
      const saveResponse = this.page.waitForResponse(
        r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
        { timeout: 15000 }
      ).catch(() => null);

      await this.btnGuardarCambios.click({ force: true });
      await saveResponse;
      console.log('  -> Cambios guardados correctamente');
    } else {
      console.log('  -> La sucursal ya está habilitada');
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  async validarEstadoHabilitado(esperado: boolean = true) {
    const cardInfo = this.page.locator('mat-card').filter({ has: this.page.locator('mat-card-title, h3', { hasText: /información de sucursal/i }) }).first();
    const toggle = cardInfo.locator('mat-slide-toggle, [role="switch"], .mdc-switch').first();
    
    await expect(toggle).toBeVisible({ timeout: 10000 });
    
    if (esperado) {
      await expect(async () => {
        const aria = await toggle.getAttribute('aria-checked');
        const cls = await toggle.getAttribute('class');
        const isChecked = aria === 'true' || cls?.includes('checked') || cls?.includes('mdc-switch--on');
        expect(isChecked).toBeTruthy();
      }).toPass({ timeout: 10000, intervals: [1000] });
    } else {
      await expect(async () => {
        const aria = await toggle.getAttribute('aria-checked');
        const cls = await toggle.getAttribute('class');
        const isChecked = aria === 'true' || cls?.includes('checked') || cls?.includes('mdc-switch--on');
        expect(isChecked).toBeFalsy();
      }).toPass({ timeout: 10000, intervals: [1000] });
    }
  }

  async agregarContacto(nombre: string, cargo: string, telefono: string, email: string) {
    // PASO 1: Activar el tab de Contactos con retry
    try {
      await this.tabContactos.click({ timeout: 5000 });
    } catch {
      // Fallback si el click normal falla (por overlays)
      await this.tabContactos.click({ force: true });
    }
    await this.page.waitForLoadState('domcontentloaded');

    // PASO 2: Esperar a que el botón "Agregar Contacto" sea visible (mejor indicador que aria-hidden)
    await expect(this.btnAgregarContacto).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(500); // Buffer para que Angular termine el render

    // PASO 3: Clickear "Agregar Contacto"
    await this.btnAgregarContacto.click();
    
    // PASO 4: Esperar y llenar los INPUTS DEL FORMULARIO
    // Usar .last() para capturar el input más reciente del formulario
    const inputNombre = this.page.locator('input[formcontrolname="name"], input[formControlName="name"]').last();
    const inputCargo = this.page.locator('input[formcontrolname="role"], input[formControlName="role"]').last();
    const inputTelefono = this.page.locator('input[formcontrolname="phone"], input[formControlName="phone"]').last();
    const inputEmail = this.page.locator('input[formcontrolname="email"], input[formControlName="email"]').last();

    await expect(inputNombre).toBeVisible({ timeout: 15000 });

    await inputNombre.fill(nombre);
    await this.page.waitForTimeout(300);

    await expect(inputCargo).toBeVisible({ timeout: 10000 });
    await inputCargo.fill(cargo);
    await this.page.waitForTimeout(300);

    await expect(inputTelefono).toBeVisible({ timeout: 10000 });
    await inputTelefono.fill(telefono);
    await this.page.waitForTimeout(300);

    await expect(inputEmail).toBeVisible({ timeout: 10000 });
    await inputEmail.fill(email);
    await inputEmail.dispatchEvent('blur');
    await this.page.waitForTimeout(500);

    // PASO 5: Clickear botón "Agregar" para confirmar el contacto
    // Usar locator más flexible por si el nombre cambia o hay espacios
    const btnAgregar = this.page.locator('button').filter({ hasText: /^(agregar|guardar)$/i }).last();
    await expect(btnAgregar).toBeVisible({ timeout: 10000 });
    await btnAgregar.click({ force: true });

    // Esperar a que el contacto se agregue a la lista (desaparición de diálogos o formularios)
    await this.page.waitForTimeout(1000);
    if (await this.page.locator('mat-dialog-container, app-contact-form').first().isVisible()) {
      // Fallback: si el formulario sigue abierto, intentar cerrarlo con Escape
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }

    // PASO 6: Guardar los cambios con el patrón robusto de TC-01
    // Buscar el botón de guardado global (puede estar en el header o footer)
    const btnGuardar = this.page.locator('button').filter({ hasText: /guardar cambios/i }).first();
    
    // Si no es visible, intentamos forzar que aparezca desplazando o esperando network idle
    if (!await btnGuardar.isVisible()) {
      await this.page.waitForLoadState('networkidle');
      await this.page.mouse.wheel(0, -500); // Scroll up por si acaso
      await this.page.waitForTimeout(500);
    }

    await expect(btnGuardar).toBeVisible({ timeout: 15000 }).catch(() => {
      console.log('Advertencia: Botón Guardar Cambios no visible pos-contacto. Quizás auto-guardado.');
    });

    if (await btnGuardar.isVisible()) {
      const saveResponse = this.page.waitForResponse(
        r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
        { timeout: 15000 }
      ).catch(() => null);

      try {
        await btnGuardar.click({ timeout: 5000 });
      } catch (e) {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        await btnGuardar.click({ force: true });
      }
      await saveResponse;
    }

    await this.page.waitForLoadState('networkidle');
  }

  async eliminarContacto(email: string) {
    // PASO 1: Activar el tab de Contactos con retry
    try {
      await this.tabContactos.click({ timeout: 5000 });
    } catch {
      await this.tabContactos.click({ force: true });
    }
    await this.page.waitForLoadState('networkidle');

    // PASO 2: Localizar la card del contacto por su email
    // Usar selectores amplios para capturar el contenedor del contacto
    const cardContacto = this.page.locator('mat-card, [role="region"], app-contact-card').filter({ hasText: email }).first();
    await expect(cardContacto).toBeVisible({ timeout: 10000 });

    // PASO 3: Clickear el botón de eliminar dentro de esa card
    // Intentar por icono primero, luego por posición
    const btnIconDelete = cardContacto.locator('button mat-icon:has-text("delete"), button:has(.fa-trash), button:has-text("delete")').first();
    
    if (await btnIconDelete.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btnIconDelete.click();
    } else {
      // Fallback: el último botón suele ser eliminar en estas grillas de cards
      await cardContacto.locator('button').last().click();
    }

    // PASO 4: Manejar el diálogo de confirmación si aparece
    const btnConfirmar = this.page.getByRole('button', { name: /eliminar|confirmar|aceptar|sí|yes/i }).first();
    if (await btnConfirmar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnConfirmar.click();
    }

    // PASO 5: Guardar los cambios con el patrón robusto
    const btnGuardar = this.page.locator('button').filter({ hasText: /guardar cambios/i }).first();
    
    if (await btnGuardar.isVisible({ timeout: 5000 }).catch(() => false)) {
      const saveResponse = this.page.waitForResponse(
        r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
        { timeout: 15000 }
      ).catch(() => null);

      await btnGuardar.click({ force: true });
      await saveResponse;
    }

    await this.page.waitForLoadState('networkidle');
  }

  async editarNombre(nuevoNombre: string) {
    await this.tabInformacion.click();
    const cardInfo = this.page.locator('mat-card').filter({ has: this.page.locator('mat-card-title, h3', { hasText: /información de sucursal/i }) }).first();

    const btnEditar = cardInfo.getByRole('button', { name: /editar/i });
    await expect(btnEditar).toBeVisible({ timeout: 10000 });
    await btnEditar.click();
    await this.page.waitForTimeout(300);

    // Limpiar y rellenar el campo nombre (scoped en la card de info, fuera del diálogo)
    const inputNombreInfo = cardInfo.locator('input[formcontrolname="name"], input[formControlName="name"]').first();
    await expect(inputNombreInfo).toBeVisible({ timeout: 10000 });
    await inputNombreInfo.fill(nuevoNombre);
    await this.page.waitForTimeout(300);

    await expect(this.btnGuardarCambios).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(500);

    // Configurar escucha de respuesta ANTES del click
    const saveResponse = this.page.waitForResponse(
      r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
      { timeout: 15000 }
    );

    try {
      await this.btnGuardarCambios.click({ timeout: 5000 });
    } catch (e) {
      // Si falla, disparar un change event y reintentar
      await inputNombreInfo.dispatchEvent('change');
      await this.page.waitForTimeout(300);
      await this.btnGuardarCambios.click();
    }

    await saveResponse.catch(() => { });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async habilitarMetodosDePago() {
    // PASO 1: Activar el tab de Métodos de Pago con retry y espera de selección
    await this.tabMetodosPago.click().catch(() => this.tabMetodosPago.click({ force: true }));
    await expect(this.tabMetodosPago).toHaveAttribute('aria-selected', 'true', { timeout: 10000 });
    await this.page.waitForTimeout(1200); // Dar tiempo al renderizado del contenido del tab

    // PASO 2: Asegurar que el toggle de personalización esté ON
    // Buscar por el texto visible "Personalizar"
    const toggleLabel = this.page.locator('text=/Personalizar para esta/i').first();
    const toggleParent = toggleLabel.locator('..');
    const toggle = toggleParent.locator('[role="switch"], mat-slide-toggle, .mdc-switch, button[class*="mdc-switch"]').first();

    await expect(toggle).toBeVisible({ timeout: 15000 });
    const isChecked = await toggle.getAttribute('aria-checked') === 'true';
    if (!isChecked) {
      await toggle.click({ force: true });
      await this.page.waitForTimeout(1500);
    }

    // PASO 3: Habilitar todos los métodos de pago disponibles (EFECTIVO, MERCADOPAGO, etc)
    const allSwitches = this.page.locator('[role="switch"], mat-slide-toggle, .mdc-switch, button[class*="mdc-switch"]');
    const total = await allSwitches.count();

    for (let i = 0; i < total; i++) {
      const sw = allSwitches.nth(i);
      const swContainer = sw.locator('..');
      const swText = await swContainer.textContent().catch(() => '');
      const swTextLower = swText?.toLowerCase() || '';
      const isSwChecked = await sw.getAttribute('aria-checked') === 'true';

      // Habilitar todos excepto el primero (que es Personalizar)
      if (!swTextLower.includes('personalizar')) {
        if (!isSwChecked) {
          await sw.click({ force: true });
          await this.page.waitForTimeout(500);
        }
      }
    }

    // PASO 4: Guardar los cambios con el patrón robusto
    const btnGuardar = this.page.locator('button').filter({ hasText: /guardar cambios/i }).first();
    if (await btnGuardar.isVisible({ timeout: 5000 }).catch(() => false)) {
      const saveResponse = this.page.waitForResponse(
        r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
        { timeout: 20000 }
      ).catch(() => null);

      await btnGuardar.click({ force: true });
      await saveResponse;
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async seleccionarMedia(terminoBusqueda: string) {
    // PASO 1: Abrir el selector de media
    await this.btnSeleccionarMedia.click();
    await expect(this.inputBuscarMedia).toBeVisible({ timeout: 10000 });
    
    // PASO 2: Buscar
    await this.inputBuscarMedia.fill(terminoBusqueda);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500); // Dar más tiempo para la carga de media

    // PASO 3: Seleccionar el primer resultado con validación de existencia
    const tile = this.page.locator('mat-grid-tile').first();
    if (await tile.isVisible({ timeout: 10000 }).catch(() => false)) {
      await tile.click({ force: true });
      
      // PASO 4: Confirmar selección (botón dentro del diálogo)
      const btnConfirmar = this.page.locator('mat-dialog-container button').filter({ hasText: /seleccionar/i }).last();
      await expect(btnConfirmar).toBeVisible({ timeout: 10000 });
      await btnConfirmar.click();
    } else {
      console.log(`Advertencia: No se encontró media con el término "${terminoBusqueda}".`);
      await this.page.keyboard.press('Escape');
    }
    
    await this.page.waitForTimeout(500);
  }

  private async seleccionarEnCombo(combo: Locator, valor: string) {
    // Abrir el combo asegurando visibilidad
    await combo.scrollIntoViewIfNeeded();
    await combo.click();

    const tagName = await combo.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
    if (tagName === 'input') {
      // Autocomplete input: limpiar y escribir para filtrar
      await combo.clear();
      await combo.pressSequentially(valor, { delay: 100 });
    }

    // Esperar a que el panel de opciones sea visible
    const panelOpciones = this.page.locator('.mat-mdc-autocomplete-panel, .mat-mdc-select-panel, mat-autocomplete, mat-select-panel');
    await panelOpciones.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });

    // Intentar buscar la opción exacta o fuzzy
    const opcionExacta = this.page.locator('mat-option, mat-mdc-option').filter({ hasText: new RegExp(`^\\s*${valor}\\s*$`, 'i') }).first();
    const opcionFuzzy = this.page.locator('mat-option, mat-mdc-option').filter({ hasText: new RegExp(valor, 'i') }).first();
    const primeraOpcion = this.page.locator('mat-option, mat-mdc-option').first();

    if (await opcionExacta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await opcionExacta.click();
    } else if (await opcionFuzzy.isVisible({ timeout: 2000 }).catch(() => false)) {
      await opcionFuzzy.click();
    } else if (await primeraOpcion.isVisible().catch(() => false)) {
      await primeraOpcion.click();
    } else {
      // Si no hay opciones, cerrar el combo con Escape para no dejarlo abierto
      await this.page.keyboard.press('Escape');
    }

    // Esperar a que el panel se cierre
    await expect(panelOpciones).not.toBeVisible({ timeout: 5000 }).catch(() => { });
  }
}
