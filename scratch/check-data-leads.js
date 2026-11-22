const fs = require('fs');
const dataJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/data.js', 'utf8');

const lines = dataJs.split('\n');
lines.forEach((l, i) => {
  if (l.includes('INIT_LEADS') || l.includes('medcare_leads') || l.includes('DEMO_LEADS')) {
    console.log(`${i+1}: ${l}`);
  }
});
