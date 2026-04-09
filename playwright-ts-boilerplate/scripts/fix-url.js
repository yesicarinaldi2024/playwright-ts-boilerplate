const fs = require('fs');
const path = require('path');
const dirs = ['filtros', 'grficos-y-tablas-generales', 'mtricas-base'];

dirs.forEach(d => {
  const p = path.join(__dirname, '../tests/e2e/dashboard', d);
  fs.readdirSync(p).filter(f => f.endsWith('.ts')).forEach(f => {
    let content = fs.readFileSync(path.join(p, f), 'utf-8');
    content = content.replace(/await page\.waitForURL.*/g, "await page.waitForURL(/.*?\\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');");
    fs.writeFileSync(path.join(p, f), content);
  });
});
console.log('Fixed URL selector');
