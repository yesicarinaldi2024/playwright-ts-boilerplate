import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar y consultar un kiosco creado. Navegar a la solapa
 * Medios de Pago y habilitar los medios de pago.
 */
test.describe('MOD-ORG-GRP-TC-10 | Kiosco – Habilitar Medios de Pago', () => {

  test.beforeEach(async ({ paginaLogin, paginaKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaKioscos.navegarASeccion();
  });

  test('Habilitar todos los medios de pago de un kiosco', async ({ paginaKioscos, page }) => {
    const nombreKiosco = `AUTO_KIO_PAGOS_${Date.now()}`;

    await paginaKioscos.crearKiosco(nombreKiosco, true);
    await paginaKioscos.irADetalle(nombreKiosco);

    // Habilitar todos los medios de pago
    await paginaKioscos.habilitarMediosDePago();

    // Verificar que al menos un checkbox quedó checked
    await paginaKioscos.tabMediosPago.click();
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });
});
