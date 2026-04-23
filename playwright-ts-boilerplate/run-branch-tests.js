const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testDir = path.join(__dirname, 'tests', 'e2e', '2-organizacion', '2-sucursales');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

console.log(`Found ${files.length} test files in 2-sucursales.`);

let results = [];

for (const file of files) {
    console.log(`\nRunning: ${file}`);
    try {
        const output = execSync(`npx playwright test "${path.join(testDir, file)}" --project=chromium`, {
            cwd: __dirname,
            encoding: 'utf8',
            stdio: 'inherit'
        });
        results.push({ file, status: 'PASSED' });
    } catch (error) {
        results.push({ file, status: 'FAILED', error: error.message });
    }
}

console.log('\n--- Final Results ---');
results.forEach(r => console.log(`${r.status.padEnd(7)} | ${r.file}`));
fs.writeFileSync(path.join(__dirname, 'branch-tests-results.txt'), JSON.stringify(results, null, 2));
