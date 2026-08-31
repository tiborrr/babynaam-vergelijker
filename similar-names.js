/**
 * Baby Name Ranker — Pure JavaScript Name Similarity & Variation Engine
 * No external APIs. Runs 100% in-browser offline using Levenshtein distance,
 * prefix/suffix matching, and phonetic substring heuristics.
 */

(function(global) {
    'use strict';

    /**
     * Compute Levenshtein distance between two strings
     */
    function levenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;

        const al = a.length;
        const bl = b.length;
        const row = new Array(bl + 1);

        for (let j = 0; j <= bl; j++) row[j] = j;

        for (let i = 1; i <= al; i++) {
            let prev = i - 1;
            row[0] = i;
            const ca = a[i - 1];

            for (let j = 1; j <= bl; j++) {
                const temp = row[j];
                const cb = b[j - 1];
                if (ca === cb) {
                    row[j] = prev;
                } else {
                    const min = Math.min(row[j] + 1, row[j - 1] + 1, prev + 1);
                    row[j] = min;
                }
                prev = temp;
            }
        }
        return row[bl];
    }

    /**
     * Extract a flat array of unique candidate names from STARTER_PACKS.
     * Can optionally filter by category ('Girls', 'Boys', 'Unisex').
     */
    function getCandidatePool(category = null) {
        const pool = new Set();
        const packs = (typeof BNR !== 'undefined' && BNR.STARTER_PACKS)
            ? BNR.STARTER_PACKS
            : (typeof global.BNR !== 'undefined' && global.BNR.STARTER_PACKS ? global.BNR.STARTER_PACKS : null);

        if (!packs) return [];

        for (const cultureKey of Object.keys(packs)) {
            const culture = packs[cultureKey];
            if (!culture) continue;

            const categories = category && culture[category]
                ? [category, 'Unisex']
                : Object.keys(culture);

            for (const cat of categories) {
                const namesList = culture[cat];
                if (Array.isArray(namesList)) {
                    namesList.forEach(n => {
                        if (typeof n === 'string' && n.trim()) {
                            pool.add(n.trim());
                        }
                    });
                }
            }
        }
        return Array.from(pool);
    }

    /**
     * Calculate similarity score between two names (higher is better).
     * Score range: 0.0 to 1.0
     */
    function calculateSimilarity(query, target) {
        const q = query.toLowerCase().trim();
        const t = target.toLowerCase().trim();

        if (q === t) return 0; // Same exact name is not a "variation"

        // 1. Prefix / Extension match (e.g. Sebas -> Sebastiaan, Nora -> Norah, Sam -> Samuel)
        if (t.startsWith(q) || q.startsWith(t)) {
            const lenDiff = Math.abs(q.length - t.length);
            if (lenDiff <= 6) {
                return 0.95 - (lenDiff * 0.03); // 0.77 - 0.92
            }
        }

        // 2. Suffix match (e.g. Bas -> Sebas, Lotte -> Charlotte)
        if (t.endsWith(q) || q.endsWith(t)) {
            const lenDiff = Math.abs(q.length - t.length);
            if (lenDiff <= 4) {
                return 0.90 - (lenDiff * 0.04); // 0.74 - 0.86
            }
        }

        // 3. Levenshtein edit distance
        const dist = levenshtein(q, t);
        const maxLen = Math.max(q.length, t.length);
        const minLen = Math.min(q.length, t.length);

        if (dist === 1) {
            // Very close 1-character difference (e.g. Noah -> Nora, Isa -> Isla, Mila -> Mia, Sara -> Sarah)
            return minLen >= 4 ? 0.90 : 0.85;
        } else if (dist === 2) {
            // 2-character edit distance
            if (minLen >= 5) {
                return 0.78; // e.g. Sophie -> Sophia, Olivier -> Oliver
            } else if (minLen === 4) {
                return 0.70; // e.g. Nora -> Nola, Luna -> Lana
            }
        }

        // 4. Substring containment for names >= 4 chars (e.g. "Lieve" in "Genevieve")
        if (q.length >= 4 && t.includes(q)) {
            return 0.75;
        }
        if (t.length >= 4 && q.includes(t)) {
            return 0.75;
        }

        return 0;
    }

    /**
     * Find top similar variations for a single name.
     * @param {string} targetName - Name to find variations for (e.g. "Sebas", "Noah")
     * @param {Object} options - { limit: number, category: string, exclude: string[] }
     * @returns {Array<{name: string, score: number}>}
     */
    function findSimilarNames(targetName, options = {}) {
        if (!targetName || typeof targetName !== 'string') return [];

        const limit = options.limit || 8;
        const category = options.category || null;
        const exclude = new Set((options.exclude || []).map(n => n.toLowerCase().trim()));
        exclude.add(targetName.toLowerCase().trim());

        const pool = getCandidatePool(category);
        const results = [];

        for (const candidate of pool) {
            const candLower = candidate.toLowerCase().trim();
            if (exclude.has(candLower)) continue;

            const score = calculateSimilarity(targetName, candidate);
            if (score >= 0.5) {
                results.push({ name: candidate, score });
            }
        }

        results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
        return results.slice(0, limit);
    }

    /**
     * Find variations for a list of candidate names (e.g. for the whole textarea).
     * @param {string[]} namesList - List of current candidate names
     * @param {Object} options - { limit: number, category: string }
     * @returns {Array<{name: string, basedOn: string, score: number}>}
     */
    function findSimilarForList(namesList, options = {}) {
        if (!Array.isArray(namesList) || namesList.length === 0) return [];

        const limit = options.limit || 12;
        const category = options.category || null;
        const exclude = new Set(namesList.map(n => typeof n === 'string' ? n.toLowerCase().trim() : '').filter(Boolean));

        const suggestionsMap = new Map();

        for (const baseName of namesList) {
            if (!baseName || typeof baseName !== 'string') continue;
            const matches = findSimilarNames(baseName, { limit: 4, category, exclude: Array.from(exclude) });

            for (const match of matches) {
                if (!suggestionsMap.has(match.name) || suggestionsMap.get(match.name).score < match.score) {
                    suggestionsMap.set(match.name, {
                        name: match.name,
                        basedOn: baseName,
                        score: match.score
                    });
                }
            }
        }

        const sorted = Array.from(suggestionsMap.values());
        sorted.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
        return sorted.slice(0, limit);
    }

    // Attach to global BNR object or export
    const api = {
        levenshtein,
        findSimilarNames,
        findSimilarForList
    };

    if (typeof global.BNR !== 'undefined') {
        Object.assign(global.BNR, api);
    }
    global.BNR_SIMILAR = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

})(typeof window !== 'undefined' ? window : global);
