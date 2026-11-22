const fs = require('fs');
const landingJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/landing.js', 'utf8');
console.log('Includes btnHeroSearch?', landingJs.includes('btnHeroSearch'));
