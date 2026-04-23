import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  await page.goto(process.env.URL_BASE || 'https://bo-dexorder-qa.dexmanager.com');
  await page.locator('#username').fill(process.env.USUARIO_TEST || '');
  await page.locator('#password').fill(process.env.PASSWORD_TEST || '');
  await page.locator('#kc-login').click();
  await page.waitForURL(/.*bo-dexorder.*(?<!keycloack)/, { timeout: 15000 });
  await page.waitForTimeout(2000);

  await page.goto(`${process.env.URL_BASE}/tenants`);
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: /nuevo tenant/i }).click();
  await page.waitForTimeout(1500);

  await page.locator('input[formControlName="name"]').fill(`TEST_INS_${Date.now()}`);

  // The customer field is an mat-autocomplete-trigger
  // Strategy 1: click the arrow_drop_down button to open autocomplete panel
  const arrowBtn = page.locator('app-dex-data-selector button[mat-icon-button], app-dex-data-selector button').first();
  console.log(`Arrow btn found: ${await arrowBtn.count()}`);
  await arrowBtn.click();
  await page.waitForTimeout(2000);

  let options = await page.locator('.mat-mdc-autocomplete-panel mat-option, .mat-autocomplete-panel mat-option').all();
  console.log(`Options after arrow click: ${options.length}`);
  for (const o of options) console.log(`  -> "${(await o.textContent())?.trim()}"`);

  // If no options, try clicking the input directly
  if (options.length === 0) {
    const input = page.locator('input[placeholder="Buscar customer"]');
    await input.click();
    await page.waitForTimeout(2000);
    options = await page.locator('.mat-mdc-autocomplete-panel mat-option, .mat-autocomplete-panel mat-option').all();
    console.log(`Options after input click: ${options.length}`);
    for (const o of options) console.log(`  -> "${(await o.textContent())?.trim()}"`);
  }

  // If still none, try pressing the input with keyboard
  if (options.length === 0) {
    const input = page.locator('input[placeholder="Buscar customer"]');
    await input.press('ArrowDown');
    await page.waitForTimeout(2000);
    options = await page.locator('.mat-mdc-autocomplete-panel mat-option, .mat-autocomplete-panel mat-option').all();
    console.log(`Options after ArrowDown: ${options.length}`);
    for (const o of options) console.log(`  -> "${(await o.textContent())?.trim()}"`);
  }

  // Check the autocomplete panel visibility
  const panel = page.locator('.mat-mdc-autocomplete-panel, .mat-autocomplete-panel');
  const panelVisible = await panel.isVisible().catch(() => false);
  console.log(`Panel visible: ${panelVisible}`);

  // Check full overlay
  const overlayContent = await page.locator('.cdk-overlay-container').innerHTML();
  console.log(`\nOverlay (last 2000 chars): ${overlayContent.substring(overlayContent.length - 2000)}`);

  await page.waitForTimeout(5000);
  await browser.close();
})();
