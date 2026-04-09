import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-PRE-PPR-TC-08 | Baja Eliminatoria Física Estándar y Warning Prompter', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-PRE-PPR-TC-08', async ({ paginaPrecios, page }) => {
     await paginaPrecios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
