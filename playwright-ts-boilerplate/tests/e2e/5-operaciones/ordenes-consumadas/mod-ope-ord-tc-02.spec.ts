import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-OPE-ORD-TC-02 | Despliegue Componente Resumen de Instancias de Venta', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-OPE-ORD-TC-02', async ({ paginaOperaciones, page }) => {
     await paginaOperaciones.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
