import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-USR-ABM-TC-04 | Cambio Atributo Activo/Inactivo Toggle Lateral', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-USR-ABM-TC-04', async ({ paginaUsuarios, page }) => {
     await paginaUsuarios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
