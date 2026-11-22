const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm';
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

console.log('=== 1. AUDITING INTERNAL LINKS IN index.html ===');
const hrefRegex = /href=["']([^"'#][^"']*)["']/g;
let match;
const internalHrefs = [];
const brokenHrefs = [];

while ((match = hrefRegex.exec(indexHtml)) !== null) {
  const link = match[1];
  if (!link.startsWith('http') && !link.startsWith('tel:') && !link.startsWith('mailto:') && !link.startsWith('javascript:')) {
    internalHrefs.push(link);
    const clean = link.split('?')[0].split('#')[0];
    const targetPath = path.resolve(root, clean);
    if (!fs.existsSync(targetPath)) {
      brokenHrefs.push({ link, targetPath });
    }
  }
}

console.log('Total internal links:', internalHrefs.length);
console.log('Broken internal links count:', brokenHrefs.length);
if (brokenHrefs.length > 0) {
  console.log('Broken links details:', brokenHrefs);
}

console.log('\n=== 2. AUDITING ONCLICK HANDLERS IN index.html ===');
const onclickRegex = /onclick=["']([^"']+)["']/g;
const onClicks = [];
while ((match = onclickRegex.exec(indexHtml)) !== null) {
  onClicks.push(match[1]);
}
console.log('Total onclick attributes:', onClicks.length);

const calledFuncs = new Set();
onClicks.forEach(c => {
  const funcMatch = c.match(/([a-zA-Z0-9_$]+)\s*\(/g);
  if (funcMatch) {
    funcMatch.forEach(f => calledFuncs.add(f.replace(/\s*\(/, '')));
  }
});
console.log('Functions called via onclick:', Array.from(calledFuncs));

// Load all scripts included in index.html to check function definitions
const scriptTags = indexHtml.match(/<script[^>]*src="([^"]+)"/g) || [];
const loadedScripts = scriptTags.map(s => s.match(/src="([^"]+)"/)[1]);
console.log('\nLoaded scripts in index.html:', loadedScripts);

const window = {};
global.window = window;
global.document = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => []
};

loadedScripts.forEach(s => {
  const code = fs.readFileSync(path.resolve(root, s), 'utf8');
  try {
    eval(code);
  } catch (e) {
    console.error('Error executing loaded script:', s, e.message);
  }
});

const missingFuncs = [];
calledFuncs.forEach(fn => {
  if (typeof global[fn] === 'undefined' && typeof window[fn] === 'undefined') {
    missingFuncs.push(fn);
  }
});
console.log('Missing/Undefined onclick functions:', missingFuncs);

console.log('\n=== 3. AUDITING IMAGES IN index.html ===');
const imgRegex = /src=["'](https?:\/\/[^"']+)["']/g;
const images = [];
while ((match = imgRegex.exec(indexHtml)) !== null) {
  images.push(match[1]);
}
console.log('Total external images in index.html:', images.length);

// Check if any placeholder or local image is missing
const localImgRegex = /src=["']((?!http|\/\/|data:)[^"']+)["']/g;
const localImages = [];
while ((match = localImgRegex.exec(indexHtml)) !== null) {
  const src = match[1];
  if (!src.endsWith('.js')) {
    localImages.push(src);
    const p = path.resolve(root, src);
    if (!fs.existsSync(p)) {
      console.log('Missing local image/asset:', src);
    }
  }
}
console.log('Total local image/asset references:', localImages.length);
