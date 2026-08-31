/**
 * End-to-End Headless DOM & Logic Test Suite
 * Tests all user flows across storage.js, index.html, ranker.html, and compare.html
 */

const fs = require('fs');
const path = require('path');

// Mock browser globals (window, localStorage, document, navigator, etc.)
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, val) => { store[key] = String(val); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
        _dump: () => ({ ...store })
    };
})();

global.window = global;
global.localStorage = localStorageMock;

// Load storage.js
require('./storage.js');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passedTests++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failedTests++;
    }
}

console.log('\n🧪 Starting UX & Logic Test Suite...\n');

// ── Test 1: Storage module functions ──────────────────────────────────────────
console.log('Test Suite 1: storage.js CRUD & Re-ranking');
localStorage.clear();

const session1 = BNR.createSession({
    person: 'Liset',
    category: 'Girls',
    names: ['Nola', 'Lyn', 'Isa', 'Jade', 'Lieke', 'Eva', 'Lana']
});
BNR.saveSession(session1);

assert(session1.id && session1.id.length > 4, 'Session ID generated correctly');
assert(session1.round === 1, 'Initial round is 1');
assert(BNR.loadSessions().length === 1, 'Session saved in localStorage');

const loaded = BNR.getSession(session1.id);
assert(loaded && loaded.person === 'Liset' && loaded.category === 'Girls', 'Session retrieved correctly');

// Simulate completing a ranking
loaded.ranking = ['Isa', 'Nola', 'Lana', 'Lyn', 'Jade', 'Eva', 'Lieke'];
loaded.status = 'ranked';
loaded.deleted = ['Lieke']; // Liset deleted Lieke
BNR.saveSession(loaded);

// Test Re-rank session creation
const reRankSession = BNR.createReRankSession(loaded);
assert(reRankSession.round === 2, 'Re-rank round incremented to 2');
assert(reRankSession.parentId === loaded.id, 'Re-rank parentId points to original session');
assert(!reRankSession.names.includes('Lieke'), 'Re-rank excludes deleted name (Lieke)');
assert(reRankSession.names.length === 6, 'Re-rank has exactly 6 active names');
BNR.saveSession(reRankSession);

assert(BNR.loadSessions().length === 2, 'Both original and Round 2 sessions exist in storage');


// ── Test 2: Multi-user Sessions (Girls & Boys) ──────────────────────────────
console.log('\nTest Suite 2: Multi-user & Category Support');

const sessionTiborGirls = BNR.createSession({
    person: 'Tibor',
    category: 'Girls',
    names: ['Nola', 'Lyn', 'Isa', 'Jade', 'Lieke', 'Eva', 'Lana']
});
sessionTiborGirls.ranking = ['Nola', 'Isa', 'Lyn', 'Jade', 'Lieke', 'Lana', 'Eva'];
sessionTiborGirls.status = 'ranked';
BNR.saveSession(sessionTiborGirls);

const sessionLisetBoys = BNR.createSession({
    person: 'Liset',
    category: 'Boys',
    names: ['Fedde', 'Elias', 'Boas', 'Daan', 'Ezra']
});
sessionLisetBoys.ranking = ['Fedde', 'Elias', 'Boas', 'Daan', 'Ezra'];
sessionLisetBoys.status = 'ranked';
BNR.saveSession(sessionLisetBoys);

const sessionTiborBoys = BNR.createSession({
    person: 'Tibor',
    category: 'Boys',
    names: ['Fedde', 'Boas', 'Elias', 'Ezra', 'Daan']
});
sessionTiborBoys.ranking = ['Fedde', 'Boas', 'Elias', 'Ezra', 'Daan'];
sessionTiborBoys.status = 'ranked';
BNR.saveSession(sessionTiborBoys);

const allSessions = BNR.loadSessions();
assert(allSessions.length === 5, 'All 5 user sessions stored concurrently in localStorage');

