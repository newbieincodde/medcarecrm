const fs = require('fs');
const content = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/landing.js', 'utf8');
const window = {};
global.window = window;
eval(content.slice(content.indexOf('const ARTICLES_FULL_CONTENT'), content.indexOf('window.openArticleReader')));
console.log('Keys in ARTICLES_FULL_CONTENT:', Object.keys(ARTICLES_FULL_CONTENT));
for (const [k, v] of Object.entries(ARTICLES_FULL_CONTENT)) {
  console.log(k, 'title:', v.title);
  if (v.title.includes('"') || v.title.includes("'")) {
    console.log('--> HAS QUOTES:', v.title);
  }
}
