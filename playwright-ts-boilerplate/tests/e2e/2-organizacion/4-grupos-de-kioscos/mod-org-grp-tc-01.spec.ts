import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear un grupo de kioscos de manera exitosa.
 */
test.describe('MOD-ORG-GRP-TC-01 | Alta Exitosa de Grupo', () => {

  test.beforeEach(async ({ paginaLogin, paginaGruposKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaGruposKioscos.navegarASeccion();
  });

  test('Crear un nuevo grupo de kioscos', async ({ paginaGruposKioscos, page }) => {
    const nombre = `AUTO_GRP_${Date.now()}`;

    await paginaGruposKioscos.crearGrupo(nombre);

    // Verificar que aparece en la grilla
    await paginaGruposKioscos.buscar(nombre);
    await expect(page.locator('tr').filter({ hasText: nombre }).first()).toBeVisible();
  });
});
