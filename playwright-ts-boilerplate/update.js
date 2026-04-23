const fs = require('fs');
const path = require('path');

const planDir = path.join(__dirname, 'plan-de-pruebas');
const testsDir = path.join(__dirname, 'tests/e2e');

const mdFiles = fs.readdirSync(planDir).filter(f => f.endsWith('.md'));
const tcMap = new Map();

for (const file of mdFiles) {
    const content = fs.readFileSync(path.join(planDir, file), 'utf8').replace(/\r\n/g, '\n');
    const blockRegex = /###\s+([\w-]+)\s*\|\s*(.*?)\n[\s\S]*?\*\s*\**Objetivo:\**\s*(.*)/g;
    let match;
    while ((match = blockRegex.exec(content)) !== null) {
        const id = match[1].trim();
        const title = match[2].trim();
        const objective = match[3].trim();
        tcMap.set(id, { title, objective });
    }
}

console.log(`Loaded ${tcMap.size} test cases from markdown files.`);

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (filePath.endsWith('.spec.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const specFiles = getAllFiles(testsDir);
console.log(`Found ${specFiles.length} spec files.`);

let updatedCount = 0;

for (const specFile of specFiles) {
    let content = fs.readFileSync(specFile, 'utf8');
    let changed = false;
    
    for (const [id, data] of tcMap.entries()) {
        // match test.describe('MOD-ID', ...) or test.describe('MOD-ID | Anything', ...)
        const regex = new RegExp(`^([ \\t]*)test\\.describe\\(['"\`]${id}(?:\\s*\\|.*?)?['"\`]\\s*,`, 'gm');
        if (regex.test(content)) {
            // Check if objective is already in the file to avoid dupes
            if (!content.includes(`Objetivo: ${data.objective}`)) {
                content = content.replace(regex, (match, indent) => {
                    const newTitle = `${id} | ${data.title}`;
                    return `${indent}/**\n${indent} * Objetivo: ${data.objective}\n${indent} */\n${indent}test.describe('${newTitle}',`;
                });
                changed = true;
            }
        }
    }
    
    if (changed) {
        fs.writeFileSync(specFile, content, 'utf8');
        updatedCount++;
    }
}
console.log(`Updated ${updatedCount} files.`);
