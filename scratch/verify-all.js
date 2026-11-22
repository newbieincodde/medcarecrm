const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm';

console.log('=== COMPREHENSIVE PROJECT VERIFICATION ===');

// 1. Verify HTML and inline scripts
const htmlFiles = [
  'index.html',
  'pages/chuyen-khoa.html',
  'pages/co-so-y-te.html',
  'pages/dich-vu.html',
  'pages/goi-kham.html',
  'pages/tin-tuc.html',
  'pages/login.html',
  'pages/register.html'
];

let errorsFound = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.error('MISSING FILE:', file);
    errorsFound++;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check script tags existence
  const scriptSrcs = content.match(/<script[^>]*src="([^"]+)"/g) || [];
  scriptSrcs.forEach(tag => {
    const src = tag.match(/src="([^"]+)"/)[1];
    const resolvedPath = path.resolve(path.dirname(filePath), src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`In ${file}: broken script src -> ${src}`);
      errorsFound++;
    }
  });

  // Check inline script syntax
  const inlineScripts = content.match(/<script>([\s\S]*?)<\/script>/g) || [];
  inlineScripts.forEach((s, idx) => {
    const code = s.replace(/<\/?script>/g, '');
    try {
      new Function(code);
    } catch (e) {
      console.error(`In ${file} (inline script #${idx+1}): SYNTAX ERROR -> ${e.message}`);
      errorsFound++;
    }
  });
});

console.log(`HTML & Scripts Verification: ${errorsFound === 0 ? 'ALL 100% OK' : errorsFound + ' ERRORS FOUND'}`);

// 2. Verify all JS files parse without syntax errors
const jsFiles = fs.readdirSync(path.join(rootDir, 'js')).filter(f => f.endsWith('.js'));
jsFiles.forEach(f => {
  const full = path.join(rootDir, 'js', f);
  const code = fs.readFileSync(full, 'utf8');
  try {
    new Function(code);
  } catch(e) {
    console.error(`In js/${f}: SYNTAX ERROR -> ${e.message}`);
    errorsFound++;
  }
});

console.log(`Total Errors after full audit: ${errorsFound}`);
