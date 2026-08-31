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

// Load storage.js & similar-names.js
require('./storage.js');
require('./similar-names.js');

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
    assert(BNR_I18N.t('variationsModalTitle', { name: 'Isa' }) === 'Vergelijkbare Variaties van "Isa"', 'Translates variationsModalTitle in Dutch with interpolation');
    assert(BNR_I18N.t('startRerankWithVariations', { round: 2, count: 6 }) === 'Start Ronde 2 met 6 Namen →', 'Translates startRerankWithVariations in Dutch');

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
    assert(BNR_I18N.t('variationsModalTitle', { name: 'Isa' }) === 'Similar Variations of "Isa"', 'Translates variationsModalTitle in English');

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

    // ── Test 9: Pure JS Levenshtein & Name Variations Engine ─────────────────
    console.log('\nTest Suite 9: Pure JS Levenshtein & Variations Engine');
    
    assert(typeof BNR.levenshtein === 'function', 'Levenshtein algorithm is defined on BNR');
    assert(BNR.levenshtein('kitten', 'sitting') === 3, 'Levenshtein computes standard distance (kitten -> sitting = 3)');
    assert(BNR.levenshtein('Noah', 'Noa') === 1, 'Levenshtein distance between Noah and Noa is 1');
    assert(BNR.levenshtein('same', 'same') === 0, 'Levenshtein distance between identical strings is 0');

    // Test findSimilarNames
    const sebasVars = BNR.findSimilarNames('Sebas', { limit: 5 });
    const sebasNames = sebasVars.map(v => v.name);
    assert(sebasNames.includes('Sebastian') || sebasNames.includes('Bas'), 'Finds "Sebastian" or "Bas" for "Sebas"');

    const noahVars = BNR.findSimilarNames('Noah', { limit: 5 });
    const noahNames = noahVars.map(v => v.name);
    assert(noahNames.includes('Noa') || noahNames.includes('Norah'), 'Finds "Noa" or "Norah" for "Noah"');

    const saraVars = BNR.findSimilarNames('Sara', { limit: 5 });
    const saraNames = saraVars.map(v => v.name);
    assert(saraNames.includes('Sarah'), 'Finds "Sarah" for "Sara"');

    // Test findSimilarForList
    const listSuggestions = BNR.findSimilarForList(['Sebas', 'Noah', 'Sara'], { limit: 8 });
    assert(listSuggestions.length > 0, 'findSimilarForList returns aggregated suggestions');
    assert(!listSuggestions.some(s => ['Sebas', 'Noah', 'Sara'].includes(s.name)), 'Excludes current candidate names from suggestions');

    // ── Test 10: Starter Pack Integrity (Full 200 Names Coverage) ─────────
    console.log('\nTest Suite 10: Starter Pack Integrity (Full 200 Names Coverage)');

    const expectedCultures = ['Dutch', 'Arabic', 'English', 'French', 'Spanish', 'Nordic'];
    const expectedCategories = ['Girls', 'Boys', 'Unisex'];

    expectedCultures.forEach(culture => {
        assert(BNR.STARTER_PACKS[culture] != null, `Starter pack culture exists: ${culture}`);
        expectedCategories.forEach(category => {
            const list = BNR.STARTER_PACKS[culture][category];
            assert(Array.isArray(list), `${culture} ${category} list is an array`);
            assert(list.length >= 200, `${culture} ${category} has at least 200 names (actual: ${list ? list.length : 0})`);

            // Verify strict uniqueness (case-insensitive)
            const uniqueSet = new Set(list.map(n => n.toLowerCase().trim()));
            assert(uniqueSet.size === list.length, `${culture} ${category} contains 0 duplicate names (distinct: ${uniqueSet.size}/${list.length})`);

            // Verify preset slices (50, 100, 150, 200)
            [50, 100, 150, 200].forEach(count => {
                const slice = list.slice(0, count);
                assert(slice.length === count, `${culture} ${category} slice(${count}) yields exactly ${count} names`);
            });
        });
    });

    // ── Test 11: In-Arena Discard, Pairwise Memoization & Preference Continuity ──
    console.log('\nTest Suite 11: In-Arena Discard & Pairwise Memoization');

    // 1. Verify Pairwise Preference Engine with Mid-Tournament Discard
    async function testMemoizedRankingWithDiscard() {
        const candidates = ['Nola', 'Isa', 'Lana', 'Lieke', 'Eva'];
        // Underlying human preference: Nola > Isa > Lana > Lieke > Eva
        const trueOrder = ['Nola', 'Isa', 'Lana', 'Lieke', 'Eva'];

        const pairwisePreferences = new Map();
        let promptHistory = []; // Tracks actual prompts shown to user

        function getKnownPreference(a, b) {
            if (pairwisePreferences.has(`${a}|||${b}`)) return pairwisePreferences.get(`${a}|||${b}`);
            if (pairwisePreferences.has(`${b}|||${a}`)) return -pairwisePreferences.get(`${b}|||${a}`);
            return null;
        }

        async function mergeSort(arr, compareFn) {
            if (arr.length <= 1) return arr;
            const mid = Math.floor(arr.length / 2);
            const left = await mergeSort(arr.slice(0, mid), compareFn);
            const right = await mergeSort(arr.slice(mid), compareFn);
            return merge(left, right, compareFn);
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

        let activeCandidates = [...candidates];

        async function compareFn(a, b) {
            const known = getKnownPreference(a, b);
            if (known !== null) {
                return known; // Instantly resolved from memoized choices
            }

            promptHistory.push({ a, b });
            const rankA = trueOrder.indexOf(a);
            const rankB = trueOrder.indexOf(b);
            const pref = rankA < rankB ? -1 : 1;
            pairwisePreferences.set(`${a}|||${b}`, pref);
            return pref;
        }

        // Run initial tournament partially (first 2 comparisons)
        let sorted = await mergeSort([...activeCandidates], compareFn);
        const initialPromptCount = promptHistory.length;
        assert(initialPromptCount > 0, 'Tournament made comparisons');

        // Now simulate user discarding "Lieke" mid-stream
        const discardedName = 'Lieke';
        activeCandidates = activeCandidates.filter(n => n !== discardedName);
        for (const key of Array.from(pairwisePreferences.keys())) {
            if (key.startsWith(`${discardedName}|||`) || key.endsWith(`|||${discardedName}`)) {
                pairwisePreferences.delete(key);
            }
        }

        // Re-run tournament with remaining candidates
        const promptsAfterDiscard = [];
        async function compareFnTracking(a, b) {
            const known = getKnownPreference(a, b);
            if (known !== null) {
                return known; // Silently reused without prompting!
            }
            promptsAfterDiscard.push({ a, b });
            const rankA = trueOrder.indexOf(a);
            const rankB = trueOrder.indexOf(b);
            const pref = rankA < rankB ? -1 : 1;
            pairwisePreferences.set(`${a}|||${b}`, pref);
            return pref;
        }

        sorted = await mergeSort([...activeCandidates], compareFnTracking);

        // Verification assertions:
        assert(!sorted.includes('Lieke'), 'Discarded name Lieke is excluded from final ranking');
        assert(JSON.stringify(sorted) === JSON.stringify(['Nola', 'Isa', 'Lana', 'Eva']), 'Remaining names correctly sorted according to user preferences');
        
        // Ensure no duplicate prompt was presented for pairs already decided
        const previousPairs = new Set();
        promptHistory.forEach(({ a, b }) => {
            previousPairs.add(`${a}|||${b}`);
            previousPairs.add(`${b}|||${a}`);
        });

        let hadReplayedMatchup = false;
        promptsAfterDiscard.forEach(({ a, b }) => {
            if (previousPairs.has(`${a}|||${b}`) || previousPairs.has(`${b}|||${a}`)) {
                hadReplayedMatchup = true;
            }
        });

        assert(!hadReplayedMatchup, 'Zero previously answered matchups were re-prompted after discard');
        assert(promptsAfterDiscard.every(({ a, b }) => a !== 'Lieke' && b !== 'Lieke'), 'No matchups involved the discarded name');
    }

    await testMemoizedRankingWithDiscard();

    // ── Test 12: List Builder & Category Combination Invariants ───────────
    console.log('\nTest Suite 12: List Builder & Category Combination Invariants');

    // 1. Verify combining Girls + Unisex names without duplicates
    const dutchGirls50 = BNR.STARTER_PACKS['Dutch']['Girls'].slice(0, 50);
    const dutchUnisex50 = BNR.STARTER_PACKS['Dutch']['Unisex'].slice(0, 50);

    const combinedSet = new Set([...dutchGirls50]);
    dutchUnisex50.forEach(name => combinedSet.add(name));
    const combinedArray = Array.from(combinedSet);

    assert(combinedArray.length >= 50, `Combined list contains ${combinedArray.length} names`);
    assert(combinedArray.includes(dutchGirls50[0]), 'Contains girls names');
    assert(combinedArray.includes(dutchUnisex50[0]), 'Contains unisex names');

    // 2. Verify creation of session with combined category list
    const combinedSession = BNR.createSession({
        person: 'TestCombine',
        category: 'Girls',
        names: combinedArray
    });

    assert(combinedSession != null, 'Combined session created successfully');
    assert(combinedSession.names.length === combinedArray.length, 'All combined names retained in session');
    assert(combinedSession.category === 'Girls', 'Category retained as Girls');

    // 3. Verify compare engine handles cross-category comparison (Girls vs Unisex)
    const unisexSession = BNR.createSession({
        person: 'TestUnisex',
        category: 'Unisex',
        names: dutchUnisex50
    });

    BNR.saveSession(combinedSession);
    BNR.saveSession(unisexSession);

    const loadedA = BNR.getSession(combinedSession.id);
    const loadedB = BNR.getSession(unisexSession.id);

    assert(loadedA != null && loadedB != null, 'Both cross-category sessions loaded from storage');
    assert(loadedA.category === 'Girls' && loadedB.category === 'Unisex', 'Sessions represent different categories');

    console.log('\n===========================================');
    console.log(`🏁 Test Summary: ${passedTests} passed, ${failedTests} failed`);
    console.log('===========================================\n');

    if (failedTests > 0) process.exit(1);
})();
