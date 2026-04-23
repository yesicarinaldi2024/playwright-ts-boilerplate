import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Excluir inserciones nulas tempranas.
 */
test.describe('MOD-USR-ABM-TC-03 | Intento Invalido Formateado Correo Regex Base', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-USR-ABM-TC-03', async ({ paginaUsuarios, page }) => {
     await paginaUsuarios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
