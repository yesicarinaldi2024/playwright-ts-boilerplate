const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.spec.ts')) {
            results.push(file);
        }
    });
    return results;
}

const testsDir = path.join(__dirname, '../tests/e2e');
const specFiles = walk(testsDir);

const mapping = {
    'organizacion': 'paginaOrganizacion',
    'catalogo': 'paginaCatalogo',
    'precios': 'paginaPrecios',
    'operaciones': 'paginaOperaciones',
    'media': 'paginaMedia',
    'temas': 'paginaTemas',
    'usuarios': 'paginaUsuarios',
    'auditoria': 'paginaAuditoria',
    'dashboard': 'paginaDashboard'
};

specFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find which module it belongs to
    let moduleKey = Object.keys(mapping).find(m => file.includes(m));
    if (moduleKey) {
        let pomVar = mapping[moduleKey];
        // Replace TODO and console log with navegarASeccion
        const regex = new RegExp(`// TODO: Implementar lógica de negocio mediante POM\\s+console\\.log\\('Testing: .*?'\\);`, 'g');
        content = content.replace(regex, `await ${pomVar}.navegarASeccion();`);
        
        // Also ensure the pomVar is in the destructuring of the test arguments if not already (safely)
        if (!content.includes(pomVar)) {
             content = content.replace(/async\s*\(\{\s*page\s*\}\)/, `async ({ ${pomVar}, page })`);
        }
    }
    
    fs.writeFileSync(file, content);
});

console.log(`Updated ${specFiles.length} specs with navegarASeccion() calls.`);
