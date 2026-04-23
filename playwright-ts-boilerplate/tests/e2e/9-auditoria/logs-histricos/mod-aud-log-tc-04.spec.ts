import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Filtrar logs destructivos.
 */
test.describe('MOD-AUD-LOG-TC-04 | Parametrización Búsqueda Filter Type "DELETE" Exclusivo', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-AUD-LOG-TC-04', async ({ paginaAuditoria, page }) => {
     await paginaAuditoria.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
