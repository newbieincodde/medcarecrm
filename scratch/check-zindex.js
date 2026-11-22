const fs = require('fs');
const path = require('path');

const cssDir = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css';
const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('z-index')) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
});
