const fs = require('fs');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('tel:') || l.includes('hotline') || l.includes('Hotline')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
