// ── Mount Language Switcher ───────────────────────────
    function mountLanguageSwitcher() {
        if (window.BNR_I18N) {
            const mount = document.getElementById('lang-switcher-compare');
            if (mount) mount.innerHTML = BNR_I18N.renderLanguageSwitcher();
        }
    }
    mountLanguageSwitcher();

    // ── State ─────────────────────────────────────────────
    let sessionA = null;
    let sessionB = null;
    let combined = [];
    let deletedNames = new Set();
    let currentSort = { column: 'overall', direction: 'asc' };
    let searchQuery = '';
    let currentFilter = 'all'; // 'all' | 'top' | 'exact'

    // ── Toast Helper ──────────────────────────────────────
    function toast(msg, duration = 2400) {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.classList.remove('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
        el.classList.add('opacity-100', 'translate-y-0');
        clearTimeout(el._timer);
        el._timer = setTimeout(() => {
            el.classList.add('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
            el.classList.remove('opacity-100', 'translate-y-0');
        }, duration);
    }

    // ── Session Picker Native Dialog ──────────────────────
    let pickerTarget = null;
    const modalPicker = document.getElementById('modal-picker');

    modalPicker.addEventListener('click', (e) => {
        const rect = modalPicker.getBoundingClientRect();
        const isInDialog = (
            rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            closePicker();
        }
    });

    document.getElementById('pick-a-btn').addEventListener('click', () => openPicker('a'));
    document.getElementById('pick-b-btn').addEventListener('click', () => openPicker('b'));
    document.getElementById('picker-close').addEventListener('click', closePicker);

    function openPicker(target) {
        pickerTarget = target;
        const sessions = BNR.loadSessions().filter(s => s.status === 'ranked');
        const list = document.getElementById('picker-list');
        list.innerHTML = '';

        if (sessions.length === 0) {
            list.innerHTML = `<p class="text-xs text-stone-400 text-center py-6">${BNR_I18N.t('noRankedSessions')}</p>`;
        } else {
            sessions.forEach(s => {
                const btn = document.createElement('button');
                btn.className = 'w-full text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl p-3 transition-all flex items-center justify-between gap-3';
                const active = s.ranking.filter(n => !s.deleted.includes(n)).length;
                const catTranslated = BNR_I18N.t('cat' + s.category);
                btn.innerHTML = `
                    <div>
                        <div class="font-serif font-medium text-stone-900 text-sm">${BNR.escapeHtml(s.person)} · ${BNR.escapeHtml(catTranslated)}${s.round > 1 ? ` · R${s.round}` : ''}</div>
                        <div class="text-xs text-stone-400 font-normal">${BNR_I18N.t('activeNamesCount', { count: active })}</div>
                    </div>
                    <span class="text-xs font-medium text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200">Select →</span>
                `;
                btn.addEventListener('click', () => {
                    selectSession(pickerTarget, s);
                    closePicker();
                });
                list.appendChild(btn);
            });
        }

        modalPicker.showModal();
    }

    function closePicker() {
        modalPicker.close();
    }

    function selectSession(target, session) {
        const catTranslated = BNR_I18N.t('cat' + session.category);
        if (target === 'a') {
            sessionA = session;
            const label = document.getElementById('pick-a-label');
            label.textContent = `${session.person} (${catTranslated}${session.round > 1 ? ` · R${session.round}` : ''})`;
            document.getElementById('pick-a-btn').classList.remove('border-dashed');
            document.getElementById('pick-a-btn').classList.add('border-stone-900', 'bg-stone-50/50');
            document.getElementById('col-a-label').textContent = session.person;
        } else {
            sessionB = session;
            const label = document.getElementById('pick-b-label');
            label.textContent = `${session.person} (${catTranslated}${session.round > 1 ? ` · R${session.round}` : ''})`;
            document.getElementById('pick-b-btn').classList.remove('border-dashed');
            document.getElementById('pick-b-btn').classList.add('border-stone-900', 'bg-stone-50/50');
            document.getElementById('col-b-label').textContent = session.person;
        }

        if (sessionA && sessionB) buildCombined();
    }

    // ── Data Merge & Consensus ───────────────────────────
    function buildCombined() {
        const nameMap = new Map();
        deletedNames = new Set([...sessionA.deleted, ...sessionB.deleted]);

        const addName = (name, rank, isA) => {
            const key = name.toLowerCase();
            if (!nameMap.has(key)) nameMap.set(key, { name, rankA: null, rankB: null });
            const entry = nameMap.get(key);
            if (isA) entry.rankA = rank;
            else entry.rankB = rank;
        };

        sessionA.ranking.forEach((n, i) => addName(n, i + 1, true));
        sessionB.ranking.forEach((n, i) => addName(n, i + 1, false));

        const maxRank = Math.max(sessionA.ranking.length, sessionB.ranking.length) + 1;

        combined = Array.from(nameMap.values()).map(entry => {
            const rA = entry.rankA ?? maxRank;
            const rB = entry.rankB ?? maxRank;
            return {
                name: entry.name,
                rankA: entry.rankA,
                rankB: entry.rankB,
                avgRank: (rA + rB) / 2,
                diff: Math.abs(rA - rB),
            };
        });

        currentSort = { column: 'overall', direction: 'asc' };
        searchQuery = '';
        currentFilter = 'all';
        document.getElementById('search-input').value = '';

        document.getElementById('placeholder').classList.add('hidden');
        document.getElementById('match-banner').classList.remove('hidden');
        document.getElementById('controls').classList.remove('hidden');
        document.getElementById('table-wrap').classList.remove('hidden');

        updateMatchBanner();
        renderTable();

        if (combined.length > 0) {
            setTimeout(fireCelebrationConfetti, 250);
        }
    }

        function fireCelebrationConfetti() {
        if (typeof confetti !== 'function') return;

        // Left cannon
        confetti({
            particleCount: 65,
            angle: 60,
            spread: 75,
            origin: { x: 0, y: 0.8 },
            zIndex: 9999
        });

        // Right cannon
        confetti({
            particleCount: 65,
            angle: 120,
            spread: 75,
            origin: { x: 1, y: 0.8 },
            zIndex: 9999
        });

        // High center burst
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 110,
                origin: { x: 0.5, y: 0.45 },
                zIndex: 9999
            });
        }, 160);
    }

    function updateMatchBanner() {
        const active = getSortedActive();
        if (active.length > 0) {
            const topMatch = active[0];
            document.getElementById('top-match-name').textContent = topMatch.name;
            const rA = topMatch.rankA != null ? `#${topMatch.rankA}` : '-';
            const rB = topMatch.rankB != null ? `#${topMatch.rankB}` : '-';
            document.getElementById('match-banner-desc').textContent =
                `${sessionA.person}: ${rA} · ${sessionB.person}: ${rB} · Avg #${topMatch.avgRank}`;
        }
    }

    document.getElementById('match-banner').addEventListener('click', () => {
        fireCelebrationConfetti();
    });

    // ── Filter & Sort ─────────────────────────────────────
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sort;
            if (currentSort.column === key) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = key;
                currentSort.direction = 'asc';
            }
            renderTable();
        });
    });

    document.getElementById('search-input').addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTable();
    });

    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(b => {
                b.className = 'filter-tab px-3 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all font-medium';
            });
            btn.className = 'filter-tab px-3 py-1 rounded-lg bg-stone-900 text-stone-50 font-medium transition-all';

            if (btn.id === 'filter-top') currentFilter = 'top';
            else if (btn.id === 'filter-exact') currentFilter = 'exact';
            else currentFilter = 'all';

            renderTable();
        });
    });

    function getSortedActive() {
        let list = combined.filter(item => !deletedNames.has(item.name));
        if (searchQuery) list = list.filter(item => item.name.toLowerCase().includes(searchQuery));

        if (currentFilter === 'exact') {
            list = list.filter(item => item.diff === 0 && item.rankA != null && item.rankB != null);
        }

        list.sort((a, b) => {
            let cmp = 0;
            if (currentSort.column === 'overall') {
                cmp = a.avgRank !== b.avgRank ? a.avgRank - b.avgRank : a.diff - b.diff;
            } else if (currentSort.column === 'name') {
                cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            } else if (currentSort.column === 'rankA') {
                cmp = (a.rankA ?? 999) - (b.rankA ?? 999);
            } else if (currentSort.column === 'rankB') {
                cmp = (a.rankB ?? 999) - (b.rankB ?? 999);
            } else if (currentSort.column === 'diff') {
                cmp = a.diff - b.diff;
            }
            return currentSort.direction === 'asc' ? cmp : -cmp;
        });

        if (currentFilter === 'top') {
            list = list.slice(0, 5);
        }

        return list;
    }

    function updateSortIndicators() {
        ['overall', 'name', 'rankA', 'rankB', 'diff'].forEach(col => {
            const el = document.getElementById(`si-${col}`);
            if (!el) return;
            if (currentSort.column === col) {
                el.textContent = currentSort.direction === 'asc' ? '▲' : '▼';
                el.className = 'text-stone-900 font-bold';
            } else {
                el.textContent = '↕';
                el.className = 'text-stone-300';
            }
        });
    }

    // ── Delete / Restore (2-Way Sync) ─────────────────────
    function deleteName(name) {
        deletedNames.add(name);

        if (sessionA && !sessionA.deleted.includes(name) && sessionA.ranking.includes(name)) {
            sessionA.deleted.push(name);
            BNR.saveSession(sessionA);
        }
        if (sessionB && !sessionB.deleted.includes(name) && sessionB.ranking.includes(name)) {
            sessionB.deleted.push(name);
            BNR.saveSession(sessionB);
        }

        updateMatchBanner();
        renderTable();
        toast(`Removed "${name}"`);
    }

    function restoreName(name) {
        deletedNames.delete(name);

        if (sessionA) { sessionA.deleted = sessionA.deleted.filter(n => n !== name); BNR.saveSession(sessionA); }
        if (sessionB) { sessionB.deleted = sessionB.deleted.filter(n => n !== name); BNR.saveSession(sessionB); }

        updateMatchBanner();
        renderTable();
        toast(`Restored "${name}"`);
    }

    document.getElementById('restore-all-btn').addEventListener('click', () => {
        deletedNames.clear();
        if (sessionA) { sessionA.deleted = []; BNR.saveSession(sessionA); }
        if (sessionB) { sessionB.deleted = []; BNR.saveSession(sessionB); }
        updateMatchBanner();
        renderTable();
        toast(BNR_I18N.t('restoreAll'));
    });

    // Event delegation for table action buttons and deleted chips
    document.getElementById('results-tbody').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="delete"]');
        if (btn && btn.dataset.name) {
            deleteName(btn.dataset.name);
        }
    });

    document.getElementById('deleted-chips').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="restore"]');
        if (btn && btn.dataset.name) {
            restoreName(btn.dataset.name);
        }
    });

    // ── Copy / Share Summary ─────────────────────────────
    document.getElementById('copy-btn').addEventListener('click', async () => {
        const items = getSortedActive();
        if (!items.length) { toast(BNR_I18N.t('noMutualNames')); return; }
        const personA = sessionA ? sessionA.person : 'Partner 1';
        const personB = sessionB ? sessionB.person : 'Partner 2';
        
        const header = `✦ ${personA} & ${personB} — ${BNR_I18N.t('consensusTitle')}:\n`;
        const text = header + items.map((item, idx) =>
            `${idx + 1}. ${item.name} (${personA}: #${item.rankA ?? '-'}, ${personB}: #${item.rankB ?? '-'})`
        ).join('\n');
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${personA} & ${personB} — ${BNR_I18N.t('consensusTitle')}`,
                    text: text
                });
                toast(BNR_I18N.t('copiedSuccess'));
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        navigator.clipboard.writeText(text).then(() => toast(BNR_I18N.t('copiedSuccess')));
    });

    // ── Render Table ──────────────────────────────────────
    function renderTable() {
        updateSortIndicators();
        const items = getSortedActive();

        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-stone-400 font-normal">${BNR_I18N.t('noMutualNames')}</td></tr>`;
        } else {
            items.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-stone-50/70 transition-colors';

                const rankAStr = item.rankA != null ? `<span class="font-mono text-xs text-stone-700 font-medium">#${item.rankA}</span>` : `<span class="text-stone-300 font-mono text-xs">—</span>`;
                const rankBStr = item.rankB != null ? `<span class="font-mono text-xs text-stone-700 font-medium">#${item.rankB}</span>` : `<span class="text-stone-300 font-mono text-xs">—</span>`;

                let diffHtml;
                if (item.rankA != null && item.rankB != null) {
                    if (item.diff === 0) {
                        diffHtml = `<span class="bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 w-max">★ ${BNR_I18N.t('statusExactMatch')}</span>`;
                    } else if (item.diff <= 2) {
                        diffHtml = `<span class="bg-emerald-50/70 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 w-max">♥ Δ ${item.diff} ${BNR_I18N.t('statusGreatMatch')}</span>`;
                    } else if (item.diff <= 5) {
                        diffHtml = `<span class="bg-stone-100 text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-max">Δ ${item.diff} ${BNR_I18N.t('statusModerateAgree')}</span>`;
                    } else {
                        diffHtml = `<span class="bg-stone-50 text-stone-500 text-[10px] font-mono px-2 py-0.5 rounded-md">Δ ${item.diff}</span>`;
                    }
                } else {
                    diffHtml = `<span class="text-stone-400 text-xs">—</span>`;
                }

                const rankNumber = String(index + 1).padStart(2, '0');
                const isTop3 = currentSort.column === 'overall' && currentSort.direction === 'asc' && !searchQuery && currentFilter === 'all' && index < 3;
                const rankBadge = isTop3
                    ? `<span class="w-6 h-6 rounded-md bg-stone-900 text-stone-50 flex items-center justify-center font-mono text-[10px] font-semibold">${rankNumber}</span>`
                    : `<span class="font-mono text-xs text-stone-400 ml-1">${rankNumber}</span>`;

                const escapedName = BNR.escapeHtml(item.name);

                tr.innerHTML = `
                    <td class="p-3.5 align-middle">${rankBadge}</td>
                    <td class="p-3.5 font-serif text-base text-stone-900">${escapedName}</td>
                    <td class="p-3.5">${rankAStr}</td>
                    <td class="p-3.5">${rankBStr}</td>
                    <td class="p-3.5">${diffHtml}</td>
                    <td class="p-3.5 text-right pr-4">
                        <button data-action="delete" data-name="${escapedName}" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors" title="${BNR_I18N.t('delete')} ${escapedName}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Deleted bin
        const deletedSection = document.getElementById('deleted-section');
        const deletedChips = document.getElementById('deleted-chips');
        const delCount = document.getElementById('del-count');

        if (deletedNames.size > 0) {
            deletedSection.classList.remove('hidden');
            delCount.textContent = `(${deletedNames.size})`;
            deletedChips.innerHTML = '';
            deletedNames.forEach(name => {
                const escapedName = BNR.escapeHtml(name);
                const chip = document.createElement('div');
                chip.className = 'inline-flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm';
                chip.innerHTML = `
                    <span class="line-through text-stone-400 font-serif">${escapedName}</span>
                    <button data-action="restore" data-name="${escapedName}" class="text-stone-700 hover:text-stone-900 ml-1 font-sans text-[11px] underline">${BNR_I18N.t('restore')}</button>
                `;
                deletedChips.appendChild(chip);
            });
        } else {
            deletedSection.classList.add('hidden');
        }
    }

    window.addEventListener('bnr:languagechange', () => {
        mountLanguageSwitcher();
        if (sessionA) selectSession('a', sessionA);
        if (sessionB) selectSession('b', sessionB);
        if (sessionA && sessionB) renderTable();
    });

    // ── Auto-load from URL params ─────────────────────────
    (function autoLoad() {
        const params = new URLSearchParams(location.search);
        const idA = params.get('a');
        const idB = params.get('b');
        if (idA) {
            const s = BNR.getSession(idA);
            if (s && s.status === 'ranked') selectSession('a', s);
        }
        if (idB) {
            const s = BNR.getSession(idB);
            if (s && s.status === 'ranked') selectSession('b', s);
        }
    })();
