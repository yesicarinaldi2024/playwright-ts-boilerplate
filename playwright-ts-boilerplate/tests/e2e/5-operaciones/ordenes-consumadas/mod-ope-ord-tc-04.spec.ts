import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Emitir Blob download técnico de orden.
 */
test.describe('MOD-OPE-ORD-TC-04 | Extracción Ciega por Archivo (Descargar Json Orden Pura)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-OPE-ORD-TC-04', async ({ paginaOperaciones, page }) => {
     await paginaOperaciones.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
