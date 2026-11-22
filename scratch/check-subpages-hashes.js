const fs = require('fs');
const path = require('path');

const pagesDir = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages';
fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('href="#steps"') || l.includes('href="#specialties"')) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
