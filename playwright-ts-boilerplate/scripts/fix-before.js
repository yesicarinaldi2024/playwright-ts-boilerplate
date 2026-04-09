const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dirs = ['filtros', 'grficos-y-tablas-generales', 'mtricas-base'];

dirs.forEach(d => {
  const p = path.join(__dirname, '../tests/e2e/dashboard', d);
  fs.readdirSync(p).filter(f => f.endsWith('.ts')).forEach(f => {
    let content = fs.readFileSync(path.join(p, f), 'utf-8');
    if (!content.includes('beforeEach')) {
      // Need config env imported too
      if(!content.includes('envConfig')) {
          content = "import { envConfig } from '../../../../config/env';\n" + content;
      }
      const inject = `\n  test.beforeEach(async ({ paginaLogin }) => {\n    await paginaLogin.visitar('https://bo-dexorder-qa.dexmanager.com/login');\n    await paginaLogin.autenticar(envConfig.USUARIO_TEST, envConfig.PASSWORD_TEST);\n  });\n`;
      content = content.replace("', () => {", "', () => {" + inject);
      fs.writeFileSync(path.join(p, f), content);
    }
  });
});
console.log('Fixed beforeEach hook');
