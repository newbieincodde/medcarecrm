const fs = require('fs');

const articlesCode = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/articles-data.js', 'utf8');
const portalModalsCode = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/portal-modals.js', 'utf8');

const window = {};
global.window = window;

const dom = {};
const document = {
  body: {
    style: { overflow: '' },
    appendChild: function(el) { dom[el.id] = el; }
  },
  documentElement: {
    style: { overflow: '' }
  },
  addEventListener: () => {},
  getElementById: (id) => dom[id] || null,
  createElement: (tag) => {
    const el = {
      tagName: tag,
      id: '',
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); }
      },
      style: {},
      set innerHTML(html) {
        this._html = html;
        // mock child element lookup
        if (html.includes('id="articleReaderContent"')) {
          dom['articleReaderContent'] = {
            innerHTML: '',
            querySelector: (sel) => ({ onclick: null, addEventListener: (e, cb) => {} })
          };
        }
        if (html.includes('id="bookServiceDisplay"')) {
          dom['bookServiceDisplay'] = { value: '' };
        }
        if (html.includes('id="bookFacilitySelect"')) {
          dom['bookFacilitySelect'] = { options: [], selectedIndex: 0, add: () => {} };
        }
      },
      get innerHTML() { return this._html; }
    };
    return el;
  }
};
global.document = document;

eval(articlesCode);
eval(portalModalsCode);

console.log('Testing openArticleReader art-02...');
window.openArticleReader('art-02');
const reader = dom['articleReaderModal'];
console.log('Reader has open class:', reader.classList.classes.has('open'));
console.log('Body overflow during reader open:', document.body.style.overflow);

window.closeArticleReader();
console.log('Reader has open class after close:', reader.classList.classes.has('open'));
console.log('Body overflow after close:', document.body.style.overflow);
