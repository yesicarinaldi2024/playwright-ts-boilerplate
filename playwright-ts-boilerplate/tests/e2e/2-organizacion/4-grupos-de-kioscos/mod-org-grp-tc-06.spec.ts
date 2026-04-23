import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear un grupo y activarlo.
 */
test.describe('MOD-ORG-GRP-TC-06 | Crear y Activar Grupo', () => {

  test.beforeEach(async ({ paginaLogin, paginaGruposKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaGruposKioscos.navegarASeccion();
  });

  test('Crear grupo y cambiar su estado a Activo', async ({ paginaGruposKioscos, page }) => {
    const nombre = `AUTO_GRP_ACTIVO_${Date.now()}`;

    await paginaGruposKioscos.crearGrupo(nombre);
    await paginaGruposKioscos.irADetalle(nombre);
    await paginaGruposKioscos.activarGrupo();

    // Verificar que el toggle queda en estado activo
    const toggle = page.locator('mat-slide-toggle').first();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
