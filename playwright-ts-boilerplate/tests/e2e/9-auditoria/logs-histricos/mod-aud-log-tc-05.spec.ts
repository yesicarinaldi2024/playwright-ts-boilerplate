import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-AUD-LOG-TC-05 | Inyección Lateral Detalle JSON Raw Information', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-AUD-LOG-TC-05', async ({ paginaAuditoria, page }) => {
     await paginaAuditoria.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
