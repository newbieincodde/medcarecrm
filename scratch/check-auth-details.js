const fs = require('fs');

const login = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/login.html', 'utf8');
const register = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/register.html', 'utf8');
const authJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/auth.js', 'utf8');

console.log('Login HTML lines:', login.split('\n').length);
console.log('Register HTML lines:', register.split('\n').length);
console.log('Auth JS lines:', authJs.split('\n').length);

// Let's print auth.js key functions
const authLines = authJs.split('\n');
authLines.forEach((l, i) => {
  if (l.startsWith('function ') || l.startsWith('const ') || l.includes('addEventListener') || l.includes('role')) {
    console.log(`${i+1}: ${l}`);
  }
});
