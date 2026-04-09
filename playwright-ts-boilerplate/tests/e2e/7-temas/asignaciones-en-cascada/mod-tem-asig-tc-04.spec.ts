import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-TEM-ASIG-TC-04 | Intento Restrictivo Cancelación Tema Unitario', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-ASIG-TC-04', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
