/**
 * Automated Translation Linter & Integrity Validator
 * Prevents any deploy or build if any translation key is missing or untranslated
 * across ALL supported languages (en, nl, fr, es, de, ar).
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const i18n = require(path.join(rootDir, 'i18n.js'));

const SUPPORTED_LANGS = i18n.SUPPORTED_LANGS || ['en', 'nl', 'fr', 'es', 'de', 'ar'];
const TRANSLATIONS = i18n.TRANSLATIONS;

console.log('🔍 Starting Automated Translation Audit...\n');

// 1. Collect all keys defined in all languages
const allDefinedKeys = new Set();
for (const lang of SUPPORTED_LANGS) {
    const dict = TRANSLATIONS[lang] || {};
    for (const key of Object.keys(dict)) {
        allDefinedKeys.add(key);
    }
}

console.log(`Found ${allDefinedKeys.size} distinct translation keys defined in dictionary.`);

// 2. Scan HTML and JS files for used keys
const filesToScan = [
    'index.html',
    'ranker.html',
    'compare.html',
    'storage.js',
    'similar-names.js'
];

const referencedKeys = new Set();
const keyReferences = {}; // key -> [{ file, line }]

function addRef(key, file, line) {
    if (!key || key.includes('${') || key.startsWith('cat')) return; // skip dynamic expressions
    referencedKeys.add(key);
    if (!keyReferences[key]) keyReferences[key] = [];
    keyReferences[key].push({ file, line });
}

for (const file of filesToScan) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;

        // Matches data-i18n="keyName"
        const dataI18nMatches = line.matchAll(/data-i18n=["']([^"']+)["']/g);
        for (const match of dataI18nMatches) {
            addRef(match[1], file, lineNum);
        }

        // Matches BNR_I18N.t('keyName' ...)
        const tCallMatches = line.matchAll(/BNR_I18N\.t\(\s*['"]([a-zA-Z0-9_-]+)['"]/g);
        for (const match of tCallMatches) {
            addRef(match[1], file, lineNum);
        }
    });
}

console.log(`Scanned source files and found ${referencedKeys.size} translation references in use.`);

// 3. Check for completeness across every language
let errors = 0;
let warnings = 0;

console.log('\n--- 1. Checking Missing Translations in Source Code References ---');
for (const key of referencedKeys) {
    for (const lang of SUPPORTED_LANGS) {
        const val = TRANSLATIONS[lang]?.[key];
        if (typeof val !== 'string' || val.trim() === '') {
            const loc = keyReferences[key]?.[0] ? ` (${keyReferences[key][0].file}:${keyReferences[key][0].line})` : '';
            console.error(`❌ ERROR: Key "${key}" is MISSING or EMPTY in language "${lang}"! Used in: ${loc}`);
            errors++;
        }
    }
}

console.log('\n--- 2. Checking Cross-Language Dictionary Parity ---');
for (const key of allDefinedKeys) {
    for (const lang of SUPPORTED_LANGS) {
        const val = TRANSLATIONS[lang]?.[key];
        if (typeof val !== 'string' || val.trim() === '') {
            console.error(`❌ ERROR: Dictionary key "${key}" is missing in language "${lang}"!`);
            errors++;
        }
    }
}

// 4. Parameter Interpolation Consistency Check
console.log('\n--- 3. Checking Dynamic Parameter Consistency ({name}, {count}, etc.) ---');
for (const key of allDefinedKeys) {
    const enText = TRANSLATIONS.en?.[key];
    if (typeof enText !== 'string') continue;

    const enParams = (enText.match(/\{([a-zA-Z0-9_-]+)\}/g) || []).sort();
    if (enParams.length === 0) continue;

    for (const lang of SUPPORTED_LANGS) {
        const langText = TRANSLATIONS[lang]?.[key];
        if (typeof langText !== 'string') continue;

        const langParams = (langText.match(/\{([a-zA-Z0-9_-]+)\}/g) || []).sort();
        const enJoined = enParams.join(',');
        const langJoined = langParams.join(',');

        if (enJoined !== langJoined) {
            console.error(`❌ ERROR: Parameter mismatch in key "${key}" for language "${lang}"! Expected: [${enJoined}], Got: [${langJoined}]`);
            errors++;
        }
    }
}

console.log('\n===========================================');
if (errors === 0) {
    console.log(`✅ 100% TRANSLATION INTEGRITY VERIFIED! All ${allDefinedKeys.size} keys present across all ${SUPPORTED_LANGS.length} languages (${SUPPORTED_LANGS.join(', ')}).`);
    console.log('===========================================\n');
    process.exit(0);
} else {
    console.error(`🚨 TRANSLATION AUDIT FAILED: Found ${errors} missing or inconsistent translations!`);
    console.error('Build/Deploy blocked. Please fix all missing keys in i18n.js before proceeding.');
    console.log('===========================================\n');
    process.exit(1);
}
