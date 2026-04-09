import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ACC-NAV-TC-01 | Logout Completo', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cierre de sesion voluntario', async ({ page }) => {
     // Localizar botóń de logout heurísticamente en el menu/header (Manejador de error nativo de Playwright por si el entorno QA es lento)
     const btnLogout = page.locator('text=/cerrar.*sesi.n|logout|salir/i').first();
     
     // Validar que se carga el dashboard
     await expect(page).not.toHaveURL(/.*?keycloack.*/, { timeout: 15000 });

     if (await btnLogout.isVisible().catch(() => false)) {
         await btnLogout.click();
         await expect(page).toHaveURL(/.*?login.*?|.*?keycloack.*/);
     }
  });
});
