const fs = require('fs');

const tinTucHtml = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/tin-tuc.html', 'utf8');
const articlesJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/articles-data.js', 'utf8');
const portalModalsJs = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/portal-modals.js', 'utf8');

// Load articles
const window = {};
global.window = window;
eval(articlesJs);
console.log('Total articles in window.CLINICAL_ARTICLES:', window.CLINICAL_ARTICLES ? window.CLINICAL_ARTICLES.length : 0);

// Check tin-tuc.html inline script
const scriptMatch = tinTucHtml.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log('tin-tuc.html inline script syntax: OK');
  } catch(e) {
    console.error('tin-tuc.html inline script syntax ERROR:', e);
  }
}

// Check how openArticleReader is implemented
// Does any article title contain single quotes or double quotes that break onclick="openBookingModal('...')"?
let brokenQuotes = 0;
if (window.CLINICAL_ARTICLES) {
  window.CLINICAL_ARTICLES.forEach((art, idx) => {
    if (art.title.includes("'") || art.title.includes('"') || art.title.includes('`')) {
      console.log(`Article #${idx + 1} (${art.id}) has quotes in title: ${art.title}`);
      brokenQuotes++;
    }
  });
}
console.log('Total articles with quotes in title:', brokenQuotes);
