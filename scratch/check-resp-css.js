const fs = require('fs');
const resp = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/css/responsive.css', 'utf8');
console.log(resp.slice(0, 500));
