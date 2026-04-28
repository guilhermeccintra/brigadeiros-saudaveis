const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/class="recipe-img" width="500" height="500" loading="lazy"/g, 'class="recipe-img" width="500" height="500"');
fs.writeFileSync('index.html', html);
console.log('Lazy loading removed from recipes.');
