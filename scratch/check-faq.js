const fs = require('fs');
const path = require('path');

const cssDir = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css';
const files = ['landing.css', 'medpro-style.css'];

files.forEach(f => {
  const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('faq-indicator') || l.includes('faq-header')) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
});
