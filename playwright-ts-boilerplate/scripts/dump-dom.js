const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Navegando a la url de QA...');
  
  // Vamos a la ruta raíz y dejamos que el router nos redirija al login
  await page.goto('https://bo-dexorder-qa.dexmanager.com/', { waitUntil: 'networkidle' });
  
  // Extraemos atributos clave de todos los inputs y botones interactuables
  const fs = require('fs');
  const path = require('path');
  const html = await page.content();
  fs.writeFileSync(path.join(__dirname, 'dump.html'), html);
  console.log('HTML dumpeado en scripts/dump.html');
  await browser.close();
})();
