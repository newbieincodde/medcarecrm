const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm';

// Check chatbox.js syntax and runtime logic
const chatboxCode = fs.readFileSync(path.join(root, 'js', 'chatbox.js'), 'utf8');

const window = {};
global.window = window;

const elementStore = new Map();
function makeEl(tag) {
  return {
    tagName: tag,
    id: '',
    className: '',
    classList: {
      s: new Set(),
      add(c) { this.s.add(c); },
      remove(c) { this.s.delete(c); },
      toggle(c) { if (this.s.has(c)) this.s.delete(c); else this.s.add(c); },
      contains(c) { return this.s.has(c); }
    },
    style: {},
    children: [],
    appendChild(c) { this.children.push(c); },
    addEventListener(evt, fn) { this['on' + evt] = fn; },
    querySelector: () => makeEl('div'),
    querySelectorAll: () => [],
    focus: () => {}
  };
}

global.document = {
  body: makeEl('body'),
  createElement: makeEl,
  getElementById: (id) => elementStore.get(id) || makeEl('div'),
  addEventListener: () => {}
};

try {
  eval(chatboxCode);
  console.log('chatbox.js evaluated successfully in simulated environment!');
} catch(e) {
  console.error('chatbox.js evaluation error:', e);
}
