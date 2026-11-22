const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('\\`') || l.includes('\\${')) {
      console.log(`${filePath}:${idx + 1}: ${l.trim()}`);
    }
  });
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') walk(full);
    } else if (f.endsWith('.html') || f.endsWith('.js')) {
      checkFile(full);
    }
  }
}

walk('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm');
