const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Meta Pixel script block completely
html = html.replace(/<!-- Meta Pixel Code -->[\s\S]*?<\/script>\s*/, '');
html = html.replace(/<noscript><\/noscript>/, '');

// 2. Fix fonts (remove media="print")
html = html.replace(
  '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&amp;family=Playfair+Display:ital,wght@0,600;0,700;1,600&amp;display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'">',
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&amp;family=Playfair+Display:ital,wght@0,600;0,700;1,600&amp;display=swap" rel="stylesheet">'
);

// 3. Preload mockup02.webp
const preloadLink = '<link rel="preload" as="image" href="assets/mockup02.webp">\n    ';
html = html.replace('</style>', '</style>\n    ' + preloadLink);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
