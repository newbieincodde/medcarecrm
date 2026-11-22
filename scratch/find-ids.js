const fs = require('fs');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="packages"') || l.includes('id="steps"') || l.includes('id="specialties"')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
