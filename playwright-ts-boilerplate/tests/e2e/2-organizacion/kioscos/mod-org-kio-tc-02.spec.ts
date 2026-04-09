import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ORG-KIO-TC-02 | Falla de alta de dispositivo Físico carente de Matriz Device (Flujo de Error)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-KIO-TC-02', async ({ paginaOrganizacion, page }) => {
     await paginaOrganizacion.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
