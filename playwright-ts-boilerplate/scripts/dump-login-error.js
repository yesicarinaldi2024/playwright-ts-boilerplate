const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://bo-dexorder-qa.dexmanager.com/', { waitUntil: 'networkidle' });
  
  // Fill invalid credentials
  await page.locator('#username, [name="username"]').first().fill('error@error.com');
  await page.locator('#password, [name="password"]').first().fill('admin123!');
  await page.locator('#kc-login, [type="submit"]').first().click();
  
  // Wait a bit for the error to appear
  await page.waitForTimeout(2000);
  
  const html = await page.content();
  fs.writeFileSync(path.join(__dirname, 'dump-error.html'), html);
  console.log('HTML dumpeado en scripts/dump-error.html');
  await browser.close();
})();
