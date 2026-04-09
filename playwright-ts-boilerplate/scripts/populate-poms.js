const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../pages');
const pages = [
    { name: 'PaginaOrganizacion', route: '/organization' },
    { name: 'PaginaCatalogo', route: '/catalog' },
    { name: 'PaginaPrecios', route: '/prices' },
    { name: 'PaginaOperaciones', route: '/operations' },
    { name: 'PaginaMedia', route: '/media' },
    { name: 'PaginaTemas', route: '/themes' },
    { name: 'PaginaUsuarios', route: '/users' },
    { name: 'PaginaAuditoria', route: '/audit' }
];

pages.forEach(p => {
    const content = `import { Page, Locator } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/**
 * Page Object para el módulo ${p.name.replace('Pagina', '')}
 */
export class ${p.name} extends PaginaBase {
  constructor(page: Page) {
    super(page);
  }

  async navegarASeccion() {
    await this.visitar('${p.route}');
    await this.validarRutaContiene('${p.route}');
  }
}
`;
    fs.writeFileSync(path.join(pagesDir, `${p.name}.ts`), content);
});

console.log('Populated 8 Page Objects with standardized structure.');
