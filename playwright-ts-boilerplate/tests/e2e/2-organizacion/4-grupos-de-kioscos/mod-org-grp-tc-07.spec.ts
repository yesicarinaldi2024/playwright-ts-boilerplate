import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar un kiosco recientemente creado y moverlo a otro grupo
 * que haya sido recién creado.
 */
test.describe('MOD-ORG-GRP-TC-07 | Mover Kiosco a Grupo Recién Creado', () => {

  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Crear grupo nuevo y reasignar kiosco a él', async ({ paginaKioscos, paginaGruposKioscos, page }) => {
    const ts = Date.now();
    const nombreKiosco = `AUTO_KIO_REASIG_${ts}`;
    const nombreGrupoNuevo = `AUTO_GRP_NUEVO_${ts}`;

    // 1. Crear el kiosco
    await paginaKioscos.navegarASeccion();
    await paginaKioscos.crearKiosco(nombreKiosco, true);

    // 2. Crear el grupo nuevo
    await paginaGruposKioscos.navegarASeccion();
    await paginaGruposKioscos.crearGrupo(nombreGrupoNuevo);

    // 3. Volver a kioscos y mover el kiosco al grupo nuevo
    await paginaKioscos.navegarASeccion();
    await paginaKioscos.irADetalle(nombreKiosco);
    await paginaKioscos.moverAGrupo(nombreGrupoNuevo);

    // Verificar que sigue en detalle
    await expect(page.locator('.mat-mdc-card-title, h1, h2').filter({ hasText: nombreKiosco }).first()).toBeVisible();
  });
});
