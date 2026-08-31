const fs = require('fs');

const file = 'i18n.js';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
    en: {
        bentoMethodDesc: 'Names go head-to-head. Pick your favorite until your list is perfectly ordered.',
    },
    nl: {
        bentoMethodDesc: 'Namen nemen het tegen elkaar op. Kies je favoriet tot je lijst perfect is gesorteerd.',
    },
    fr: {
        bentoMethodDesc: 'Les prénoms s\'affrontent en duel. Choisissez votre préféré jusqu\'à ce que votre liste soit parfaite.',
    },
    es: {
        bentoMethodDesc: 'Los nombres se enfrentan cara a cara. Elige tu favorito hasta que tu lista esté perfecta.',
    },
    de: {
        bentoMethodDesc: 'Namen treten im direkten Duell an. Wähle deinen Favoriten, bis deine Liste perfekt ist.',
    },
    ar: {
        bentoMethodDesc: 'مقارنات ثنائية للأسماء. اختر المفضل لديك حتى تكتمل قائمتك بالترتيب المثالي.',
    }
};

let lines = content.split('\n');
let currentLang = '';
let newLines = [];

for (let line of lines) {
    let langMatch = line.match(/^\s+([a-z]{2}):\s*\{/);
    if (langMatch) {
        currentLang = langMatch[1];
    }
    
    if (currentLang && replacements[currentLang]) {
        for (const [key, val] of Object.entries(replacements[currentLang])) {
            let regex = new RegExp(`^(\\s+${key}:\\s*['"])(.*?)(['"],?)$`);
            if (regex.test(line)) {
                let safeVal = val.replace(/'/g, "\\'");
                line = line.replace(regex, `$1${safeVal}$3`);
                break;
            }
        }
    }
    newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
console.log('Bento texts modernized.');
