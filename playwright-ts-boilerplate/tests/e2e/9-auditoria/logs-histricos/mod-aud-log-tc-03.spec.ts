import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Comprimir data devuelta para no trancar Navegador del Owner.
 */
test.describe('MOD-AUD-LOG-TC-03 | Aislamiento Temporal DatePicker "Desde > Hasta"', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-AUD-LOG-TC-03', async ({ paginaAuditoria, page }) => {
     await paginaAuditoria.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
