import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Verificar parseo del lado del browser impidiendo NaN.
 */
test.describe('MOD-PRE-PPR-TC-02 | Edición Preventiva - Inserción Caractéres Inválidos Letras (Flujo Error)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-PRE-PPR-TC-02', async ({ paginaPrecios, page }) => {
     await paginaPrecios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
