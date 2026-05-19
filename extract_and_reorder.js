const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const mainStart = content.indexOf('<main>') + '<main>'.length;
const mainEnd = content.indexOf('</main>');

const headerPart = content.substring(0, mainStart);
const footerPart = content.substring(mainEnd);
const mainPart = content.substring(mainStart, mainEnd);

const pattern = /(?:<!--[\s\S]*?-->\s*)*<section\b[^>]*>[\s\S]*?<\/section>/gi;
const sections = mainPart.match(pattern) || [];

const sectionMap = {};
for (const s of sections) {
    if (s.includes('Veja como são as <span class="highlight">receitas por dentro')) {
        sectionMap['A'] = s;
    } else if (s.includes('Ideal pra você que deseja')) {
        sectionMap['B'] = s;
    } else if (s.includes('Por que essas receitas são para você')) {
        sectionMap['C'] = s;
    } else if (s.includes('Sinta o sabor de um doce de verdade')) {
        sectionMap['D'] = s;
    } else if (s.includes('Olha o que você vai conseguir preparar')) {
        sectionMap['E'] = s;
    } else if (s.includes('class="bonus-section"')) {
        sectionMap['F'] = s;
    } else if (s.includes('Resultados de nossas <span class="highlight">alunas')) {
        sectionMap['G'] = s;
    } else if (s.includes('Risco Zero: <span class="highlight">Garantia de 7')) {
        sectionMap['H'] = s;
    } else if (s.includes('Seu Acesso Completo')) {
        sectionMap['I'] = s;
    } else if (s.includes('Perguntas Frequentes')) {
        sectionMap['J'] = s;
    } else {
        console.log("Unknown section!");
        console.log(s.substring(0, 100));
    }
}

console.log("Found sections:", Object.keys(sectionMap));

const newOrder = ['E', 'D', 'B', 'C', 'A', 'G', 'F', 'H', 'I', 'J'];
let newMain = "\n";

for (const key of newOrder) {
    if (sectionMap[key]) {
        newMain += sectionMap[key] + "\n";
    } else {
        console.log(`Missing section ${key}`);
    }
}

fs.writeFileSync('index.html', headerPart + newMain + footerPart, 'utf8');
console.log("Done");
