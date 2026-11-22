const fs = require('fs');

console.log('=== LOGIN.HTML ===');
console.log(fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/login.html', 'utf8').slice(0, 1000));

console.log('=== AUTH.JS ===');
console.log(fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/auth.js', 'utf8').slice(0, 1000));
