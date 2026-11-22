const fs = require('fs');

const js = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/medical-knowledge.js', 'utf8');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/pages/chuyen-khoa.html', 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const window = {};
  global.window = window;
  eval(js);
  console.log('Specialties in knowledge:', Object.keys(window.SPECIALTIES_KNOWLEDGE).length);
  
  let innerHTMLResult = '';
  const document = {
    addEventListener: () => {},
    getElementById: (id) => {
      return {
        set innerHTML(val) { innerHTMLResult = val; },
        get innerHTML() { return innerHTMLResult; },
        style: {}
      };
    },
    querySelectorAll: () => []
  };
  global.document = document;

  try {
    eval(scriptMatch[1]);
    console.log('Script parsed without syntax errors!');
    renderSpecialtiesList('all');
    console.log('Rendered cards HTML length:', innerHTMLResult.length);
    console.log('Rendered cards count:', (innerHTMLResult.match(/specialtyKnowledge/g) || []).length);
  } catch(e) {
    console.error('FAILED TO EXECUTE:', e);
  }
}
