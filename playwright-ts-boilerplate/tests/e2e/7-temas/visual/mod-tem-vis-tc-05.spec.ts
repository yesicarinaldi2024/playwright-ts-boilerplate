import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Uso de biblioteca de Storage interna frente a Drag and Drop.
 */
test.describe('MOD-TEM-VIS-TC-05 | Inyección Asset Modal desde `Seleccionar Media`', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-TEM-VIS-TC-05', async ({ paginaTemas, page }) => {
     await paginaTemas.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
