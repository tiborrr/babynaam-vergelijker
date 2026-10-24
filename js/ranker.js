// ── Mount Language Switchers ───────────────────────────
    function mountLanguageSwitchers() {
        if (window.BNR_I18N) {
            const html = BNR_I18N.renderLanguageSwitcher();
            const r = document.getElementById('lang-switcher-ranker');
            const res = document.getElementById('lang-switcher-results');
            if (r) r.innerHTML = html;
            if (res) res.innerHTML = html;
        }
    }
    mountLanguageSwitchers();

    // ── Bootstrap ─────────────────────────────────────────
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session');

    let session = sessionId ? BNR.getSession(sessionId) : null;
    let pendingAdditions = [];

    if (!session) {
        document.getElementById('error-state').classList.remove('hidden');
        throw new Error('Session not found: ' + sessionId);
    }

    function updateHeaderLabels() {
        const catTranslated = BNR_I18N.t('cat' + session.category);
        const roundText = session.round > 1 ? ` · ${BNR_I18N.t('roundBadge', { round: session.round })}` : '';
        const badge = document.getElementById('session-badge');
        badge.textContent = `${session.person} · ${catTranslated}${roundText}`;

        
    }

    updateHeaderLabels();

    window.addEventListener('bnr:languagechange', () => {
        updateHeaderLabels();
        mountLanguageSwitchers();
        if (session.status === 'ranked') {
            renderResults();
        }
    });

    // ── Toast helper ──────────────────────────────────────
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

    // ── Bracket Knockout Tournament Controller ───────────
    let tournament = null;
    let isTransitioning = false;

    function clearDuelSelectionState() {
        const btnA = document.getElementById('btn-a');
        const btnB = document.getElementById('btn-b');
        if (btnA) btnA.classList.remove('is-selected', 'is-dimmed', 'is-discarded');
        if (btnB) btnB.classList.remove('is-selected', 'is-dimmed', 'is-discarded');
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    }

    function renderCurrentMatch() {
        clearDuelSelectionState();
        if (!tournament || tournament.phase === 'finished') {
            finishTournament();
            return;
        }

        const match = tournament.getCurrentMatch();
        if (!match) {
            finishTournament();
            return;
        }

        const [a, b] = match;
        const btnAName = document.getElementById('btn-a-name');
        const btnBName = document.getElementById('btn-b-name');
        const tournamentBadge = document.getElementById('tournament-badge');
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const undoBtn = document.getElementById('undo-btn');

        btnAName.textContent = a;
        btnBName.textContent = b;

        // Dynamic round badge styling
        if (tournamentBadge) {
            if (tournament.phase === 'grand_final' || tournament.phase === 'reset_final' || tournament.phase === 'final') {
                tournamentBadge.textContent = BNR_I18N.t('grandFinal');
                tournamentBadge.className = 'text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md shadow-xs animate-pulse';
            } else if (tournament.phase === 'losers') {
                tournamentBadge.textContent = BNR_I18N.t('losersRound');
                tournamentBadge.className = 'text-[10px] font-bold uppercase tracking-widest text-indigo-900 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-md shadow-xs';
            } else if (tournament.activeCandidates.length === 4) {
                tournamentBadge.textContent = BNR_I18N.t('semifinals');
                tournamentBadge.className = 'text-[10px] font-bold uppercase tracking-widest text-stone-800 bg-stone-200 px-2.5 py-0.5 rounded-md shadow-xs';
            } else if (tournament.activeCandidates.length === 8) {
                tournamentBadge.textContent = BNR_I18N.t('quarterfinals');
                tournamentBadge.className = 'text-[10px] font-semibold uppercase tracking-widest text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded-md shadow-xs';
            } else {
                tournamentBadge.textContent = BNR_I18N.t('roundOfCount', {
                    round: tournament.roundIndex,
                    count: tournament.activeCandidates.length
                });
                tournamentBadge.className = 'text-[10px] font-bold uppercase tracking-widest text-stone-700 bg-stone-200/90 px-2.5 py-0.5 rounded-md shadow-xs';
            }
        }

        // Progress text and bar
        const currentMatchNum = tournament.currentMatchIndex + 1;
        const roundTotal = tournament.currentMatches.length;
        const totalCompleted = tournament.totalMatchesCompleted;
        const totalEstimated = tournament.estimatedTotalMatches;
        const pct = Math.min(100, Math.round((totalCompleted / Math.max(totalEstimated, 1)) * 100));

        progressText.textContent = BNR_I18N.t('tournamentProgress', {
            current: currentMatchNum,
            roundTotal: roundTotal,
            totalCompleted: totalCompleted,
            totalEstimated: totalEstimated
        }) + ` (${pct}%)`;
        progressBar.style.width = `${pct}%`;

        // Undo button
        if (tournament.undoStack.length > 0) {
            undoBtn.classList.remove('hidden');
        } else {
            undoBtn.classList.add('hidden');
        }
    }

    function finishTournament() {
        if (!tournament) return;
        const finalRankings = tournament.getFinalRanking();
        session.ranking = finalRankings;
        session.deleted = [...new Set([...(session.deleted || []), ...tournament.deleted])];
        session.status = 'ranked';
        BNR.saveSession(session);

        document.getElementById('comparison-state').classList.add('hidden');
        showResults(true);

        const champ = finalRankings[0];
        if (champ) {
            toast(BNR_I18N.t('winnerAnnounce', { name: champ }), 5000);
        }
    }

    function handleChoice(preference) {
        if (!tournament || tournament.phase === 'finished' || isTransitioning) return;

        const btnA = document.getElementById('btn-a');
        const btnB = document.getElementById('btn-b');
        const arenaContainer = document.getElementById('arena-cards-container');

        // Immediately blur any active element so the browser focus ring/rectangle disappears
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            const prevRound = tournament.roundIndex;
            tournament.choose(preference);
            clearDuelSelectionState();
            if (tournament.phase === 'finished') {
                finishTournament();
                return;
            }
            if (tournament.roundIndex > prevRound) {
                toast(BNR_I18N.t('roundMilestone', {
                    round: prevRound,
                    count: tournament.activeCandidates.length
                }));
            }
            renderCurrentMatch();
            return;
        }

        isTransitioning = true;
        const chosenBtn = preference === -1 ? btnA : btnB;
        const otherBtn = preference === -1 ? btnB : btnA;

        // Visual tactile confirmation
        if (chosenBtn) chosenBtn.classList.add('is-selected');
        if (otherBtn) otherBtn.classList.add('is-dimmed');

        setTimeout(() => {
            clearDuelSelectionState();

            const prevRound = tournament.roundIndex;
            tournament.choose(preference);

            if (tournament.phase === 'finished') {
                isTransitioning = false;
                finishTournament();
                return;
            }

            if (tournament.roundIndex > prevRound) {
                toast(BNR_I18N.t('roundMilestone', {
                    round: prevRound,
                    count: tournament.activeCandidates.length
                }));
            }

            renderCurrentMatch();

            // Smooth entrance animation for new pair of names
            if (arenaContainer) {
                arenaContainer.classList.remove('arena-refresh');
                void arenaContainer.offsetWidth; // trigger reflow
                arenaContainer.classList.add('arena-refresh');
                setTimeout(() => {
                    arenaContainer.classList.remove('arena-refresh');
                }, 180);
            }

            isTransitioning = false;
        }, 120);
    }

    document.getElementById('btn-a').addEventListener('click', () => handleChoice(-1));
    document.getElementById('btn-b').addEventListener('click', () => handleChoice(1));

    document.addEventListener('keydown', (e) => {
        if (document.getElementById('comparison-state').classList.contains('hidden') || !tournament) return;
        if (['ArrowLeft', 'ArrowUp', '1'].includes(e.key)) handleChoice(-1);
        if (['ArrowRight', 'ArrowDown', '2'].includes(e.key)) handleChoice(1);
        if (['3', 'x', 'X'].includes(e.key)) {
            handleDiscard(2);
        }
        if (e.code === 'Space') {
            e.preventDefault();
            handleUndo();
        }
    });

    function handleDiscard(choiceIndex) {
        if (!tournament || isTransitioning) return;
        const match = tournament.getCurrentMatch();
        if (!match) return;

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        const btnA = document.getElementById('btn-a');
        const btnB = document.getElementById('btn-b');
        const arenaContainer = document.getElementById('arena-cards-container');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const applyDiscardData = () => {
            if (choiceIndex === 0) {
                const discarded = match[0];
                tournament.discard(discarded);
                toast(BNR_I18N.t('nameDiscardedToast', { name: discarded }));
            } else if (choiceIndex === 1) {
                const discarded = match[1];
                tournament.discard(discarded);
                toast(BNR_I18N.t('nameDiscardedToast', { name: discarded }));
            } else {
                const d1 = match[0], d2 = match[1];
                tournament.discardBoth();
                toast(BNR_I18N.t('discardBothToast', { name1: d1, name2: d2 }));
            }

            clearDuelSelectionState();
            renderCurrentMatch();

            if (arenaContainer && !prefersReducedMotion) {
                arenaContainer.classList.remove('arena-refresh');
                void arenaContainer.offsetWidth;
                arenaContainer.classList.add('arena-refresh');
                setTimeout(() => arenaContainer.classList.remove('arena-refresh'), 180);
            }

            isTransitioning = false;
        };

        if (prefersReducedMotion) {
            applyDiscardData();
            return;
        }

        isTransitioning = true;
        if (choiceIndex === 0 && btnA) btnA.classList.add('is-discarded');
        else if (choiceIndex === 1 && btnB) btnB.classList.add('is-discarded');
        else {
            if (btnA) btnA.classList.add('is-discarded');
            if (btnB) btnB.classList.add('is-discarded');
        }

        setTimeout(applyDiscardData, 100);
    }

    document.getElementById('discard-a-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleDiscard(0);
    });
    document.getElementById('discard-b-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleDiscard(1);
    });
    document.getElementById('discard-both-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDiscard(2);
    });
    document.getElementById('dont-like-both-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDiscard(2);
    });

    function handleUndo() {
        if (!tournament || isTransitioning) return;
        const success = tournament.undo();
        if (success) {
            clearDuelSelectionState();
            renderCurrentMatch();

            const arenaContainer = document.getElementById('arena-cards-container');
            if (arenaContainer) {
                arenaContainer.classList.remove('arena-refresh');
                void arenaContainer.offsetWidth;
                arenaContainer.classList.add('arena-refresh');
                setTimeout(() => arenaContainer.classList.remove('arena-refresh'), 180);
            }

            toast(BNR_I18N.t('undoChoice'));
        }
    }

    document.getElementById('undo-btn').addEventListener('click', handleUndo);

    async function startRanking() {
        // Shuffle to remove input bias
        const arr = [...session.names];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        tournament = new BNR.BracketTournament(arr);
        document.getElementById('comparison-state').classList.remove('hidden');
        renderCurrentMatch();
    }

    // ── Results ───────────────────────────────────────────
    function persist() {
        BNR.saveSession(session);
    }

    function deleteName(name) {
        if (!session.deleted.includes(name)) {
            session.deleted.push(name);
            persist();
            renderResults();
            toast(`Removed "${name}"`);
        }
    }

    function restoreName(name) {
        session.deleted = session.deleted.filter(n => n !== name);
        persist();
        renderResults();
        toast(`Restored "${name}"`);
    }

    document.getElementById('restore-all-btn').addEventListener('click', () => {
        session.deleted = [];
        persist();
        renderResults();
        toast(BNR_I18N.t('restoreAll'));
    });

    // Event delegation for deleting, restoring, and variations
    document.getElementById('results-list').addEventListener('click', (e) => {
        const delBtn = e.target.closest('button[data-action="delete"]');
        if (delBtn && delBtn.dataset.name) {
            deleteName(delBtn.dataset.name);
            return;
        }
        const varBtn = e.target.closest('button[data-action="variations"]');
        if (varBtn && varBtn.dataset.name) {
            openVariationsModal(varBtn.dataset.name);
        }
    });

    document.getElementById('deleted-chips').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="restore"]');
        if (btn && btn.dataset.name) {
            restoreName(btn.dataset.name);
        }
    });

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => toast(BNR_I18N.t('copiedSuccess')))
                .catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            toast(BNR_I18N.t('copiedSuccess'));
        } catch {
            toast('Failed to copy');
        }
        document.body.removeChild(ta);
    }

    async function shareRankings() {
        const activeList = session.ranking.filter(n => !session.deleted.includes(n));
        if (!activeList.length) return;
        const text = `${session.person}'s ${BNR_I18N.t('appTitle')}:\n` + activeList.map((n, i) => `${i + 1}. ${n}`).join('\n');
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${session.person}'s Baby Names`,
                    text: text
                });
                toast(BNR_I18N.t('copiedSuccess'));
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        copyToClipboard(text);
    }

    function shareSessionWithPartner() {
        const payload = BNR.encodeSharePayload({
            type: 'session',
            session: session
        });
        const baseUrl = window.location.origin + window.location.pathname.replace(/ranker\.html$/, '') + 'index.html';
        const shareUrl = `${baseUrl}#share=${payload}`;
        const message = `${BNR_I18N.t('shareWhatsAppMessage')}\n${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: BNR_I18N.t('appTitle'),
                text: message,
                url: shareUrl
            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    copyToClipboard(message);
                }
            });
        } else {
            copyToClipboard(message);
        }
    }

    function findOtherRankedSession() {
        const sessions = BNR.getSessions();
        return sessions.find(s => s.id !== session.id && s.category === session.category && s.status === 'ranked') || null;
    }

    // ── Partner Modal Setup ────────────────────────────────
    const modalPartner = document.getElementById('modal-partner');
    const modalPartnerClose = document.getElementById('modal-partner-close');
    const formPartner = document.getElementById('form-partner-session');
    const inputPartnerName = document.getElementById('input-partner-name');

    modalPartner?.addEventListener('click', (e) => {
        if (e.target === modalPartner) modalPartner.close();
    });
    modalPartnerClose?.addEventListener('click', () => modalPartner?.close());

    function openPartnerModal() {
        if (!modalPartner) return;
        const catTranslated = BNR_I18N.t('cat' + session.category);
        const activeCandidates = session.ranking && session.ranking.length > 0
            ? session.ranking.filter(n => !session.deleted.includes(n))
            : (session.names || []);
        const namesCount = activeCandidates.length;

        const infoText = document.getElementById('partner-modal-info-text');
        if (infoText) {
            infoText.textContent = `${namesCount} ${BNR_I18N.t('candidateNamesLabel').toLowerCase()} · ${catTranslated}`;
        }
        const desc = document.getElementById('partner-modal-desc');
        if (desc) {
            desc.textContent = BNR_I18N.t('partnerModalSub', {
                count: namesCount,
                category: catTranslated,
                name: session.person
            });
        }
        if (inputPartnerName) inputPartnerName.value = '';
        modalPartner.showModal();
        setTimeout(() => inputPartnerName?.focus(), 50);
    }

    formPartner?.addEventListener('submit', (e) => {
        e.preventDefault();
        const partnerName = inputPartnerName?.value.trim();
        if (!partnerName) return;
        const partnerSession = BNR.createPartnerSession(session, partnerName);
        BNR.saveSession(partnerSession);
        modalPartner.close();
        window.location.href = `ranker.html?session=${encodeURIComponent(partnerSession.id)}`;
    });

    // ── Next Step Dynamic Guidance ─────────────────────────
    function updateNextStepUI() {
        const badgeEl = document.getElementById('results-next-step-badge');
        const titleEl = document.getElementById('results-banner-title');
        const subEl = document.getElementById('results-banner-sub');
        const actionBtn = document.getElementById('next-step-action-btn');
        const actionText = document.getElementById('next-step-btn-text');
        const shareBtn = document.getElementById('bottom-share-btn');

        if (!actionBtn) return;

        const otherRanked = findOtherRankedSession();

        if (otherRanked) {
            // Stage 3: Both partners have ranked! Ready to compare.
            if (badgeEl) badgeEl.textContent = BNR_I18N.t('flowStep3Title');
            if (titleEl) titleEl.textContent = BNR_I18N.t('readyToCompareTitle');
            if (subEl) {
                subEl.textContent = BNR_I18N.t('readyToCompareSub', {
                    person1: session.person,
                    person2: otherRanked.person
                });
            }

            if (actionText) {
                actionText.textContent = BNR_I18N.t('compareNowWithPartnerBtn', { name: otherRanked.person });
            }
            actionBtn.onclick = () => {
                window.location.href = `compare.html?a=${encodeURIComponent(session.id)}&b=${encodeURIComponent(otherRanked.id)}`;
            };

            if (shareBtn) {
                const shareText = shareBtn.querySelector('span');
                if (shareText) shareText.textContent = BNR_I18N.t('share');
                shareBtn.onclick = shareRankings;
            }
        } else {
            // Stage 2: Waiting for partner to rank!
            if (badgeEl) badgeEl.textContent = BNR_I18N.t('flowStep2Title');
            if (titleEl) titleEl.textContent = BNR_I18N.t('nextStepPartnerPrompt');
            if (subEl) subEl.textContent = BNR_I18N.t('nextStepPartnerSub');

            if (actionText) {
                actionText.textContent = BNR_I18N.t('partnerOnThisDeviceBtn') + ' →';
            }
            actionBtn.onclick = openPartnerModal;

            if (shareBtn) {
                const shareText = shareBtn.querySelector('span');
                if (shareText) shareText.textContent = BNR_I18N.t('shareLinkWithPartnerBtn');
                shareBtn.onclick = shareSessionWithPartner;
            }
        }
    }

    document.getElementById('rerank-btn').addEventListener('click', () => {
        const active = session.ranking.filter(n => !session.deleted.includes(n));
        if (active.length < 2) {
            toast(BNR_I18N.t('minNamesAlert'));
            return;
        }
        const child = BNR.createReRankSession(session);
        if (!child) return;
        BNR.saveSession(child);
        window.location.href = `ranker.html?session=${encodeURIComponent(child.id)}`;
    });

    // ── Manual Add Form ────────────────────────────────
    document.getElementById('manual-add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('manual-add-input');
        const name = input.value.trim();
        if (!name) return;
        
        const active = session.ranking.filter(n => !session.deleted.includes(n));
        if (active.includes(name) || pendingAdditions.includes(name)) {
            toast('Name already in list');
            return;
        }
        
        pendingAdditions.push(name);
        input.value = '';
        renderResults();
        toast(BNR_I18N.t('addedToNextRound'));
    });

    // ── Variations Modal Logic ──────────────────────────────
    const modalVariations = document.getElementById('modal-variations');
    document.getElementById('variations-modal-close').addEventListener('click', () => modalVariations.close());

    function openVariationsModal(baseName) {
        const titleEl = document.getElementById('variations-title');
        const listEl = document.getElementById('variations-list');

        titleEl.textContent = BNR_I18N.t('variationsModalTitle', { name: baseName });
        listEl.innerHTML = '';

        const active = session.ranking.filter(n => !session.deleted.includes(n));
        const exclude = [...active, ...pendingAdditions];
        const variations = BNR.findSimilarNames(baseName, {
            limit: 10,
            category: session.category,
            exclude: exclude
        });

        if (variations.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-stone-400 py-3 text-center w-full">${BNR_I18N.t('noVariationsFound')}</p>`;
            modalVariations.showModal();
            return;
        }

        variations.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-800 transition-colors shadow-sm';
            btn.innerHTML = `<span>+ ${BNR.escapeHtml(item.name)}</span>`;
            btn.onclick = () => {
                pendingAdditions.push(item.name);
                renderResults();
                toast(BNR_I18N.t('addedToNextRound'));
                btn.remove();
                if (listEl.children.length === 0) {
                    modalVariations.close();
                }
            };
            listEl.appendChild(btn);
        });

        modalVariations.showModal();
    }

    function updateRerankBtn() {
        const activeCount = session.ranking.filter(n => !session.deleted.includes(n)).length;
        const total = activeCount + pendingAdditions.length;
        const btnText = document.getElementById('rerank-btn-text');
        if (pendingAdditions.length > 0) {
            btnText.textContent = BNR_I18N.t('startRerankWithVariations', { round: (session.round || 1) + 1, count: total });
        } else {
            btnText.textContent = BNR_I18N.t('rerankRemainingBtn');
        }
    }

    function renderResults() {
        const list = document.getElementById('results-list');
        list.innerHTML = '';

        const activeNames = session.ranking.filter(n => !session.deleted.includes(n));

        activeNames.forEach((name, index) => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between p-3.5 sm:p-4 hover:bg-stone-50 transition-colors';

            const rankNumber = String(index + 1).padStart(2, '0');
            const isTop3 = index < 3;
            const rankClass = isTop3
                ? 'flex-shrink-0 w-8 h-8 flex items-center justify-center bg-stone-900 text-stone-50 rounded-lg font-mono text-xs font-semibold mr-3.5'
                : 'flex-shrink-0 w-8 h-8 flex items-center justify-center bg-stone-100 text-stone-500 rounded-lg font-mono text-xs font-semibold mr-3.5';

            const escapedName = BNR.escapeHtml(name);

            li.innerHTML = `
                <div class="flex items-center min-w-0">
                    <span class="${rankClass}">${rankNumber}</span>
                    <span class="font-serif text-lg sm:text-xl font-normal text-stone-900 truncate tracking-tight">${escapedName}</span>
                </div>
                <div class="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button data-action="variations" data-name="${escapedName}" class="text-stone-400 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition-colors" title="${BNR_I18N.t('variationsAction')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>
                    </button>
                    <button data-action="delete" data-name="${escapedName}" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors" title="Delete ${escapedName}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });

        if (pendingAdditions.length > 0) {
            pendingAdditions.forEach(name => {
                const li = document.createElement('li');
                li.className = 'flex items-center justify-between p-3.5 sm:p-4 bg-amber-50/50 hover:bg-amber-50 transition-colors';
                const escapedName = BNR.escapeHtml(name);
                li.innerHTML = `
                    <div class="flex items-center min-w-0">
                        <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 rounded-lg font-mono text-xs font-semibold mr-3.5">✨</span>
                        <span class="font-serif text-lg sm:text-xl font-normal text-stone-900 truncate tracking-tight">${escapedName}</span>
                        <span class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200 text-amber-800 uppercase tracking-widest">${BNR_I18N.t('newBadge')}</span>
                    </div>
                    <div class="flex items-center gap-1 ml-2 flex-shrink-0">
                        <button data-action="delete-pending" data-name="${escapedName}" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors" title="Delete ${escapedName}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                `;
                list.appendChild(li);
            });
        }
        
        updateRerankBtn();

        // Deleted bin
        const deletedSection = document.getElementById('deleted-section');
        const deletedChips = document.getElementById('deleted-chips');
        const deletedCount = document.getElementById('deleted-count');

        if (session.deleted.length > 0) {
            deletedSection.classList.remove('hidden');
            deletedCount.textContent = `(${session.deleted.length})`;
            deletedChips.innerHTML = '';
            session.deleted.forEach(name => {
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

        updateNextStepUI();
    }

    function showResults(triggerConfetti = false) {
        document.getElementById('results-state').classList.remove('hidden');
        renderResults();
        window.scrollTo(0, 0);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (triggerConfetti && typeof confetti === 'function' && !prefersReducedMotion) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    // ── Entry Point ───────────────────────────────────────
    if (session.status === 'ranked') {
        showResults(false);
    } else {
        startRanking();
    }
