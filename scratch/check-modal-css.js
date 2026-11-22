const fs = require('fs');
const css = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/medpro-style.css', 'utf8');

const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.public-booking-box') || l.includes('.public-booking-overlay')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
