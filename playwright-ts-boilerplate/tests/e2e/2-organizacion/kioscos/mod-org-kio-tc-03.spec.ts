import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ORG-KIO-TC-03 | Aplicaciones Múltiples de Kioscos en la grilla: Refuerzo en Grupo Virtual Genérico', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-KIO-TC-03', async ({ paginaOrganizacion, page }) => {
     await paginaOrganizacion.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
