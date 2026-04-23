import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar y consultar un kiosco. Navegar a la sección de Menús
 * y acceder al menú que tiene vinculado.
 */
test.describe('MOD-ORG-GRP-TC-09 | Kiosco – Navegar a Menús Vinculados', () => {

  test.beforeEach(async ({ paginaLogin, paginaKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaKioscos.navegarASeccion();
  });

  test('Acceder a la sección Menús de un kiosco', async ({ paginaKioscos, page }) => {
    const nombreKiosco = `AUTO_KIO_MENU_${Date.now()}`;

    await paginaKioscos.crearKiosco(nombreKiosco, true);
    await paginaKioscos.irADetalle(nombreKiosco);

    // Navegar a la pestaña de Menús
    await paginaKioscos.tabMenus.click();

    // Verificar que la sección de menús está visible
    await expect(paginaKioscos.tabMenus).toHaveAttribute('aria-selected', 'true');

    // Si hay un menú vinculado, intentar acceder
    const primerMenu = page.locator('tr, mat-list-item, .menu-item').first();
    if (await primerMenu.isVisible()) {
      await primerMenu.click();
      // Verificar navegación al detalle del menú
      await expect(page).toHaveURL(/.*\/(menus|menu)/);
    }
  });
});
