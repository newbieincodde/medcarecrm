const fs = require('fs');
const content = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/articles-data.js', 'utf8');
const window = {};
global.window = window;
eval(content);
const broken = window.MEDCARE_ARTICLES_50.filter(a => a.title.includes('"') || a.title.includes("'"));
console.log('Articles with quotes in title count:', broken.length);
broken.forEach(b => console.log(b.id, ':', b.title));
