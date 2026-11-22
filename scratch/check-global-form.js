const fs = require('fs');
const css = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/global.css', 'utf8');

css.split('\n').forEach((l, i) => {
  if (l.includes('.form-row') || l.includes('form-group')) {
    console.log(`global.css:${i+1}: ${l}`);
  }
});
