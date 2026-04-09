const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://bo-dexorder-qa.dexmanager.com/login', { waitUntil: 'networkidle' });
  
  // Login via Keycloak
  await page.locator('#username').fill(process.env.USUARIO_TEST);
  await page.locator('#password').fill(process.env.PASSWORD_TEST);
  await page.locator('#kc-login').click();
  
  // Wait for Dashboard to mount
  await page.waitForURL(/.*?dashboard.*/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  
  const html = await page.content();
  fs.writeFileSync(path.join(__dirname, 'dump-dashboard.html'), html);
  console.log('HTML de Dashboard extraído.');
  await browser.close();
})();
