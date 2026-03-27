const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules') getFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

console.log('--- SCANNING BACKEND SYNTAX ---');
const filesToCheck = ['server.js', ...getFiles('./src/routes')];
let errorCount = 0;

filesToCheck.forEach(file => {
  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    console.log(`✅ ${file} (PASS)`);
  } catch (e) {
    console.error(`❌ ${file} (FAILED)`);
    console.error(e.stderr.toString());
    errorCount++;
  }
});

if (errorCount > 0) {
  console.error(`\nFound ${errorCount} file(s) with syntax errors.`);
  process.exit(1);
} else {
  console.log('\nAll checked files are syntactically valid! 🚀');
}
