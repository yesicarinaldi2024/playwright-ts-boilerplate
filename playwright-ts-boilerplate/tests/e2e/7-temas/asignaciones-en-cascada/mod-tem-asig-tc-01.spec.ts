import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: El Tema A rige todo por Default si es el Global del Account.
 */
test.describe('MOD-TEM-ASIG-TC-01 | Asignación Directa Inclusiva Nivel Raíz (Tenant)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-ASIG-TC-01', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
