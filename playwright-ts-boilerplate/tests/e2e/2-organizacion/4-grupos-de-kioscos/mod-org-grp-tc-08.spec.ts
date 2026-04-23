import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar un grupo recientemente creado que contenga un kiosco vinculado.
 * Verificar que se visualice un QR dentro de la sección QR.
 */
test.describe('MOD-ORG-GRP-TC-08 | Verificar QR en Grupo con Kiosco', () => {

  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Verificar presencia de QR en grupo con kiosco vinculado', async ({ paginaKioscos, paginaGruposKioscos, page }) => {
    const ts = Date.now();
    const nombreGrupo = `AUTO_GRP_QR_${ts}`;
    const nombreKiosco = `AUTO_KIO_QR_${ts}`;

    // 1. Crear grupo
    await paginaGruposKioscos.navegarASeccion();
    await paginaGruposKioscos.crearGrupo(nombreGrupo);

    // 2. Crear kiosco y asignarlo al grupo
    await paginaKioscos.navegarASeccion();
    await paginaKioscos.crearKiosco(nombreKiosco, true);
    await paginaKioscos.irADetalle(nombreKiosco);
    await paginaKioscos.moverAGrupo(nombreGrupo);

    // 3. Ir al grupo y verificar sección QR
    await paginaGruposKioscos.navegarASeccion();
    await paginaGruposKioscos.irADetalle(nombreGrupo);
    await paginaGruposKioscos.tabQR.click();

    // Verificar que exista un elemento QR (canvas, img, o qrcode)
    await expect(
      page.locator('qrcode, canvas, img[alt*="QR"], .qr-container, img[src*="qr"]').first()
    ).toBeVisible({ timeout: 15000 });
  });
});
