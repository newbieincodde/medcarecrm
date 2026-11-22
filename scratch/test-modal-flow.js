const fs = require('fs');

// Load articles-data.js and portal-modals.js
const articlesCode = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/articles-data.js', 'utf8');
const portalModalsCode = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/js/portal-modals.js', 'utf8');

// Mock DOM
const window = {};
global.window = window;

const elements = new Map();
const document = {
  body: {
    style: {
      overflow: '',
      removeProperty: function(prop) { delete this[prop]; }
    },
    appendChild: function(el) { elements.set(el.id, el); }
  },
  documentElement: {
    style: {
      overflow: '',
      removeProperty: function(prop) { delete this[prop]; }
    }
  },
  addEventListener: () => {},
  getElementById: (id) => elements.get(id) || null,
  createElement: (tag) => {
    const el = {
      tagName: tag,
      id: '',
      className: '',
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      style: {},
      innerHTML: '',
      querySelector(sel) {
        return { onclick: null, addEventListener: function(e, cb) { this.onclick = cb; } };
      }
    };
    return el;
  }
};
global.document = document;

// Evaluate scripts
eval(articlesCode);
eval(portalModalsCode);

console.log('--- TEST 1: Open and Close Article Reader ---');
console.log('Initial body overflow:', document.body.style.overflow);
window.openArticleReader('art-02'); // The one with quotes: Tăng Huyết Áp: "Kẻ Giết Người Thầm Lặng"...
console.log('After open article 2 overflow:', document.body.style.overflow);
const readerModal = elements.get('articleReaderModal');
console.log('Reader modal classes:', Array.from(readerModal.classList.classes));
window.closeArticleReader();
console.log('After close article reader overflow:', document.body.style.overflow);

console.log('--- TEST 2: Open Booking Modal with Hospital as 1st param ---');
window.openBookingModal('Bệnh viện Đa khoa Tư nhân Triều An');
const bookModal = elements.get('publicBookingModal');
console.log('Book modal classes:', Array.from(bookModal.classList.classes));
console.log('After open booking modal overflow:', document.body.style.overflow);
window.closeBookingModal();
console.log('After close booking modal overflow:', document.body.style.overflow);

console.log('--- ALL TESTS PASSED! ---');
