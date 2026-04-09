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

specFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Purgar hardcoded URLs
    content = content.replace(/visitar\('.*?login'\)/g, "visitarLogin()");
    
    // Purgar importaciones de envConfig explicitas que ensucian el Spec
    content = content.replace(/import\s+\{\s*envConfig\s*\}\s*from\s+['"].*?env['"]\s*;[\r\n]*/g, '');
    
    // Purgar el test-base si lo está importando desde fixtures para envConfig
    content = content.replace(/import\s+\{\s*test,\s*expect,\s*envConfig\s*\}\s*from/g, "import { test, expect } from");
    
    // Purgar parámetros en autenticar
    content = content.replace(/autenticar\([^)]+\)/g, "autenticar()");
    
    fs.writeFileSync(file, content);
});

console.log(`Pugados ${specFiles.length} archivos spec.ts siguiendo heurística Clean POM.`);
