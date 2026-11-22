const fs = require('fs');
const landingJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/landing.js', 'utf8');
const lines = landingJs.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btnHeroSearch')) console.log((i+1) + ': ' + l);
});
