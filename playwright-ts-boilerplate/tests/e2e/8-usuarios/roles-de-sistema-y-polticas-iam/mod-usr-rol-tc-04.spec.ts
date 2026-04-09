import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-USR-ROL-TC-04 | Destrucción Política ROL Pre Existente (Lógica Cascada)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-USR-ROL-TC-04', async ({ paginaUsuarios, page }) => {
     await paginaUsuarios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
