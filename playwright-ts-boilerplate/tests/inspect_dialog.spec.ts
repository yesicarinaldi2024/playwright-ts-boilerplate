import { test } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin';
import { PaginaSucursales } from '../pages/PaginaSucursales';

test('Inspect creation dialog buttons', async ({ page }) => {
  const paginaLogin = new PaginaLogin(page);
  const paginaSucursales = new PaginaSucursales(page);

  await paginaLogin.visitarLogin();
  await paginaLogin.autenticar();
  await paginaSucursales.navegarASeccion();

  await paginaSucursales.btnNuevaSucursal.click();
  await page.waitForSelector('mat-dialog-container');

  const buttons = await page.locator('mat-dialog-container button').all();
  console.log('--- Buttons in Dialog ---');
  for (const btn of buttons) {
    const text = await btn.textContent();
    const role = await btn.getAttribute('role');
    const type = await btn.getAttribute('type');
    const ariaLabel = await btn.getAttribute('aria-label');
    console.log(`Text: "${text?.trim()}", Role: "${role}", Type: "${type}", Aria-Label: "${ariaLabel}"`);
  }
  console.log('-------------------------');
});
