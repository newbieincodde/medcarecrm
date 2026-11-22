const fs = require('fs');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/dich-vu.html', 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log('dich-vu.html inline script: NO SYNTAX ERRORS!');
  } catch (e) {
    console.error('dich-vu.html inline script error:', e);
  }
}
