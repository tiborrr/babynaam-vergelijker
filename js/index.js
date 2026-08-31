// ── Language Switcher Mount ──────────────────────
    if (window.BNR_I18N) {
        document.getElementById('lang-switcher-mount').innerHTML = BNR_I18N.renderLanguageSwitcher();
    }

    // ── State ────────────────────────────────────────
    let selectedIds = new Set();
    let selectedCat = 'Girls';

    // ── Toast Helper ─────────────────────────────────
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

    // ── Clean URL Handling ──────────────────────────
    if (window.location.pathname.endsWith('/index.html')) {
        const cleanPath = window.location.pathname.replace(/\/index\.html$/, '/') + window.location.search + window.location.hash;
        window.history.replaceState(null, '', cleanPath);
    }

    // ── Dialog Helpers with Light-Dismiss ───────────
    const modalNew = document.getElementById('modal-new');
    const modalImport = document.getElementById('modal-import');
    const modalExport = document.getElementById('modal-export');

    function setupDialogBackdropDismiss(dialog) {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
            }
        });
    }

    [modalNew, modalImport, modalExport].forEach(setupDialogBackdropDismiss);

    // ── New Session Dialog & Interactive Candidate Deck ─────────────────
    let currentCandidates = [];
    let isBulkEditMode = false;

    function syncTextareaFromCandidates() {
        const ta = document.getElementById('input-names');
        if (ta) ta.value = currentCandidates.join('\n');
    }

    function syncCandidatesFromTextarea() {
        const ta = document.getElementById('input-names');
        if (!ta) return;
        const parsed = ta.value.split(/[\n,]+/).map(n => n.trim().slice(0, 60)).filter(Boolean);
        const unique = [];
        const seen = new Set();
        for (const name of parsed) {
            const lower = name.toLowerCase();
            if (!seen.has(lower)) {
                seen.add(lower);
                unique.push(name);
            }
        }
        currentCandidates = unique;
    }

    function updateNamesCount() {
        const count = currentCandidates.length;
        const countEl = document.getElementById('names-count');
        if (countEl) countEl.textContent = BNR_I18N.t('namesCount', { count });
    }

    function renderSuggestionsShelf() {
        const shelf = document.getElementById('suggestions-shelf');
        const chipsContainer = document.getElementById('suggestions-chips');
        if (!shelf || !chipsContainer || !window.BNR || typeof BNR.findSimilarForList !== 'function') return;

        if (currentCandidates.length === 0) {
            shelf.classList.add('hidden');
            return;
        }

        const variations = BNR.findSimilarForList(currentCandidates, { limit: 8, category: selectedCat });
        if (variations.length === 0) {
            shelf.classList.add('hidden');
            return;
        }

        chipsContainer.innerHTML = '';
        variations.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'inline-flex items-center gap-1 bg-white hover:bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 transition-all active:scale-95 shadow-xs';
            btn.innerHTML = `<span>+ ${BNR.escapeHtml(item.name)}</span>`;
            btn.title = `Inspired by ${item.basedOn}`;
            btn.addEventListener('click', () => {
                addCandidateNames([item.name]);
            });
            chipsContainer.appendChild(btn);
        });

        shelf.classList.remove('hidden');
    }

    function renderChipsDeck() {
        const container = document.getElementById('chips-deck-container');
        if (!container) return;

        syncTextareaFromCandidates();
        updateNamesCount();

        if (currentCandidates.length === 0) {
            container.innerHTML = `<p id="chips-empty-notice" class="text-xs text-stone-400 m-auto py-6 text-center select-none">${BNR_I18N.t('emptyNamesNotice')}</p>`;
            renderSuggestionsShelf();
            return;
        }

        container.innerHTML = '';
        currentCandidates.forEach((name, index) => {
            const chip = document.createElement('span');
            chip.className = 'inline-flex items-center gap-1 bg-white border border-stone-200/90 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-medium shadow-xs hover:border-stone-400 transition-all group';
            chip.innerHTML = `
                <span class="font-sans">${BNR.escapeHtml(name)}</span>
                <button type="button" data-index="${index}" class="text-stone-300 group-hover:text-stone-600 hover:text-rose-600 p-0.5 rounded-md transition-colors leading-none font-bold" title="Remove">&times;</button>
            `;

            chip.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                currentCandidates.splice(index, 1);
                renderChipsDeck();
            });

            container.appendChild(chip);
        });

        renderSuggestionsShelf();
    }

    function addCandidateNames(namesArray) {
        if (!Array.isArray(namesArray) || namesArray.length === 0) return;
        const seen = new Set(currentCandidates.map(n => n.toLowerCase()));
        let addedCount = 0;

        for (const raw of namesArray) {
            const trimmed = String(raw).trim().slice(0, 60);
            if (trimmed && !seen.has(trimmed.toLowerCase())) {
                seen.add(trimmed.toLowerCase());
                currentCandidates.push(trimmed);
                addedCount++;
            }
        }

        renderChipsDeck();
        return addedCount;
    }

    function openNewModal() {
        document.getElementById('input-person').value = '';
        currentCandidates = [];
        isBulkEditMode = false;
        document.getElementById('chips-deck-container')?.classList.remove('hidden');
        document.getElementById('quick-add-container')?.classList.remove('hidden');
        document.getElementById('input-names')?.classList.add('hidden');
        const bulkLabel = document.getElementById('bulk-toggle-label');
        if (bulkLabel) bulkLabel.textContent = BNR_I18N.t('bulkEdit');
        setCategory(selectedCat || 'Girls');
        renderChipsDeck();
        modalNew.showModal();
        document.getElementById('input-person').focus();
    }

    document.getElementById('new-session-btn').addEventListener('click', openNewModal);
    document.getElementById('hero-new-btn').addEventListener('click', openNewModal);
    document.getElementById('modal-close').addEventListener('click', () => modalNew.close());

    // Quick Add Input (Enter key or Add button)
    const quickInput = document.getElementById('input-quick-add');
    const quickAddBtn = document.getElementById('btn-quick-add');

    function handleQuickAdd() {
        if (!quickInput) return;
        const val = quickInput.value.trim();
        if (!val) return;

        const names = val.split(/[\n,]+/).map(n => n.trim()).filter(Boolean);
        addCandidateNames(names);
        quickInput.value = '';
        quickInput.focus();
    }

    if (quickInput) {
        quickInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleQuickAdd();
            }
        });
        quickInput.addEventListener('paste', () => {
            setTimeout(handleQuickAdd, 50);
        });
    }

    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', handleQuickAdd);
    }

    // Toggle Bulk Edit Mode
    const toggleBulkBtn = document.getElementById('toggle-bulk-mode');
    const bulkToggleLabel = document.getElementById('bulk-toggle-label');
    const chipsDeck = document.getElementById('chips-deck-container');
    const quickAddDeck = document.getElementById('quick-add-container');
    const namesTextarea = document.getElementById('input-names');

    if (toggleBulkBtn) {
        toggleBulkBtn.addEventListener('click', () => {
            isBulkEditMode = !isBulkEditMode;
            if (isBulkEditMode) {
                syncTextareaFromCandidates();
                chipsDeck?.classList.add('hidden');
                quickAddDeck?.classList.add('hidden');
                namesTextarea?.classList.remove('hidden');
                if (bulkToggleLabel) bulkToggleLabel.textContent = '✓ Done';
                namesTextarea?.focus();
            } else {
                syncCandidatesFromTextarea();
                namesTextarea?.classList.add('hidden');
                chipsDeck?.classList.remove('hidden');
                quickAddDeck?.classList.remove('hidden');
                if (bulkToggleLabel) bulkToggleLabel.textContent = BNR_I18N.t('bulkEdit');
                renderChipsDeck();
            }
        });
    }

    if (namesTextarea) {
        namesTextarea.addEventListener('input', () => {
            syncCandidatesFromTextarea();
            updateNamesCount();
        });
    }

    function setCategory(cat) {
        selectedCat = ['Girls', 'Boys', 'Unisex'].includes(cat) ? cat : 'Girls';
        document.querySelectorAll('.cat-btn').forEach(b => {
            const active = b.dataset.cat === selectedCat;
            if (active) {
                b.className = 'cat-btn border border-stone-900 bg-stone-900 text-stone-50 font-medium py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm';
            } else {
                b.className = 'cat-btn border border-stone-200 bg-white text-stone-600 font-medium py-2 rounded-xl text-xs sm:text-sm transition-all hover:bg-stone-50';
            }
        });

        const unisexContainer = document.getElementById('include-unisex-container');
        const unisexQuickBtn = document.getElementById('btn-add-unisex-quick');
        if (unisexContainer) {
            unisexContainer.classList.toggle('hidden', selectedCat === 'Unisex');
        }
        if (unisexQuickBtn) {
            unisexQuickBtn.classList.toggle('hidden', selectedCat === 'Unisex');
        }

        renderSuggestionsShelf();
    }

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setCategory(btn.dataset.cat);
        });
    });

    // Preset Count Selector (50, 100, 150, 200)
    let selectedPresetCount = 50;
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPresetCount = parseInt(btn.dataset.count, 10) || 50;
            document.querySelectorAll('.count-btn').forEach(b => {
                if (b === btn) {
                    b.className = 'count-btn px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all bg-white text-stone-900 shadow-sm';
                } else {
                    b.className = 'count-btn px-2 py-0.5 text-[11px] font-medium rounded-md transition-all text-stone-600 hover:text-stone-900';
                }
            });
        });
    });

    // Cultural Appenders
    document.querySelectorAll('.culture-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const culture = btn.dataset.culture;
            const fullPack = BNR.STARTER_PACKS[culture]?.[selectedCat] || [];
            const packList = fullPack.slice(0, selectedPresetCount);
            
            const includeUnisex = document.getElementById('toggle-include-unisex')?.checked;
            let namesToAdd = [...packList];

            if (includeUnisex && selectedCat !== 'Unisex') {
                const unisexPack = (BNR.STARTER_PACKS[culture]?.['Unisex'] || []).slice(0, selectedPresetCount);
                namesToAdd.push(...unisexPack);
            }
            
            addCandidateNames(namesToAdd);

            btn.classList.add('bg-stone-200', 'border-stone-400');
            setTimeout(() => btn.classList.remove('bg-stone-200', 'border-stone-400'), 150);
        });
    });

    // Quick Add Unisex Names Button
    const btnAddUnisexQuick = document.getElementById('btn-add-unisex-quick');
    if (btnAddUnisexQuick) {
        btnAddUnisexQuick.addEventListener('click', () => {
            const lang = (window.BNR_I18N && typeof BNR_I18N.getLanguage === 'function')
                ? BNR_I18N.getLanguage()
                : 'nl';
            const langToCulture = { nl: 'Dutch', ar: 'Arabic', en: 'English', fr: 'French', es: 'Spanish', de: 'Nordic' };
            const culture = langToCulture[lang] || 'Dutch';
            const unisexPack = (BNR.STARTER_PACKS[culture]?.['Unisex'] || []).slice(0, selectedPresetCount);
            addCandidateNames(unisexPack);

            btnAddUnisexQuick.classList.add('bg-stone-200');
            setTimeout(() => btnAddUnisexQuick.classList.remove('bg-stone-200'), 150);
        });
    }

    document.getElementById('pack-clear').addEventListener('click', () => {
        currentCandidates = [];
        renderChipsDeck();
    });

    document.getElementById('modal-sort-az').addEventListener('click', () => {
        currentCandidates.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        renderChipsDeck();
    });

    // Form Submit
    document.getElementById('form-new-session').addEventListener('submit', () => {
        if (isBulkEditMode) {
            syncCandidatesFromTextarea();
        }
        const person = document.getElementById('input-person').value.trim();
        const names = [...currentCandidates];

        if (!person) { toast(BNR_I18N.t('personRequiredAlert')); return; }
        if (names.length < 2) { toast(BNR_I18N.t('minNamesAlert')); return; }

        const session = BNR.createSession({ person, category: selectedCat, names });
        if (!session) { toast('Invalid session parameters.'); return; }
        BNR.saveSession(session);
        modalNew.close();
        window.location.href = `ranker.html?session=${encodeURIComponent(session.id)}`;
    });

    // ── Compare Bar ──────────────────────────────────
    function updateCompareBar() {
        const bar = document.getElementById('compare-bar');
        const label = document.getElementById('compare-bar-label');
        if (selectedIds.size === 2) {
            const sessions = BNR.loadSessions().filter(s => selectedIds.has(s.id));
            if (sessions.length === 2) {
                label.textContent = `${sessions[0].person} & ${sessions[1].person}`;
            } else {
                label.textContent = BNR_I18N.t('sessionsSelected', { count: selectedIds.size });
            }
            bar.classList.remove('hidden');
        } else {
            bar.classList.add('hidden');
        }
        document.querySelectorAll('.session-checkbox').forEach(cb => {
            cb.checked = selectedIds.has(cb.dataset.id);
        });
    }

    document.getElementById('compare-go-btn').addEventListener('click', () => {
        const [a, b] = [...selectedIds];
        window.location.href = `compare.html?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`;
    });

    document.getElementById('compare-clear-btn').addEventListener('click', () => {
        selectedIds.clear();
        updateCompareBar();
    });

    // ── Render Sessions ──────────────────────────────
    function formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString(BNR_I18N.getLanguage(), { month: 'short', day: 'numeric' });
    }

    function sessionLabel(s) {
        return s.person;
    }

    function activeCount(s) {
        return s.status === 'ranked'
            ? s.ranking.filter(n => !s.deleted.includes(n)).length
            : s.names.length;
    }

    function renderSessions() {
        const sessions = BNR.loadSessions();
        const list = document.getElementById('sessions-list');
        const heroSection = document.getElementById('hero-section');
        list.innerHTML = '';

        if (sessions.length === 0) {
            heroSection.classList.remove('hidden');
            return;
        }
        heroSection.classList.add('hidden');

        // Group by category
        const groups = {};
        sessions.forEach(s => {
            const cat = s.category || 'Girls';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(s);
        });

        const catOrder = ['Girls', 'Boys', 'Unisex'];
        const allCats = [...new Set([...catOrder, ...Object.keys(groups)])];

        allCats.forEach(cat => {
            if (!groups[cat] || groups[cat].length === 0) return;
            const catSessions = groups[cat];
            const catTranslated = BNR_I18N.t('cat' + cat);

            const section = document.createElement('section');
            section.className = 'mb-10';

            const header = document.createElement('div');
            header.className = 'flex items-center justify-between mb-3 px-0.5';
            header.innerHTML = `
                <h3 class="font-serif italic text-xl text-stone-900 tracking-tight">${BNR.escapeHtml(catTranslated)}</h3>
                <span class="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">${catSessions.length}</span>
            `;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 gap-3.5';

            catSessions.forEach(s => {
                const card = document.createElement('div');
                card.className = 'bg-white border border-stone-200/80 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:border-stone-300 transition-all relative';

                const isRanked = s.status === 'ranked';
                const active = activeCount(s);
                const deleted = isRanked ? s.deleted.length : 0;
                const topNames = isRanked ? s.ranking.filter(n => !s.deleted.includes(n)).slice(0, 5) : [];

                card.innerHTML = `
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-start sm:items-center gap-3 min-w-0">
                            <label class="relative flex items-center justify-center cursor-pointer mt-0.5 sm:mt-0 flex-shrink-0">
                                <input type="checkbox" class="session-checkbox w-4 h-4 accent-stone-900 cursor-pointer rounded border-stone-300" data-id="${BNR.escapeHtml(s.id)}" title="Select for comparison">
                            </label>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h4 class="font-serif text-lg font-medium text-stone-900">${BNR.escapeHtml(sessionLabel(s))}</h4>
                                    ${s.parentId ? `<span class="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">${BNR_I18N.t('roundBadge', { round: s.round })}</span>` : ''}
                                    <span class="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${isRanked ? 'bg-stone-100 text-stone-700' : 'bg-amber-50 text-amber-800 border border-amber-200/60'}">
                                        ${isRanked ? BNR_I18N.t('rankedStatus') : BNR_I18N.t('setupStatus')}
                                    </span>
                                </div>
                                <p class="text-xs text-stone-400 mt-0.5 font-normal">
                                    ${BNR_I18N.t('activeNamesCount', { count: active })}${deleted > 0 ? ` · ${deleted} ${BNR_I18N.t('removedNamesTitle').toLowerCase()}` : ''} · ${formatDate(s.updatedAt)}
                                </p>
                            </div>
                            <button data-action="delete" data-id="${BNR.escapeHtml(s.id)}" class="action-btn sm:hidden text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors flex-shrink-0 ml-auto" title="${BNR_I18N.t('delete')}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                        <div class="flex items-center gap-2 pt-2 sm:pt-0 border-t border-stone-100 sm:border-t-0 sm:flex-shrink-0">
                            ${isRanked ? `
                            <button data-action="rerank" data-id="${BNR.escapeHtml(s.id)}" class="action-btn flex-1 sm:flex-initial text-xs bg-stone-50 hover:bg-stone-100 text-stone-700 px-3.5 py-2 sm:py-1.5 rounded-lg font-medium transition-all active:scale-[0.98] border border-stone-200/80 text-center" title="${BNR_I18N.t('rerank')}">
                                ${BNR_I18N.t('rerank')}
                            </button>
                            ` : ''}
                            <button data-action="open" data-id="${BNR.escapeHtml(s.id)}" class="action-btn flex-1 sm:flex-initial text-xs bg-stone-900 hover:bg-stone-800 text-stone-50 px-4 py-2 sm:py-1.5 rounded-lg font-medium transition-all active:scale-[0.98] shadow-sm text-center">
                                ${isRanked ? BNR_I18N.t('viewResultsBtn') : BNR_I18N.t('continueBtn')}
                            </button>
                            <button data-action="delete" data-id="${BNR.escapeHtml(s.id)}" class="action-btn hidden sm:flex text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors" title="${BNR_I18N.t('delete')}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </div>
                    ${isRanked && topNames.length > 0 ? `
                    <div class="mt-3.5 pt-3 border-t border-stone-100 flex flex-col gap-1.5">
                        <div class="flex flex-wrap gap-1.5">
                            ${topNames.map((n, i) => `
                                <span class="text-xs px-2.5 py-0.5 rounded-md font-medium ${i === 0 ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 text-stone-700'}">
                                    ${i + 1}. ${BNR.escapeHtml(n)}
                                </span>
                            `).join('')}
                            ${active > 5 ? `<span class="text-xs text-stone-400 px-1 py-0.5 font-normal">+${active - 5}</span>` : ''}
                        </div>
                    </div>
                    ` : ''}
                `;

                grid.appendChild(card);
            });

            section.appendChild(grid);
            list.appendChild(section);
        });

        // Checkbox events
        document.querySelectorAll('.session-checkbox').forEach(cb => {
            cb.checked = selectedIds.has(cb.dataset.id);
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    if (selectedIds.size >= 2) {
                        cb.checked = false;
                        toast('Select 2 sessions to compare.');
                        return;
                    }
                    selectedIds.add(cb.dataset.id);
                } else {
                    selectedIds.delete(cb.dataset.id);
                }
                updateCompareBar();
            });
        });

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const { action, id } = btn.dataset;
                if (action === 'open') {
                    window.location.href = `ranker.html?session=${encodeURIComponent(id)}`;
                } else if (action === 'rerank') {
                    const parent = BNR.getSession(id);
                    if (!parent) return;
                    const active = parent.ranking.filter(n => !parent.deleted.includes(n));
                    if (active.length < 2) {
                        toast(BNR_I18N.t('minNamesAlert'));
                        return;
                    }
                    const child = BNR.createReRankSession(parent);
                    if (!child) return;
                    BNR.saveSession(child);
                    window.location.href = `ranker.html?session=${encodeURIComponent(child.id)}`;
                } else if (action === 'delete') {
                    if (!confirm(BNR_I18N.t('confirmDeleteSession'))) return;
                    BNR.deleteSession(id);
                    selectedIds.delete(id);
                    updateCompareBar();
                    renderSessions();
                    toast('Session removed.');
                }
            });
        });
    }

    function updateHeroDuelCards() {
        const elLeft = document.getElementById('hero-name-left');
        const elRight = document.getElementById('hero-name-right');
        if (!elLeft || !elRight || !window.BNR || !BNR.STARTER_PACKS) return;

        const lang = (window.BNR_I18N && typeof BNR_I18N.getLanguage === 'function')
            ? BNR_I18N.getLanguage()
            : 'nl';

        const langToCulture = {
            nl: 'Dutch',
            ar: 'Arabic',
            en: 'English',
            fr: 'French',
            es: 'Spanish',
            de: 'Nordic'
        };

        const culture = langToCulture[lang] || 'Dutch';
        // Pick at random either 'Girls' or 'Boys'
        const category = Math.random() < 0.5 ? 'Girls' : 'Boys';

        const pack = (BNR.STARTER_PACKS[culture] && BNR.STARTER_PACKS[culture][category])
            ? BNR.STARTER_PACKS[culture][category]
            : BNR.STARTER_PACKS['Dutch']['Girls'];

        const top5 = pack.slice(0, 5);
        if (top5.length < 2) return;

        const shuffled = [...top5].sort(() => Math.random() - 0.5);
        elLeft.textContent = shuffled[0];
        elRight.textContent = shuffled[1];
    }

    renderSessions();
    updateHeroDuelCards();

    // Listen for language changes to re-render dynamic content
    window.addEventListener('bnr:languagechange', () => {
        renderSessions();
        updateNamesCount();
        updateCompareBar();
        updateHeroDuelCards();
        const switcherMount = document.getElementById('lang-switcher-mount');
        if (switcherMount) {
            switcherMount.innerHTML = BNR_I18N.renderLanguageSwitcher();
        }
    });

    // ── Export Modal & Web Share ───────────────────────
    document.getElementById('export-btn').addEventListener('click', () => {
        const sessions = BNR.loadSessions();
        if (sessions.length === 0) { toast('No sessions to export yet.'); return; }
        modalExport.showModal();
    });

    document.getElementById('export-modal-close').addEventListener('click', () => modalExport.close());

    // Native Web Share API with Clipboard Fallback
    document.getElementById('export-native-share').addEventListener('click', async () => {
        const payload = JSON.stringify(BNR.createExportData(), null, 2);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: BNR_I18N.t('appTitle'),
                    text: payload
                });
                toast(BNR_I18N.t('copiedSuccess'));
                modalExport.close();
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        // Fallback to clipboard
        navigator.clipboard.writeText(payload).then(() => {
            toast(BNR_I18N.t('copiedSuccess'));
            modalExport.close();
        });
    });

    document.getElementById('export-copy-clipboard').addEventListener('click', () => {
        const payload = JSON.stringify(BNR.createExportData(), null, 2);
        navigator.clipboard.writeText(payload).then(() => {
            toast(BNR_I18N.t('copiedSuccess'));
            modalExport.close();
        });
    });

    document.getElementById('export-download-file').addEventListener('click', () => {
        const payload = JSON.stringify(BNR.createExportData(), null, 2);
        const blob = new Blob([payload], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `babynamer-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast(BNR_I18N.t('copiedSuccess'));
        modalExport.close();
    });

    // ── Import Modal Handling ─────────────────────────
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    document.getElementById('import-btn').addEventListener('click', () => {
        modalImport.showModal();
    });

    document.getElementById('import-modal-close').addEventListener('click', () => modalImport.close());
    document.getElementById('import-file-btn').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            processImport(e.target.result);
            fileInput.value = '';
        };
        reader.readAsText(file);
    });

    document.getElementById('paste-clipboard-btn').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('import-paste-area').value = text;
            toast('Pasted!');
        } catch {
            toast('Please paste manually.');
        }
    });

    document.getElementById('import-paste-btn').addEventListener('click', () => {
        const text = document.getElementById('import-paste-area').value.trim();
        if (!text) { toast('Paste your JSON code first.'); return; }
        processImport(text);
    });

    function processImport(jsonText) {
        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            toast(BNR_I18N.t('importError'));
            return;
        }

        const incoming = parsed.sessions ?? (Array.isArray(parsed) ? parsed : null);
        if (!incoming || !Array.isArray(incoming) || incoming.length === 0) {
            toast(BNR_I18N.t('importNoValid'));
            return;
        }

        const existing = BNR.loadSessions();
        const existingIds = new Set(existing.map(s => s.id));

        let added = 0, skipped = 0;
        incoming.forEach(s => {
            const valid = BNR.validateSession(s);
            if (!valid) { skipped++; return; }
            if (existingIds.has(valid.id)) { skipped++; return; }
            BNR.saveSession(valid);
            existingIds.add(valid.id);
            added++;
        });

        modalImport.close();
        document.getElementById('import-paste-area').value = '';
        renderSessions();
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (added > 0 && typeof confetti === 'function' && !prefersReducedMotion) {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
        }
        
        toast(BNR_I18N.t('importSuccess', { count: added }));
    }
