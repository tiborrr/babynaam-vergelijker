/**
 * Baby Name Ranker — Internationalization (i18n) Module
 * Supports automatic browser locale detection, language overrides,
 * dynamic string interpolation, DOM updates, and RTL support.
 */

(function () {
    const STORAGE_LANG_KEY = 'babynamer:lang';
    const SUPPORTED_LANGS = ['en', 'nl', 'fr', 'es', 'de', 'ar'];
    const DEFAULT_LANG = 'en';

    const TRANSLATIONS = {
        en: {
            brandTagline: 'Decision Companion',
            appTitle: 'Baby Name Ranker',
            appSubtitle: 'Head-to-head comparison to find the name you both love.',
            dashboard: 'Dashboard',
            backToDashboard: '← Back to Dashboard',
            newSession: 'New Session',
            import: 'Import',
            export: 'Export',
            compare: 'Compare',
            rerank: 'Re-rank',
            delete: 'Delete',
            restore: 'Restore',
            restoreAll: 'Restore All',
            share: 'Share',
            copy: 'Copy',
            close: 'Close',
            sortAZ: 'Sort A–Z',
            clear: 'Clear',
            clearAll: 'Clear All',
            startRanking: 'Start Ranking',
            undoChoice: 'Undo Choice',
            keyboardHint: 'Press 1 or 2 to choose · Space to undo',

            // Categories
            catGirls: 'Girls',
            catBoys: 'Boys',
            catUnisex: 'Unisex',

            // Dashboard
            sessionsSelected: '{count} sessions selected',
            compareSessionsBtn: 'Compare →',
            noSessionsTitle: 'No ranking sessions yet',
            noSessionsSub: 'Create your first candidate list or import one shared by your partner.',
            createFirstBtn: 'Create First Session',
            rankedStatus: 'Done',
            setupStatus: 'Draft',
            roundBadge: 'Round {round}',
            activeNamesCount: '{count} names active',
            viewResultsBtn: 'View Results',
            continueBtn: 'Continue Ranking',
            confirmDeleteSession: 'Delete this ranking session? This cannot be undone.',

            // New Session Modal
            modalNewTitle: 'New Name List',
            modalNewSub: 'Pick your names and rank them head-to-head.',
            yourNameLabel: 'Your Name',
            yourNamePlaceholder: 'e.g. Liset or Tibor',
            categoryLabel: 'Category',
            topListsTitle: 'Top Lists',
            topListsSub: 'Click to append',
            candidateNamesLabel: 'Candidate Names',
            namesCount: '({count} names)',
            namesPlaceholder: 'Enter or paste names (one per line)...',
            personRequiredAlert: 'Please enter your name.',
            minNamesAlert: 'Please enter at least 2 names to compare.',
            findSimilarBtn: "✨ Find Variations",
            variationsFound: "Found {count} variations for your candidate names",
            variationsAction: "Variations",
            variationsModalTitle: "Similar Variations of \"{name}\"",
            variationsModalSub: "Select variations to add them to your list.",
            addNamePlaceholder: "Type a name to add...",
            addNameBtn: "Add",
            newBadge: "New",
            addedToNextRound: "Added to next round",
            noVariationsFound: "No similar variations found.",
            startRerankWithVariations: "Start Round {round} with {count} Names →",

            // Import Modal
            modalImportTitle: 'Import Sessions',
            modalImportSub: 'Load rankings shared by your partner',
            uploadJsonBtn: 'Upload JSON file',
            orPasteLabel: 'OR PASTE CODE',
            sharedJsonLabel: 'Shared JSON',
            pasteClipboardBtn: 'Paste clipboard',
            pastePlaceholder: 'Paste exported JSON text here...',
            importSessionsBtn: 'Import Sessions',
            importSuccess: 'Successfully imported {count} session(s)!',
            importNoValid: 'No valid sessions found to import.',
            importError: 'Invalid JSON file. Please verify the format.',

            // Export Modal
            modalExportTitle: 'Export & Share',
            modalExportSub: 'Share your ranked lists with your partner',
            exportDescription: 'Your data is stored privately in your browser. Transfer your ranking sessions to your partner’s phone or laptop in one tap.',
            shareNativeBtn: 'Share via App / WhatsApp',
            copyCodeBtn: 'Copy Share Code',
            downloadJsonBtn: 'Download .JSON File',
            copiedSuccess: 'Copied to clipboard!',

            // Ranker Arena
            comparisonArena: 'Rank Your Names',
            whichDoYouPrefer: 'Which name do you prefer?',
            comparisonProgress: 'Comparison {current} of ~{total}',
            resultsComplete: 'All Done',
            rankedFavoritesTitle: 'Your Top Names',
            rankedFavoritesSub: 'Check your final order or remove names you don\'t love.',
            removedNamesTitle: 'Skipped Names',
            rerankRemainingBtn: 'Rank Remaining Names →',
            shareRankingsBtn: 'Share / Copy',
            sessionNotFoundTitle: 'Session not found',
            sessionNotFoundSub: 'This session may have been deleted or the link is invalid.',

            // Consensus / Compare
            consensusTitle: 'Your Matches',
            consensusSub: 'Compare your lists to find the names you both love.',
            shareSummaryBtn: 'Share Summary',
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            selectSessionPrompt: 'Choose a list...',
            noRankedSessions: 'No finished lists found for this category.',
            mismatchCategoryNotice: 'Please select two sessions from the same category.',
            metricAgreement: 'Agreement Score',
            metricMutualTops: 'Mutual Top 5 Favorites',
            metricHighDisagreement: 'Biggest Disagreement',
            colRank: 'Match',
            colName: 'Name',
            colDiff: 'Difference',
            colScore: 'Agreement',
            statusTopMutual: 'Top Match',
            statusStrongAgree: 'Strong Match',
            statusModerateAgree: 'Moderate Match',
            statusDivergence: 'No Match',
            noMutualNames: 'No names in common between these lists.',

            // Landing Hero & Bento Grid
            duelOr: 'or',
            heroTitle: 'Settle the baby name debate',
            heroSub: 'One choice at a time. Each of you ranks your favorites head-to-head, then see where you agree.',
            bentoMethodTitle: 'Pick your favorite',
            bentoMethodDesc: 'Names go head-to-head. Pick your favorite until your list is perfectly ordered.',
            bentoPrivacyTitle: '100% private',
            bentoPrivacyDesc: 'Everything stays on your phone. No accounts, no tracking, no server.',
            bentoConsensusTitle: 'Find consensus',
            bentoConsensusDesc: 'Compare both rankings and instantly see your mutual top names.',
            starterPacksTeaser: 'Includes curated starter packs from',
            cultureDutch: 'Dutch',
            cultureArabic: 'Arabic',
            cultureEnglish: 'English',
            cultureFrench: 'French',
            cultureSpanish: 'Spanish',
            cultureNordic: 'Nordic'
        },
        nl: {
            brandTagline: 'Keuze Hulp',
            appTitle: 'Babynaam Vergelijker',
            appSubtitle: 'Kies samen de mooiste babynaam met 1-op-1 vergelijkingen.',
            dashboard: 'Overzicht',
            backToDashboard: '← Terug naar overzicht',
            newSession: 'Nieuwe Sessie',
            import: 'Importeren',
            export: 'Exporteren',
            compare: 'Vergelijken',
            rerank: 'Her-rangschikken',
            delete: 'Verwijderen',
            restore: 'Herstellen',
            restoreAll: 'Alles Herstellen',
            share: 'Delen',
            copy: 'Kopiëren',
            close: 'Sluiten',
            sortAZ: 'Sorteer A–Z',
            clear: 'Wissen',
            clearAll: 'Alles Wissen',
            startRanking: 'Start met Kiezen',
            undoChoice: 'Keuze Ongedaan Maken',
            keyboardHint: 'Druk 1 of 2 om te kiezen · Spatie voor herstel',

            // Categories
            catGirls: 'Meisjes',
            catBoys: 'Jongens',
            catUnisex: 'Uniseks',

            // Dashboard
            sessionsSelected: '{count} sessies geselecteerd',
            compareSessionsBtn: 'Vergelijk →',
            noSessionsTitle: 'Nog geen sessies gestart',
            noSessionsSub: 'Stel je eigen namenlijst samen of importeer de lijst van je partner.',
            createFirstBtn: 'Start Eerste Sessie',
            rankedStatus: 'Klaar',
            setupStatus: 'Concept',
            roundBadge: 'Ronde {round}',
            activeNamesCount: '{count} actieve namen',
            viewResultsBtn: 'Bekijk Resultaten',
            continueBtn: 'Verder Kiezen',
            confirmDeleteSession: 'Deze sessie verwijderen? Dit kan niet ongedaan worden gemaakt.',

            // New Session Modal
            modalNewTitle: 'Nieuwe Namenlijst',
            modalNewSub: 'Kies je namen en rangschik ze 1-tegen-1.',
            yourNameLabel: 'Jouw Naam',
            yourNamePlaceholder: 'bijv. Liset of Tibor',
            categoryLabel: 'Categorie',
            topListsTitle: 'Top Namenlijsten',
            topListsSub: 'Klik om toe te voegen',
            candidateNamesLabel: 'Namenlijst',
            namesCount: '({count} namen)',
            namesPlaceholder: 'Voer namen in (één per regel)...',
            personRequiredAlert: 'Vul alsjeblieft je naam in.',
            minNamesAlert: 'Vul minimaal 2 namen in om te kunnen vergelijken.',
            findSimilarBtn: "✨ Vind Variaties",
            variationsFound: "{count} variaties gevonden voor jouw namen",
            variationsAction: "Variaties",
            variationsModalTitle: "Vergelijkbare Variaties van \"{name}\"",
            variationsModalSub: "Selecteer variaties om ze aan je lijst toe te voegen.",
            addNamePlaceholder: "Typ een naam om toe te voegen...",
            addNameBtn: "Toevoegen",
            newBadge: "Nieuw",
            addedToNextRound: "Toegevoegd aan volgende ronde",
            noVariationsFound: "Geen vergelijkbare variaties gevonden.",
            startRerankWithVariations: "Start Ronde {round} met {count} Namen →",

            // Import Modal
            modalImportTitle: 'Sessies Importeren',
            modalImportSub: 'Laad de rangschikking van je partner',
            uploadJsonBtn: 'Upload JSON bestand',
            orPasteLabel: 'OF PLAK CODE',
            sharedJsonLabel: 'Gedeelde JSON',
            pasteClipboardBtn: 'Plak vanaf klembord',
            pastePlaceholder: 'Plak de geëxporteerde JSON hier...',
            importSessionsBtn: 'Importeer Sessies',
            importSuccess: '{count} sessie(s) succesvol geïmporteerd!',
            importNoValid: 'Geen geldige sessies gevonden om te importeren.',
            importError: 'Ongeldig JSON bestand. Controleer het formaat.',

            // Export Modal
            modalExportTitle: 'Exporteren & Delen',
            modalExportSub: 'Deel jouw favorietenlijst met je partner',
            exportDescription: 'Je gegevens staan veilig in je eigen browser. Stuur je rangschikking in één klik naar de telefoon of laptop van je partner.',
            shareNativeBtn: 'Deel via App / WhatsApp',
            copyCodeBtn: 'Kopieer Deelcode',
            downloadJsonBtn: 'Download .JSON Bestand',
            copiedSuccess: 'Gekopieerd naar klembord!',

            // Ranker Arena
            comparisonArena: 'Namen Rangschikken',
            whichDoYouPrefer: 'Welke naam heeft jouw voorkeur?',
            comparisonProgress: 'Vergelijking {current} van ~{total}',
            resultsComplete: 'Klaar!',
            rankedFavoritesTitle: 'Jouw Top Namen',
            rankedFavoritesSub: 'Bekijk je volgorde en verwijder de namen die afvallen.',
            removedNamesTitle: 'Overgeslagen Namen',
            rerankRemainingBtn: 'Rangschik Overgebleven Namen →',
            shareRankingsBtn: 'Deel / Kopiëren',
            sessionNotFoundTitle: 'Sessie niet gevonden',
            sessionNotFoundSub: 'Deze sessie is mogelijk verwijderd of de link is ongeldig.',

            // Consensus / Compare
            consensusTitle: 'Jullie Matches',
            consensusSub: 'Vergelijk jullie lijsten en vind de namen die jullie allebei mooi vinden.',
            shareSummaryBtn: 'Deel Samenvatting',
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            selectSessionPrompt: 'Kies een lijst...',
            noRankedSessions: 'Geen voltooide lijsten gevonden in deze categorie.',
            mismatchCategoryNotice: 'Kies twee sessies binnen dezelfde categorie.',
            metricAgreement: 'Overeenkomst Score',
            metricMutualTops: 'Gedeelde Top 5 Favorieten',
            metricHighDisagreement: 'Grootste Verschil',
            colRank: 'Match',
            colName: 'Naam',
            colDiff: 'Verschil',
            colScore: 'Match',
            statusTopMutual: 'Top Match',
            statusStrongAgree: 'Goede Match',
            statusModerateAgree: 'Redelijke Match',
            statusDivergence: 'Geen Match',
            noMutualNames: 'Geen gedeelde namen gevonden tussen deze lijsten.',

            // Landing Hero & Bento Grid
            duelOr: 'of',
            heroTitle: 'Samen de perfecte babynaam kiezen',
            heroSub: 'Keuze voor keuze. Rangschik elk je eigen favorieten in 1-op-1 duels en ontdek waar jullie het eens zijn.',
            bentoMethodTitle: 'Kies jouw favoriet',
            bentoMethodDesc: 'Namen nemen het tegen elkaar op. Kies je favoriet tot je lijst perfect is gesorteerd.',
            bentoPrivacyTitle: '100% privé',
            bentoPrivacyDesc: 'Alles blijft op jouw apparaat. Geen accounts, geen tracking, geen server.',
            bentoConsensusTitle: 'Vind consensus',
            bentoConsensusDesc: 'Vergelijk beide ranglijsten en zie meteen jullie gedeelde topnamen.',
            starterPacksTeaser: 'Inclusief samengestelde starterlijsten uit',
            cultureDutch: 'Nederlands',
            cultureArabic: 'Arabisch',
            cultureEnglish: 'Engels',
            cultureFrench: 'Frans',
            cultureSpanish: 'Spaans',
            cultureNordic: 'Noors'
        },
        fr: {
            brandTagline: 'Compagnon de Décision',
            appTitle: 'Comparateur de Prénoms',
            appSubtitle: 'Trouvez ensemble le prénom idéal grâce aux duels en face-à-face.',
            dashboard: 'Tableau de bord',
            backToDashboard: '← Retour au tableau de bord',
            newSession: 'Nouvelle Session',
            import: 'Importer',
            export: 'Exporter',
            compare: 'Comparer',
            rerank: 'Reclasser',
            delete: 'Supprimer',
            restore: 'Restaurer',
            restoreAll: 'Tout restaurer',
            share: 'Partager',
            copy: 'Copier',
            close: 'Fermer',
            sortAZ: 'Trier A–Z',
            clear: 'Effacer',
            clearAll: 'Tout effacer',
            startRanking: 'Commencer le classement',
            undoChoice: 'Annuler le choix',
            keyboardHint: 'Appuyez sur 1 ou 2 · Espace pour annuler',

            // Categories
            catGirls: 'Filles',
            catBoys: 'Garçons',
            catUnisex: 'Mixtes',

            // Dashboard
            sessionsSelected: '{count} sessions sélectionnées',
            compareSessionsBtn: 'Comparer →',
            noSessionsTitle: 'Aucune session pour le moment',
            noSessionsSub: 'Créez votre première liste ou importez celle de votre partenaire.',
            createFirstBtn: 'Créer une session',
            rankedStatus: 'Terminé',
            setupStatus: 'Brouillon',
            roundBadge: 'Tour {round}',
            activeNamesCount: '{count} prénoms actifs',
            viewResultsBtn: 'Voir les résultats',
            continueBtn: 'Continuer',
            confirmDeleteSession: 'Supprimer cette session ? Cette action est irréversible.',

            // New Session Modal
            modalNewTitle: 'Nouvelle Liste de Prénoms',
            modalNewSub: 'Choisissez vos prénoms et classez-les en duel.',
            yourNameLabel: 'Votre Prénom',
            yourNamePlaceholder: 'ex. Camille ou Alexandre',
            categoryLabel: 'Catégorie',
            topListsTitle: 'Listes Populaires',
            topListsSub: 'Cliquez pour ajouter',
            candidateNamesLabel: 'Liste des prénoms',
            namesCount: '({count} prénoms)',
            namesPlaceholder: 'Entrez les prénoms (un par ligne)...',
            personRequiredAlert: 'Veuillez saisir votre prénom.',
            minNamesAlert: 'Veuillez entrer au moins 2 prénoms.',
            findSimilarBtn: "✨ Trouver des Variantes",
            variationsFound: "{count} variantes trouvées pour vos prénoms",
            variationsAction: "Variantes",
            variationsModalTitle: "Variantes Similaires de « {name} »",
            variationsModalSub: "Sélectionnez des variantes pour les ajouter à votre liste.",
            addNamePlaceholder: "Tapez un nom à ajouter...",
            addNameBtn: "Ajouter",
            newBadge: "Nouveau",
            addedToNextRound: "Ajouté au prochain tour",
            noVariationsFound: "Aucune variante similaire trouvée.",
            startRerankWithVariations: "Lancer le Tour {round} avec {count} Prénoms →",

            // Import Modal
            modalImportTitle: 'Importer des Sessions',
            modalImportSub: 'Chargez les classements de votre partenaire',
            uploadJsonBtn: 'Téléverser un fichier JSON',
            orPasteLabel: 'OU COLLER LE CODE',
            sharedJsonLabel: 'JSON partagé',
            pasteClipboardBtn: 'Coller depuis le presse-papier',
            pastePlaceholder: 'Collez le JSON ici...',
            importSessionsBtn: 'Importer les sessions',
            importSuccess: '{count} session(s) importée(s) avec succès !',
            importNoValid: 'Aucune session valide trouvée.',
            importError: 'Fichier JSON non valide.',

            // Export Modal
            modalExportTitle: 'Exporter et Partager',
            modalExportSub: 'Partagez vos classements avec votre partenaire',
            exportDescription: 'Vos données restent privées dans votre navigateur. Transférez votre liste en un clic.',
            shareNativeBtn: 'Partager via App / WhatsApp',
            copyCodeBtn: 'Copier le code de partage',
            downloadJsonBtn: 'Télécharger le fichier .JSON',
            copiedSuccess: 'Copié dans le presse-papier !',

            // Ranker Arena
            comparisonArena: 'Classez vos Prénoms',
            whichDoYouPrefer: 'Quel prénom préférez-vous ?',
            comparisonProgress: 'Comparaison {current} sur ~{total}',
            resultsComplete: 'Terminé !',
            rankedFavoritesTitle: 'Votre Top Prénoms',
            rankedFavoritesSub: 'Consultez votre classement et retirez les prénoms que vous n\'aimez pas.',
            removedNamesTitle: 'Prénoms Ignorés',
            rerankRemainingBtn: 'Reclasser les prénoms restants →',
            shareRankingsBtn: 'Partager / Copier',
            sessionNotFoundTitle: 'Session introuvable',
            sessionNotFoundSub: 'Cette session a été supprimée ou le lien est invalide.',

            // Consensus / Compare
            consensusTitle: 'Vos Matchs',
            consensusSub: 'Comparez vos listes pour trouver les prénoms que vous aimez tous les deux.',
            shareSummaryBtn: 'Partager le bilan',
            partner1: 'Partenaire 1',
            partner2: 'Partenaire 2',
            selectSessionPrompt: 'Choisissez une liste...',
            noRankedSessions: 'Aucune liste terminée trouvée pour cette catégorie.',
            mismatchCategoryNotice: 'Veuillez choisir deux sessions de la même catégorie.',
            metricAgreement: 'Score d’accord',
            metricMutualTops: 'Top 5 Communs',
            metricHighDisagreement: 'Plus Grand Écart',
            colRank: 'Match',
            colName: 'Prénom',
            colDiff: 'Écart',
            colScore: 'Accord',
            statusTopMutual: 'Top Match',
            statusStrongAgree: 'Excellent Match',
            statusModerateAgree: 'Bon Match',
            statusDivergence: 'Pas de Match',
            noMutualNames: 'Aucun prénom commun trouvé entre ces listes.',

            // Landing Hero & Bento Grid
            duelOr: 'ou',
            heroTitle: 'Choisissez ensemble le prénom idéal',
            heroSub: 'Un choix à la fois. Classez chacun vos favoris en duel, puis découvrez vos accords.',
            bentoMethodTitle: 'Choisissez votre favori',
            bentoMethodDesc: 'Les prénoms s\'affrontent en duel. Choisissez votre préféré jusqu\'à ce que votre liste soit parfaite.',
            bentoPrivacyTitle: '100% privé',
            bentoPrivacyDesc: 'Tout reste sur votre appareil. Sans compte, sans suivi, sans serveur.',
            bentoConsensusTitle: 'Trouvez le consensus',
            bentoConsensusDesc: 'Comparez vos deux listes et découvrez instantanément vos coups de cœur communs.',
            starterPacksTeaser: 'Comprend des listes thématiques de',
            cultureDutch: 'Néerlandais',
            cultureArabic: 'Arabe',
            cultureEnglish: 'Anglais',
            cultureFrench: 'Français',
            cultureSpanish: 'Espagnol',
            cultureNordic: 'Nordique'
        },
        es: {
            brandTagline: 'Guía de Decisiones',
            appTitle: 'Comparador de Nombres de Bebé',
            appSubtitle: 'Encuentren juntos el nombre perfecto mediante comparaciones directas.',
            dashboard: 'Panel',
            backToDashboard: '← Volver al panel',
            newSession: 'Nueva Sesión',
            import: 'Importar',
            export: 'Exportar',
            compare: 'Comparar',
            rerank: 'Reclasificar',
            delete: 'Eliminar',
            restore: 'Restaurer',
            restoreAll: 'Restaurar todo',
            share: 'Compartir',
            copy: 'Copiar',
            close: 'Cerrar',
            sortAZ: 'Ordenar A–Z',
            clear: 'Limpiar',
            clearAll: 'Borrar todo',
            startRanking: 'Comenzar a Elegir',
            undoChoice: 'Deshacer Selección',
            keyboardHint: 'Pulsa 1 o 2 para elegir · Espacio para deshacer',

            // Categories
            catGirls: 'Niñas',
            catBoys: 'Niños',
            catUnisex: 'Unisex',

            // Dashboard
            sessionsSelected: '{count} sesiones seleccionadas',
            compareSessionsBtn: 'Comparar →',
            noSessionsTitle: 'Aún no hay sesiones',
            noSessionsSub: 'Crea tu primera lista de nombres o importa la de tu pareja.',
            createFirstBtn: 'Crear Primera Sesión',
            rankedStatus: 'Completado',
            setupStatus: 'Borrador',
            roundBadge: 'Ronda {round}',
            activeNamesCount: '{count} nombres activos',
            viewResultsBtn: 'Ver Resultados',
            continueBtn: 'Continuar',
            confirmDeleteSession: '¿Eliminar esta sesión? Esta acción no se puede deshacer.',

            // New Session Modal
            modalNewTitle: 'Nueva Lista de Nombres',
            modalNewSub: 'Elige tus nombres y clasifícalos cara a cara.',
            yourNameLabel: 'Tu Nombre',
            yourNamePlaceholder: 'ej. Lucía o Mateo',
            categoryLabel: 'Categoría',
            topListsTitle: 'Listas Populares',
            topListsSub: 'Haz clic para añadir',
            candidateNamesLabel: 'Lista de nombres',
            namesCount: '({count} nombres)',
            namesPlaceholder: 'Introduce nombres (uno por línea)...',
            personRequiredAlert: 'Por favor, introduce tu nombre.',
            minNamesAlert: 'Introduce al menos 2 nombres para comparar.',
            findSimilarBtn: "✨ Buscar Variantes",
            variationsFound: "Se encontraron {count} variantes para tus nombres",
            variationsAction: "Variantes",
            variationsModalTitle: "Variantes Similares de «{name}»",
            variationsModalSub: "Selecciona variantes para añadirlas a tu lista.",
            addNamePlaceholder: "Escribe un nombre para añadir...",
            addNameBtn: "Añadir",
            newBadge: "Nuevo",
            addedToNextRound: "Añadido a la siguiente ronda",
            noVariationsFound: "No se encontraron variantes similares.",
            startRerankWithVariations: "Iniciar Ronda {round} con {count} Nombres →",

            // Import Modal
            modalImportTitle: 'Importar Sesiones',
            modalImportSub: 'Carga las clasificaciones de tu pareja',
            uploadJsonBtn: 'Subir archivo JSON',
            orPasteLabel: 'O PEGA EL CÓDIGO',
            sharedJsonLabel: 'JSON compartido',
            pasteClipboardBtn: 'Pegar del portapapeles',
            pastePlaceholder: 'Pega el texto JSON aquí...',
            importSessionsBtn: 'Importar Sesiones',
            importSuccess: '¡{count} sesión(es) importada(s) con éxito!',
            importNoValid: 'No se encontraron sesiones válidas.',
            importError: 'Archivo JSON inválido.',

            // Export Modal
            modalExportTitle: 'Exportar y Compartir',
            modalExportSub: 'Comparte tus clasificaciones con tu pareja',
            exportDescription: 'Tus datos se guardan de forma privada en tu navegador. Transfiere tus listas en un toque.',
            shareNativeBtn: 'Compartir por App / WhatsApp',
            copyCodeBtn: 'Copiar Código de Compartir',
            downloadJsonBtn: 'Descargar Archivo .JSON',
            copiedSuccess: '¡Copiado al portapapeles!',

            // Ranker Arena
            comparisonArena: 'Clasifica tus Nombres',
            whichDoYouPrefer: '¿Qué nombre prefieres?',
            comparisonProgress: 'Comparación {current} de ~{total}',
            resultsComplete: '¡Todo Listo!',
            rankedFavoritesTitle: 'Tu Top de Nombres',
            rankedFavoritesSub: 'Revisa tu orden final o elimina los que no te gusten.',
            removedNamesTitle: 'Nombres Ignorados',
            rerankRemainingBtn: 'Clasificar Nombres Restantes →',
            shareRankingsBtn: 'Compartir / Copiar',
            sessionNotFoundTitle: 'Sesión no encontrada',
            sessionNotFoundSub: 'Esta sesión ha sido eliminada o el enlace no es válido.',

            // Consensus / Compare
            consensusTitle: 'Vuestras Coincidencias',
            consensusSub: 'Compara vuestras listas para encontrar nombres que os encanten a los dos.',
            shareSummaryBtn: 'Compartir Resumen',
            partner1: 'Pareja 1',
            partner2: 'Pareja 2',
            selectSessionPrompt: 'Elige una lista...',
            noRankedSessions: 'No se encontraron listas completadas en esta categoría.',
            mismatchCategoryNotice: 'Por favor, selecciona dos sesiones de la misma categoría.',
            metricAgreement: 'Nivel de Acuerdo',
            metricMutualTops: 'Top 5 Favoritos Comunes',
            metricHighDisagreement: 'Mayor Desacuerdo',
            colRank: 'Match',
            colName: 'Nombre',
            colDiff: 'Diferencia',
            colScore: 'Afinidad',
            statusTopMutual: 'Top Match',
            statusStrongAgree: 'Gran Match',
            statusModerateAgree: 'Buen Match',
            statusDivergence: 'Sin Match',
            noMutualNames: 'No se encontraron nombres en común entre estas listas.',

            // Landing Hero & Bento Grid
            duelOr: 'o',
            heroTitle: 'Elijan juntos el nombre ideal',
            heroSub: 'Una elección a la vez. Cada uno clasifica sus favoritos en duelos directos y descubran sus coincidencias.',
            bentoMethodTitle: 'Elige tu favorito',
            bentoMethodDesc: 'Los nombres se enfrentan cara a cara. Elige tu favorito hasta que tu lista esté perfecta.',
            bentoPrivacyTitle: '100% privado',
            bentoPrivacyDesc: 'Todo se queda en tu dispositivo. Sin cuentas, sin rastreo, sin servidores.',
            bentoConsensusTitle: 'Encuentren consenso',
            bentoConsensusDesc: 'Comparen ambas listas y descubran al instante sus nombres favoritos en común.',
            starterPacksTeaser: 'Incluye listas seleccionadas de',
            cultureDutch: 'Holandés',
            cultureArabic: 'Árabe',
            cultureEnglish: 'Inglés',
            cultureFrench: 'Francés',
            cultureSpanish: 'Español',
            cultureNordic: 'Nórdico'
        },
        de: {
            brandTagline: 'Entscheidungsbegleiter',
            appTitle: 'Babynamen Vergleicher',
            appSubtitle: 'Findet gemeinsam den schönsten Namen durch direkte Duelle.',
            dashboard: 'Übersicht',
            backToDashboard: '← Zurück zur Übersicht',
            newSession: 'Neue Sitzung',
            import: 'Importieren',
            export: 'Exportieren',
            compare: 'Vergleichen',
            rerank: 'Neu ordnen',
            delete: 'Löschen',
            restore: 'Wiederherstellen',
            restoreAll: 'Alles wiederherstellen',
            share: 'Teilen',
            copy: 'Kopieren',
            close: 'Schließen',
            sortAZ: 'A–Z Sortieren',
            clear: 'Leeren',
            clearAll: 'Alles leeren',
            startRanking: 'Auswahl starten',
            undoChoice: 'Schritt zurück',
            keyboardHint: 'Drücke 1 oder 2 · Leertaste für zurück',

            // Categories
            catGirls: 'Mädchen',
            catBoys: 'Jungen',
            catUnisex: 'Unisex',

            // Dashboard
            sessionsSelected: '{count} Sitzungen ausgewählt',
            compareSessionsBtn: 'Vergleichen →',
            noSessionsTitle: 'Noch keine Sitzungen',
            noSessionsSub: 'Erstelle deine erste Namensliste oder importiere die deines Partners.',
            createFirstBtn: 'Erste Sitzung starten',
            rankedStatus: 'Fertig',
            setupStatus: 'Entwurf',
            roundBadge: 'Runde {round}',
            activeNamesCount: '{count} aktive Namen',
            viewResultsBtn: 'Ergebnisse ansehen',
            continueBtn: 'Fortsetzen',
            confirmDeleteSession: 'Diese Sitzung löschen? Dies kann nicht rückgängig gemacht werden.',

            // New Session Modal
            modalNewTitle: 'Neue Namensliste',
            modalNewSub: 'Namen auswählen und im direkten Duell bewerten.',
            yourNameLabel: 'Dein Name',
            yourNamePlaceholder: 'z.B. Emma oder Lukas',
            categoryLabel: 'Kategorie',
            topListsTitle: 'Top Namenslisten',
            topListsSub: 'Klicken zum Hinzufügen',
            candidateNamesLabel: 'Namensliste',
            namesCount: '({count} Namen)',
            namesPlaceholder: 'Namen eingeben (einer pro Zeile)...',
            personRequiredAlert: 'Bitte gib deinen Namen ein.',
            minNamesAlert: 'Bitte gib mindestens 2 Namen ein.',
            findSimilarBtn: "✨ Varianten finden",
            variationsFound: "{count} Varianten für deine Namen gefunden",
            variationsAction: "Varianten",
            variationsModalTitle: "Ähnliche Varianten von „{name}“",
            variationsModalSub: "Wähle Varianten aus, um sie zu deiner Liste hinzuzufügen.",
            addNamePlaceholder: "Name zum Hinzufügen eingeben...",
            addNameBtn: "Hinzufügen",
            newBadge: "Neu",
            addedToNextRound: "Zur nächsten Runde hinzugefügt",
            noVariationsFound: "Keine ähnlichen Varianten gefunden.",
            startRerankWithVariations: "Runde {round} mit {count} Namen starten →",

            // Import Modal
            modalImportTitle: 'Sitzungen importieren',
            modalImportSub: 'Lade die Rangliste deines Partners',
            uploadJsonBtn: 'JSON-Datei hochladen',
            orPasteLabel: 'ODER CODE EINFÜGEN',
            sharedJsonLabel: 'Geteiltes JSON',
            pasteClipboardBtn: 'Aus Zwischenablage einfügen',
            pastePlaceholder: 'JSON hier einfügen...',
            importSessionsBtn: 'Sitzungen importieren',
            importSuccess: '{count} Sitzung(en) erfolgreich importiert!',
            importNoValid: 'Keine gültigen Sitzungen gefunden.',
            importError: 'Ungültige JSON-Datei.',

            // Export Modal
            modalExportTitle: 'Exportieren & Teilen',
            modalExportSub: 'Teile deine Rangliste mit deinem Partner',
            exportDescription: 'Deine Daten bleiben privat in deinem Browser. Übertrage deine Liste mit einem Klick.',
            shareNativeBtn: 'Per App / WhatsApp teilen',
            copyCodeBtn: 'Teilen-Code kopieren',
            downloadJsonBtn: '.JSON Datei herunterladen',
            copiedSuccess: 'In die Zwischenablage kopiert!',

            // Ranker Arena
            comparisonArena: 'Namen Bewerten',
            whichDoYouPrefer: 'Welchen Namen bevorzugst du?',
            comparisonProgress: 'Vergleich {current} von ~{total}',
            resultsComplete: 'Alles Fertig!',
            rankedFavoritesTitle: 'Deine Top-Namen',
            rankedFavoritesSub: 'Überprüfe deine Liste und lösche die Namen, die dir nicht gefallen.',
            removedNamesTitle: 'Übersprungene Namen',
            rerankRemainingBtn: 'Verbleibende Namen neu ordnen →',
            shareRankingsBtn: 'Teilen / Kopieren',
            sessionNotFoundTitle: 'Sitzung nicht gefunden',
            sessionNotFoundSub: 'Diese Sitzung wurde gelöscht oder der Link ist ungültig.',

            // Consensus / Compare
            consensusTitle: 'Eure Matches',
            consensusSub: 'Vergleicht eure Listen und findet Namen, die ihr beide liebt.',
            shareSummaryBtn: 'Zusammenfassung teilen',
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            selectSessionPrompt: 'Liste auswählen...',
            noRankedSessions: 'Keine fertigen Listen in dieser Kategorie gefunden.',
            mismatchCategoryNotice: 'Bitte wähle zwei Sitzungen derselben Kategorie.',
            metricAgreement: 'Übereinstimmung',
            metricMutualTops: 'Gemeinsame Top 5',
            metricHighDisagreement: 'Größter Unterschied',
            colRank: 'Match',
            colName: 'Name',
            colDiff: 'Differenz',
            colScore: 'Match',
            statusTopMutual: 'Top-Match',
            statusStrongAgree: 'Starkes Match',
            statusModerateAgree: 'Gutes Match',
            statusDivergence: 'Kein Match',
            noMutualNames: 'Keine gemeinsamen Namen in diesen Listen gefunden.',

            // Landing Hero & Bento Grid
            duelOr: 'oder',
            heroTitle: 'Findet gemeinsam den perfekten Namen',
            heroSub: 'Schritt für Schritt. Jeder ordnet seine Favoriten im Duell und entdeckt gemeinsame Treffer.',
            bentoMethodTitle: 'Wähle deinen Favoriten',
            bentoMethodDesc: 'Namen treten im direkten Duell an. Wähle deinen Favoriten, bis deine Liste perfekt ist.',
            bentoPrivacyTitle: '100% privat',
            bentoPrivacyDesc: 'Alles bleibt auf deinem Gerät. Keine Konten, kein Tracking, kein Server.',
            bentoConsensusTitle: 'Findet Konsens',
            bentoConsensusDesc: 'Vergleicht eure Listen und seht sofort eure gemeinsamen Favoriten.',
            starterPacksTeaser: 'Enthält kuratierte Starterlisten aus',
            cultureDutch: 'Niederländisch',
            cultureArabic: 'Arabisch',
            cultureEnglish: 'Englisch',
            cultureFrench: 'Französisch',
            cultureSpanish: 'Spanisch',
            cultureNordic: 'Nordisch'
        },
        ar: {
            brandTagline: 'رفيق اتخاذ القرار',
            appTitle: 'مقارن أسماء المواليد',
            appSubtitle: 'اكتشفا معاً الاسم الأجمل لمولودكما عبر المقارنة المباشرة.',
            dashboard: 'لوحة التحكم',
            backToDashboard: '← العودة للرئيسية',
            newSession: 'جلسة جديدة',
            import: 'استيراد',
            export: 'تصدير',
            compare: 'مقارنة',
            rerank: 'إعادة الترتيب',
            delete: 'حذف',
            restore: 'استعادة',
            restoreAll: 'استعادة الكل',
            share: 'مشاركة',
            copy: 'نسخ',
            close: 'إغلاق',
            sortAZ: 'ترتيب أبجدي',
            clear: 'مسح',
            clearAll: 'مسح الكل',
            startRanking: 'بدء الترتيب',
            undoChoice: 'تراجع عن الاختيار',
            keyboardHint: 'اضغط 1 أو 2 للاختيار · مسافة للتراجع',

            // Categories
            catGirls: 'بنات',
            catBoys: 'أولاد',
            catUnisex: 'محايد',

            // Dashboard
            sessionsSelected: 'تم تحديد {count} جلسات',
            compareSessionsBtn: 'مقارنة ←',
            noSessionsTitle: 'لا توجد جلسات بعد',
            noSessionsSub: 'أنشئ قائمتك الأولى أو استورد قائمة شريكك.',
            createFirstBtn: 'إنشاء أول جلسة',
            rankedStatus: 'مكتمل',
            setupStatus: 'مسودة',
            roundBadge: 'الجولة {round}',
            activeNamesCount: '{count} أسماء نشطة',
            viewResultsBtn: 'عرض النتائج',
            continueBtn: 'متابعة الترتيب',
            confirmDeleteSession: 'هل أنت متأكد من حذف هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء.',

            // New Session Modal
            modalNewTitle: 'قائمة أسماء جديدة',
            modalNewSub: 'اختر الأسماء ورتبها في مقارنات ثنائية.',
            yourNameLabel: 'اسمك',
            yourNamePlaceholder: 'مثال: يوسف أو مريم',
            categoryLabel: 'الفئة',
            topListsTitle: 'قوائم الأسماء الشائعة',
            topListsSub: 'اضغط للإضافة',
            candidateNamesLabel: 'قائمة الأسماء',
            namesCount: '({count} أسماء)',
            namesPlaceholder: 'أدخل الأسماء (اسم واحد في كل سطر)...',
            personRequiredAlert: 'يرجى إدخال اسمك.',
            minNamesAlert: 'يرجى إدخال اسمين على الأقل للمقارنة.',
            findSimilarBtn: "✨ البحث عن بدائل",
            variationsFound: "تم العثور على {count} بدائل لأسمائك",
            variationsAction: "بدائل",
            variationsModalTitle: "بدائل مشابهة لاسم \"{name}\"",
            variationsModalSub: "اختر البدائل لإضافتها إلى قائمتك.",
            addNamePlaceholder: "اكتب اسماً لإضافته...",
            addNameBtn: "إضافة",
            newBadge: "جديد",
            addedToNextRound: "تمت الإضافة إلى الجولة القادمة",
            noVariationsFound: "لم يتم العثور على بدائل مشابهة.",
            startRerankWithVariations: "بدء الجولة {round} مع {count} أسماء ←",

            // Import Modal
            modalImportTitle: 'استيراد الجلسات',
            modalImportSub: 'تحميل الترتيب المرسل من شريكك',
            uploadJsonBtn: 'رفع ملف JSON',
            orPasteLabel: 'أو الصق الرمز',
            sharedJsonLabel: 'رمز JSON المشارك',
            pasteClipboardBtn: 'لصق من الحافظة',
            pastePlaceholder: 'الصق نص الـ JSON هنا...',
            importSessionsBtn: 'استيراد الجلسات',
            importSuccess: 'تم استيراد {count} جلسة بنجاح!',
            importNoValid: 'لم يتم العثور على جلسات صالحة.',
            importError: 'ملف JSON غير صالح.',

            // Export Modal
            modalExportTitle: 'تصدير ومشاركة',
            modalExportSub: 'شارك قائمتك المرتبة مع شريكك',
            exportDescription: 'بياناتك محفوظة بأمان داخل متصفحك. أرسل ترتيبك بنقرة واحدة إلى هاتف أو حاسوب شريكك.',
            shareNativeBtn: 'مشاركة عبر التطبيقات / واتساب',
            copyCodeBtn: 'نسخ رمز المشاركة',
            downloadJsonBtn: 'تحميل ملف .JSON',
            copiedSuccess: 'تم النسخ إلى الحافظة!',

            // Ranker Arena
            comparisonArena: 'رتب أسماءك',
            whichDoYouPrefer: 'أي الاسمين تفضل؟',
            comparisonProgress: 'المقارنة {current} من حوالي {total}',
            resultsComplete: 'جاهز!',
            rankedFavoritesTitle: 'أفضل أسمائك',
            rankedFavoritesSub: 'راجع ترتيبك النهائي أو احذف الأسماء التي لا تعجبك.',
            removedNamesTitle: 'الأسماء المستبعدة',
            rerankRemainingBtn: 'ترتيب الأسماء المتبقية ←',
            shareRankingsBtn: 'مشاركة / نسخ',
            sessionNotFoundTitle: 'الجلسة غير موجودة',
            sessionNotFoundSub: 'ربما تم حذف هذه الجلسة أو الرابط غير صالح.',

            // Consensus / Compare
            consensusTitle: 'تطابقاتكم',
            consensusSub: 'قارنا بين قوائمكما لمعرفة الأسماء التي تعجبكما معاً.',
            shareSummaryBtn: 'مشاركة الملخص',
            partner1: 'الشريك 1',
            partner2: 'الشريك 2',
            selectSessionPrompt: 'اختر قائمة...',
            noRankedSessions: 'لا توجد قوائم مكتملة في هذه الفئة.',
            mismatchCategoryNotice: 'يرجى اختيار جلستين من نفس الفئة.',
            metricAgreement: 'نسبة التوافق',
            metricMutualTops: 'أفضل 5 مفضلات مشتركة',
            metricHighDisagreement: 'أكبر تباين في الرأي',
            colRank: 'تطابق',
            colName: 'الاسم',
            colDiff: 'الفارق',
            colScore: 'التوافق',
            statusTopMutual: 'أفضل تطابق',
            statusStrongAgree: 'تطابق قوي',
            statusModerateAgree: 'تطابق جيد',
            statusDivergence: 'لا يوجد تطابق',
            noMutualNames: 'لا توجد أسماء مشتركة بين هذه القوائم.',

            // Landing Hero & Bento Grid
            duelOr: 'أو',
            heroTitle: 'اختارا معاً الاسم المثالي لمولودكما',
            heroSub: 'اختياراً تلو الآخر. يقوم كل منكما بترتيب مفضلاته في مقارنات ثنائية، ثم تكتشفان نقاط الاتفاق.',
            bentoMethodTitle: 'اختر اسمك المفضل',
            bentoMethodDesc: 'مقارنات ثنائية للأسماء. اختر المفضل لديك حتى تكتمل قائمتك بالترتيب المثالي.',
            bentoPrivacyTitle: 'خصوصية 100%',
            bentoPrivacyDesc: 'بياناتك محفوظة محلياً على جهازك. بدون حسابات أو تتبع أو خوادم.',
            bentoConsensusTitle: 'توافق الشريكين',
            bentoConsensusDesc: 'قارنا بين قائمتيكما واكتشفا فوراً الأسماء المفضلة المشتركة بينكما.',
            starterPacksTeaser: 'يتضمن قوائم جاهزة من',
            cultureDutch: 'هولندية',
            cultureArabic: 'عربية',
            cultureEnglish: 'إنجليزية',
            cultureFrench: 'فرنسية',
            cultureSpanish: 'إسبانية',
            cultureNordic: 'إسكندنافية'
        }
    };

    /**
     * Detects browser language, checking localStorage first, then navigator.languages
     */
    function detectLanguage() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem(STORAGE_LANG_KEY);
                if (saved && SUPPORTED_LANGS.includes(saved)) {
                    return saved;
                }
            }
        } catch (e) {
            // localStorage unavailable
        }

        const nav = typeof navigator !== 'undefined' ? navigator : null;
        if (!nav) return DEFAULT_LANG;

        const navLangs = (nav.languages && nav.languages.length)
            ? nav.languages
            : [nav.language || nav.userLanguage || ''];

        for (const fullLang of navLangs) {
            if (!fullLang) continue;
            const code = fullLang.toLowerCase().split(/[-_]/)[0];
            if (SUPPORTED_LANGS.includes(code)) {
                return code;
            }
        }

        return DEFAULT_LANG;
    }

    let currentLang = detectLanguage();

    /**
     * Translates a key with optional dynamic variable interpolation
     * e.g. t('roundBadge', { round: 2 }) -> 'Round 2' / 'Ronde 2'
     */
    function t(key, params = {}) {
        const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
        let text = dict[key] || (TRANSLATIONS[DEFAULT_LANG] ? TRANSLATIONS[DEFAULT_LANG][key] : key) || key;

        if (params && typeof params === 'object') {
            for (const [paramKey, val] of Object.entries(params)) {
                text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
            }
        }
        return text;
    }

    /**
     * Updates all DOM elements with data-i18n attributes
     */
    function applyTranslations() {
        if (typeof document === 'undefined') return;

        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const targetAttr = el.getAttribute('data-i18n-attr');
            const translated = t(key);

            if (targetAttr) {
                el.setAttribute(targetAttr, translated);
            } else {
                el.textContent = translated;
            }
        });

        // Update active state on language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const isActive = btn.dataset.lang === currentLang;
            if (isActive) {
                btn.className = 'lang-btn px-2 py-1 text-xs font-semibold rounded-md bg-stone-900 text-stone-50 transition-all';
            } else {
                btn.className = 'lang-btn px-2 py-1 text-xs font-medium rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all';
            }
        });

        // Trigger custom event so page-specific dynamic components re-render
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('bnr:languagechange', { detail: { lang: currentLang } }));
        }
    }

    /**
     * Changes current language and updates storage & DOM
     */
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_LANG_KEY, lang);
            }
        } catch (e) {}
        applyTranslations();
    }

    /**
     * Renders a language selector widget HTML
     */
    function renderLanguageSwitcher() {
        const langLabels = {
            en: 'EN',
            nl: 'NL',
            fr: 'FR',
            es: 'ES',
            de: 'DE',
            ar: 'العربية'
        };

        const buttons = SUPPORTED_LANGS.map(code => {
            const isActive = code === currentLang;
            const cls = isActive
                ? 'lang-btn px-2 py-1 text-xs font-semibold rounded-md bg-stone-900 text-stone-50 transition-all'
                : 'lang-btn px-2 py-1 text-xs font-medium rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all';
            return `<button type="button" data-lang="${code}" class="${cls}">${langLabels[code]}</button>`;
        }).join('');

        return `<div class="inline-flex items-center gap-0.5 p-0.5 rounded-lg border border-stone-200/80 bg-stone-50/80">${buttons}</div>`;
    }

    /**
     * Bind click listeners to language selector buttons
     */
    function bindLanguageSwitcherEvents() {
        if (typeof document === 'undefined') return;
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn && btn.dataset.lang) {
                setLanguage(btn.dataset.lang);
            }
        });
    }

    // Export module for both browser and Node.js test environment
    const BNR_I18N = {
        SUPPORTED_LANGS,
        DEFAULT_LANG,
        detectLanguage,
        getLanguage: () => currentLang,
        setLanguage,
        t,
        applyTranslations,
        renderLanguageSwitcher,
        bindLanguageSwitcherEvents,
        TRANSLATIONS
    };

    if (typeof window !== 'undefined') {
        window.BNR_I18N = BNR_I18N;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BNR_I18N;
    }

    // Auto-init on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                applyTranslations();
                bindLanguageSwitcherEvents();
            });
        } else {
            applyTranslations();
            bindLanguageSwitcherEvents();
        }
    }
})();
