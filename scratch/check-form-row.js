const fs = require('fs');
const css1 = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/medpro-style.css', 'utf8');
const css2 = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/landing.css', 'utf8');

function find(css, name) {
  css.split('\n').forEach((l, i) => {
    if (l.includes('.form-row')) console.log(`${name}:${i+1}: ${l}`);
  });
}
find(css1, 'medpro-style.css');
find(css2, 'landing.css');
