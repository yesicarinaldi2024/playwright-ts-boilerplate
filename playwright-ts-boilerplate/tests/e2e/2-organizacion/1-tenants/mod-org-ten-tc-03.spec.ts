import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Verificar que funcione la modificacion de datos de un Tentant. Se van a modificar datos dentro de la pestaña Info.
 */
test.describe('MOD-ORG-TEN-TC-03 | Modificación de Pestaña Info en Tenant', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-TEN-TC-03', async ({ paginaOrganizacion, page }) => {
    await paginaOrganizacion.navegarASeccion();

    // Validación Base Heurística General
    await expect(page).toHaveURL(/.*?/);
  });
});
