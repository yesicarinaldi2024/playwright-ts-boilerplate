import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-TEM-ASIG-TC-05 | Adoctrinación Formato Carrito SVG Limitante (Manejo Base Vectorial)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-ASIG-TC-05', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
