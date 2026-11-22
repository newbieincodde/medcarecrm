const fs = require('fs');
const goikhamHtml = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/goi-kham.html', 'utf8');
console.log('goi-kham.html has id="comparison"?', goikhamHtml.includes('id="comparison"'));
