const fs = require('fs');

const pages = [
  'index.html',
  'pages/co-so-y-te.html',
  'pages/dich-vu.html',
  'pages/goi-kham.html',
  'pages/chuyen-khoa.html',
  'pages/tin-tuc.html'
];

pages.forEach(p => {
  const full = 'C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/' + p;
  const content = fs.readFileSync(full, 'utf8');
  console.log('=== ' + p + ' ===');
  
  // Scripts included
  const scriptTags = content.match(/<script[^>]*src="([^"]+)"/g) || [];
  console.log('Scripts:', scriptTags.map(s => s.replace(/<script[^>]*src="/, '').replace('"', '')).join(', '));
  
  // Modals present
  const modalIds = [];
  if (content.includes('id="publicBookingModal"')) modalIds.push('publicBookingModal');
  if (content.includes('id="specialtyKnowledgeModal"')) modalIds.push('specialtyKnowledgeModal');
  if (content.includes('id="articleReaderModal"')) modalIds.push('articleReaderModal');
  if (content.includes('id="hotlineModal"')) modalIds.push('hotlineModal');
  console.log('Static Modals in HTML:', modalIds.join(', '));

  // Any inline scripts
  const inlineScripts = content.match(/<script>([\s\S]*?)<\/script>/g) || [];
  console.log('Inline script tags count:', inlineScripts.length);
});
