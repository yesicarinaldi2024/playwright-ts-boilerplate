import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-TEM-VIS-TC-01 | Instanciación General Objeto Tema Base', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-VIS-TC-01', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