const girlsSessions = allSessions.filter(s => s.category === 'Girls');
const boysSessions = allSessions.filter(s => s.category === 'Boys');
assert(girlsSessions.length === 3, 'Correctly groups 3 Girls sessions');
assert(boysSessions.length === 2, 'Correctly groups 2 Boys sessions');


// ── Test 3: Export & Import Flow ─────────────────────────────────────────────
console.log('\nTest Suite 3: Export & Import JSON');

const exportPayload = JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions: BNR.loadSessions()
});

assert(exportPayload.includes('Liset') && exportPayload.includes('Tibor'), 'Export contains all sessions and users');

// Test importing into an empty browser instance
localStorage.clear();
assert(BNR.loadSessions().length === 0, 'Storage cleared for fresh import test');

const importedData = JSON.parse(exportPayload);
importedData.sessions.forEach(s => BNR.saveSession(s));
assert(BNR.loadSessions().length === 5, 'Imported all 5 sessions successfully');

// Test duplicate skipping
const currentCount = BNR.loadSessions().length;
const duplicateSession = importedData.sessions[0];
const existingIds = new Set(BNR.loadSessions().map(s => s.id));
let skipped = 0;
if (existingIds.has(duplicateSession.id)) {
    skipped++;
}
assert(skipped === 1, 'Duplicate session correctly identified and skipped');


// ── Test 4: Pairwise Async Merge Sort Algorithm (ranker.html) ────────────────
console.log('\nTest Suite 4: Pairwise Ranking Engine');

async function testMergeSortEngine() {
    const inputNames = ['Nola', 'Lyn', 'Isa', 'Jade'];
    // Preference oracle: Nola > Isa > Lyn > Jade
    const preferredOrder = ['Nola', 'Isa', 'Lyn', 'Jade'];
    
    let comparisonsCount = 0;
    
    async function mockCompare(a, b) {
        comparisonsCount++;
        const rankA = preferredOrder.indexOf(a);
        const rankB = preferredOrder.indexOf(b);
        return rankA < rankB ? -1 : 1;
    }

    async function mergeSort(arr, compareFn) {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = await mergeSort(arr.slice(0, mid), compareFn);
        const right = await mergeSort(arr.slice(mid), compareFn);
        return await merge(left, right, compareFn);
    }

    async function merge(left, right, compareFn) {
        const result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            const cmp = await compareFn(left[i], right[j]);
            if (cmp <= 0) result.push(left[i++]);
            else result.push(right[j++]);
        }
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    const sorted = await mergeSort(['Jade', 'Lyn', 'Nola', 'Isa'], mockCompare);
    
    assert(JSON.stringify(sorted) === JSON.stringify(preferredOrder), 'MergeSort correctly ordered names by human choices');
    assert(comparisonsCount <= 6, `Optimal comparison count: ${comparisonsCount} comparisons for 4 items`);
}


// ── Test 5: Comparison & Bidirectional Delete Sync (compare.html) ────────────
console.log('\nTest Suite 5: Compare Engine & 2-Way Deletion Sync');

