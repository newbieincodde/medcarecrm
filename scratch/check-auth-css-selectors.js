const fs = require('fs');
const css = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/auth.css', 'utf8');
console.log('Total lines in auth.css:', css.split('\n').length);
// Check if any classes like .auth-form, .form-group, .btn are used
console.log('Selectors in auth.css:');
const matches = css.match(/^\.[a-zA-Z0-9_-]+/gm) || [];
console.log(Array.from(new Set(matches)));
