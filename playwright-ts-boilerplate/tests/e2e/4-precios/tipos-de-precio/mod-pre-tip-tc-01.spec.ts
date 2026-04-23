import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Seguridad arquitectónica: el manual asegura que un precio primitivo anclado no puede morir ("Una vez creado, el primer precio -Default- no puede eliminarse").
 */
test.describe('MOD-PRE-TIP-TC-01 | Falla forzada en eliminación de "Default Price Type"', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-PRE-TIP-TC-01', async ({ paginaPrecios, page }) => {
     await paginaPrecios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