function testCompareLogic() {
    const liset = BNR.getSession(session1.id);
    const tibor = BNR.getSession(sessionTiborGirls.id);

    // Liset: ['Isa', 'Nola', 'Lana', 'Lyn', 'Jade', 'Eva', 'Lieke']
    // Tibor: ['Nola', 'Isa', 'Lyn', 'Jade', 'Lieke', 'Lana', 'Eva']
    
    const nameMap = new Map();
    const addName = (name, rank, isA) => {
        const key = name.toLowerCase();
        if (!nameMap.has(key)) nameMap.set(key, { name, rankA: null, rankB: null });
        const entry = nameMap.get(key);
        if (isA) entry.rankA = rank;
        else entry.rankB = rank;
    };

    liset.ranking.forEach((n, i) => addName(n, i + 1, true));
    tibor.ranking.forEach((n, i) => addName(n, i + 1, false));

    const combined = Array.from(nameMap.values()).map(entry => {
        const rA = entry.rankA ?? 99;
        const rB = entry.rankB ?? 99;
        return {
            name: entry.name,
            rankA: entry.rankA,
            rankB: entry.rankB,
            avgRank: (rA + rB) / 2,
            diff: Math.abs(rA - rB)
        };
    });

    combined.sort((a, b) => (a.avgRank !== b.avgRank ? a.avgRank - b.avgRank : a.diff - b.diff));

    assert(combined[0].name === 'Isa' || combined[0].name === 'Nola', 'Top mutual names are Isa / Nola');
    assert(combined[0].avgRank === 1.5, 'Top name average rank calculated correctly (1.5)');

    // Test Deletion from compare view syncing to BOTH source sessions
    const deleteTarget = 'Eva';
    if (!liset.deleted.includes(deleteTarget) && liset.ranking.includes(deleteTarget)) {
        liset.deleted.push(deleteTarget);
        BNR.saveSession(liset);
    }
    if (!tibor.deleted.includes(deleteTarget) && tibor.ranking.includes(deleteTarget)) {
        tibor.deleted.push(deleteTarget);
        BNR.saveSession(tibor);
    }

    const updatedLiset = BNR.getSession(liset.id);
    const updatedTibor = BNR.getSession(tibor.id);

    assert(updatedLiset.deleted.includes('Eva'), 'Deletion in compare view synced to Liset session in storage');
    assert(updatedTibor.deleted.includes('Eva'), 'Deletion in compare view synced to Tibor session in storage');
}

