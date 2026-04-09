const fs = require('fs');
const path = require('path');
const dirs = ['filtros', 'grficos-y-tablas-generales', 'mtricas-base'];

dirs.forEach(d => {
  const p = path.join(__dirname, '../tests/e2e/dashboard', d);
  fs.readdirSync(p).filter(f => f.endsWith('.ts')).forEach(f => {
    let content = fs.readFileSync(path.join(p, f), 'utf-8');
    content = content.replace(/import { envConfig } from '.*';\r?\n/, '');
    content = content.replace(/import { test, expect } from '.*fixtures\/test-base';/, "import { test, expect, envConfig } from '../../../fixtures/test-base';");
    fs.writeFileSync(path.join(p, f), content);
  });
});
console.log('Fixed imports via fixtures');
