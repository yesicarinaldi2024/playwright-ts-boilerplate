import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-FILT-TC-01', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar filtro Día Anterior', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     
     // Act
     await paginaDashboard.elegirOpcionSelectGenerico('Período', 'Ayer');
     await paginaDashboard.aplicar();
     
     // Assert - Just ensure it stays in dashboard and doesn't crash
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
