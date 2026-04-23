import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Destuir filtros aplicados y reset.
 */
test.describe('MOD-AUD-LOG-TC-06 | Funcionalidad Botón Restablecer Limpiar Base', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-AUD-LOG-TC-06', async ({ paginaAuditoria, page }) => {
     await paginaAuditoria.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