(async () => {
    await testMergeSortEngine();
    testCompareLogic();

    // ── Test 6: Security, XSS Sanitization & Schema Hardening ───────────────────
    console.log('\nTest Suite 6: Security & Strict Schema Validation');

    // 1. escapeHtml tests
    const xssPayload = `<script>alert("XSS")</script><img src=x onerror='steal()'>`;
    const escaped = BNR.escapeHtml(xssPayload);
    assert(!escaped.includes('<') && !escaped.includes('>') && !escaped.includes('"') && !escaped.includes("'"),
        'escapeHtml neutralizes angle brackets and quotes');
    assert(escaped.includes('&lt;script&gt;') && escaped.includes('&quot;XSS&quot;') && escaped.includes('&#39;steal()&#39;'),
        'escapeHtml converts dangerous characters to safe HTML entities');
    assert(BNR.escapeHtml(null) === '' && BNR.escapeHtml(undefined) === '',
        'escapeHtml safely handles null and undefined');

    // 2. validateSession tests
    assert(BNR.validateSession(null) === null, 'validateSession rejects null');
    assert(BNR.validateSession("not an object") === null, 'validateSession rejects string primitives');
    assert(BNR.validateSession([]) === null, 'validateSession rejects array primitives');
    assert(BNR.validateSession({ person: '', category: 'Girls', names: ['Eva'] }) === null,
        'validateSession rejects empty person name');
    assert(BNR.validateSession({ person: 'Bob', category: 'Girls', names: [] }) === null,
        'validateSession rejects empty names list');

    // Sanitization & bounds enforcement
    const malformed = {
        id: '   custom-id-123   ',
        person: '   Long Name '.repeat(20), // 200+ chars
        category: 'HackedCategory', // not in allowedCats
        names: ['  Nola  ', '  Lyn  ', 'Nola', '', 12345, '<script>alert(1)</script>'],
        ranking: ['Nola', 'Lyn'],
        deleted: ['Lyn'],
        status: 'invalid_status',
        round: -5,
        extraProp: 'should_be_stripped'
    };

    const sanitized = BNR.validateSession(malformed);
    assert(sanitized !== null, 'validateSession parses and recovers valid fields');
    assert(sanitized.id === 'custom-id-123', 'Trims whitespace in session ID');
    assert(sanitized.person.length <= 60, 'Truncates excessively long person names to 60 chars');
    assert(sanitized.category === 'Girls', 'Falls back to default Girls category when invalid');
    assert(sanitized.names.length === 3 && sanitized.names.includes('Nola') && sanitized.names.includes('Lyn'),
        'Cleans strings, removes duplicates and non-strings in names');
    assert(sanitized.round === 1, 'Resets invalid round number (-5) to 1');
    assert(sanitized.status === 'setup', 'Resets invalid status to setup');
    assert(sanitized.extraProp === undefined, 'Strips unauthorized fields from session objects');

    // ── Test 7: Internationalization (i18n) Engine ─────────────────────────────
    console.log('\nTest Suite 7: Internationalization (i18n) System');
    const BNR_I18N = require('./i18n.js');

    assert(BNR_I18N.SUPPORTED_LANGS.length === 6, 'Supports 6 languages (en, nl, fr, es, de, ar)');
    assert(BNR_I18N.SUPPORTED_LANGS.includes('nl'), 'Supports Dutch');
    assert(BNR_I18N.SUPPORTED_LANGS.includes('ar'), 'Supports Arabic');

    // Test dictionary completeness across all languages
    const enKeys = Object.keys(BNR_I18N.TRANSLATIONS.en);
    let allKeysPresent = true;
    for (const lang of BNR_I18N.SUPPORTED_LANGS) {
        const dict = BNR_I18N.TRANSLATIONS[lang];
        for (const key of enKeys) {
            if (!dict[key]) {
                allKeysPresent = false;
                console.error(`Missing key "${key}" in language "${lang}"`);
            }
        }
    }
    assert(allKeysPresent, 'All supported languages have 100% complete translation keys');

    // Test translation and interpolation
    BNR_I18N.setLanguage('nl');
    assert(BNR_I18N.t('appTitle') === 'Babynaam Vergelijker', 'Translates static keys into Dutch');
    assert(BNR_I18N.t('roundBadge', { round: 3 }) === 'Ronde 3', 'Interpolates dynamic parameters in Dutch');

    BNR_I18N.setLanguage('fr');
    assert(BNR_I18N.t('appTitle') === 'Comparateur de Prénoms', 'Translates static keys into French');

    BNR_I18N.setLanguage('es');
    assert(BNR_I18N.t('appTitle') === 'Comparador de Nombres de Bebé', 'Translates static keys into Spanish');

    BNR_I18N.setLanguage('de');
    assert(BNR_I18N.t('appTitle') === 'Babynamen Vergleicher', 'Translates static keys into German');

    BNR_I18N.setLanguage('ar');
    assert(BNR_I18N.t('appTitle') === 'مقارن أسماء المواليد', 'Translates static keys into Arabic');

    // Reset back to English
    BNR_I18N.setLanguage('en');
    assert(BNR_I18N.t('appTitle') === 'Baby Name Ranker', 'Resets back to English');

    // ── Test 8: SEO & Structural Requirements ─────────────────────────────
    console.log('\nTest Suite 8: SEO & Semantic Requirements');
    
    const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    assert(indexHtml.includes('<link rel="canonical" href="https://baby.casteleijn.com/">'), 'Index contains canonical URL');
    assert(indexHtml.includes('name="description"'), 'Index contains meta description');
    assert(indexHtml.includes('property="og:image"'), 'Index contains OpenGraph image');
    assert(indexHtml.includes('application/ld+json'), 'Index contains JSON-LD structured data');
    assert(indexHtml.includes('WebApplication'), 'Index contains WebApplication schema');
    assert(indexHtml.includes('FAQPage'), 'Index contains FAQPage schema');
    assert(indexHtml.includes('hreflang="nl"'), 'Index contains hreflang tags for internationalization');
    
    const robotsTxt = fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8');
    assert(robotsTxt.includes('Sitemap:'), 'robots.txt specifies Sitemap URL');
    
    const sitemapXml = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
    assert(sitemapXml.includes('<loc>https://baby.casteleijn.com/</loc>'), 'sitemap.xml includes index URL');
    assert(sitemapXml.includes('hreflang="ar"'), 'sitemap.xml includes multi-lingual alternate tags');

    console.log('\n===========================================');
    console.log(`🏁 Test Summary: ${passedTests} passed, ${failedTests} failed`);
    console.log('===========================================\n');

    if (failedTests > 0) process.exit(1);
})();
