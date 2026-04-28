import { generate } from 'critical';

generate({
    inline: true,
    base: './',
    src: 'index.html',
    target: 'index-critical.html',
    width: 1300,
    height: 900
}).then(() => console.log('Critical CSS generated successfully')).catch(err => console.error(err));
