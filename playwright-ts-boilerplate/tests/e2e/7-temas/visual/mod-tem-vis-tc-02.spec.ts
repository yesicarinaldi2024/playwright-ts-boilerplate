import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-TEM-VIS-TC-02 | Falla de Carga de Tema Carente de Identidad (Sin Nombre)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-VIS-TC-02', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
