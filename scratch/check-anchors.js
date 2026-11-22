const fs = require('fs');
const html = fs.readFileSync('C:/Users/Home/.gemini/antigravity/scratch/medcare-crm/index.html', 'utf8');

// Find all href="#..."
const hashLinks = [];
const regex = /href="(#[a-zA-Z0-9_-]+)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
  hashLinks.push(m[1]);
}

console.log('All hash links in index.html:', hashLinks);

hashLinks.forEach(hash => {
  const id = hash.substring(1);
  const exists = html.includes(`id="${id}"`);
  console.log(`Hash ${hash} target exists in index.html?`, exists);
});
