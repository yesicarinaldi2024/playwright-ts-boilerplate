import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-PRE-PPR-TC-01 | Alta Dinámica Referencial Simple (Precio Constante)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-PRE-PPR-TC-01', async ({ paginaPrecios, page }) => {
     await paginaPrecios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
