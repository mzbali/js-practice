const franc = require('franc');
const langs = require('langs');
const colors = require('colors');
const input = process.argv[2];

const langDetector = str => {
    const codeLang = franc(str);
    if (codeLang === 'und' || codeLang === 'sco') {
        return 'Could not match a language. Insert a larger sample then try again'.red;
    } else {
        const lang = langs.where('3', codeLang);
        return lang.name.green;
    }
}

console.log(langDetector(input));
