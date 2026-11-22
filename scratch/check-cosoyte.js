const fs = require('fs');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/co-so-y-te.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log('co-so-y-te.html script syntax: OK');
  } catch(e) {
    console.error('co-so-y-te.html script syntax ERROR:', e);
  }
}
