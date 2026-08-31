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
            rankedStatus: 'Ranked',
            setupStatus: 'In Progress',
            roundBadge: 'Round {round}',
            activeNamesCount: '{count} names active',
            viewResultsBtn: 'View Results',
            continueBtn: 'Continue Ranking',
            confirmDeleteSession: 'Delete this ranking session? This cannot be undone.',

            // New Session Modal
            modalNewTitle: 'New Ranking Session',
            modalNewSub: 'Curate and rank candidate names head-to-head',
            yourNameLabel: 'Your Name',
            yourNamePlaceholder: 'e.g. Liset or Tibor',
            categoryLabel: 'Category',
            topListsTitle: 'Top 50 Lists',
            topListsSub: 'Click to append',
            candidateNamesLabel: 'Candidate Names',
            namesCount: '({count} names)',
            namesPlaceholder: 'Enter or paste names (one per line)...',
            personRequiredAlert: 'Please enter your name.',
            minNamesAlert: 'Please enter at least 2 names to compare.',

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
            comparisonArena: 'Name Comparison Arena',
            whichDoYouPrefer: 'Which name do you prefer?',
            comparisonProgress: 'Comparison {current} of ~{total}',
            resultsComplete: 'Results Complete',
            rankedFavoritesTitle: 'Your Ranked Favorites',
            rankedFavoritesSub: 'Review your final order or remove names you wish to discard.',
            removedNamesTitle: 'Removed Names',
            rerankRemainingBtn: 'Re-rank Remaining Favorites →',
            shareRankingsBtn: 'Share / Copy',
            sessionNotFoundTitle: 'Session not found',
            sessionNotFoundSub: 'This session may have been deleted or the link is invalid.',

            // Consensus / Compare
            consensusTitle: 'Partner Consensus',
            consensusSub: 'Compare two rankings to reveal mutual favorites and agreement.',
            shareSummaryBtn: 'Share Summary',
            partnerLabel: 'Partner {num}',
            selectSessionPrompt: 'Select a session...',
            noRankedSessions: 'No ranked sessions found for this category.',
            mismatchCategoryNotice: 'Please select two sessions from the same category.',
            metricAgreement: 'Agreement Score',
            metricMutualTops: 'Mutual Top 5 Favorites',
            metricHighDisagreement: 'Biggest Disagreement',
            colRank: 'Consensus',
            colName: 'Name',
            colDiff: 'Difference',
            colScore: 'Agreement',
            statusTopMutual: 'Top Favorite',
            statusStrongAgree: 'High Agreement',
            statusModerateAgree: 'Moderate Agreement',
            statusDivergence: 'Disagreement',
            noMutualNames: 'No common names found between these two sessions.',

            // Landing Hero & Bento Grid
            duelOr: 'or',
            heroTitle: 'Settle the baby name debate',
            heroSub: 'One choice at a time. Each of you ranks your favorites head-to-head, then see where you agree.',
            bentoMethodTitle: 'Pick your favorite',
            bentoMethodDesc: 'Two names appear. You tap the one you prefer. Repeat until ranked.',
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
            rankedStatus: 'Gerangschikt',
            setupStatus: 'Bezig',
            roundBadge: 'Ronde {round}',
            activeNamesCount: '{count} actieve namen',
            viewResultsBtn: 'Bekijk Resultaten',
            continueBtn: 'Verder Kiezen',
            confirmDeleteSession: 'Deze sessie verwijderen? Dit kan niet ongedaan worden gemaakt.',

            // New Session Modal
            modalNewTitle: 'Nieuwe Rangschikking',
            modalNewSub: 'Kies jouw favorieten via rechtstreekse duels',
            yourNameLabel: 'Jouw Naam',
            yourNamePlaceholder: 'bijv. Liset of Tibor',
            categoryLabel: 'Categorie',
            topListsTitle: 'Top 50 Lijsten',
            topListsSub: 'Klik om toe te voegen',
            candidateNamesLabel: 'Namenlijst',
            namesCount: '({count} namen)',
            namesPlaceholder: 'Voer namen in (één per regel)...',
            personRequiredAlert: 'Vul alsjeblieft je naam in.',
            minNamesAlert: 'Vul minimaal 2 namen in om te kunnen vergelijken.',

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
            comparisonArena: 'Namen Vergelijker',
            whichDoYouPrefer: 'Welke naam heeft jouw voorkeur?',
            comparisonProgress: 'Vergelijking {current} van ~{total}',
            resultsComplete: 'Rangschikking Voltooid',
            rankedFavoritesTitle: 'Jouw Favorieten',
            rankedFavoritesSub: 'Bekijk je definitieve volgorde of verwijder namen die afvallen.',
            removedNamesTitle: 'Verwijderde Namen',
            rerankRemainingBtn: 'Her-rangschik Overgebleven Favorieten →',
            shareRankingsBtn: 'Deel / Kopiëren',
            sessionNotFoundTitle: 'Sessie niet gevonden',
            sessionNotFoundSub: 'Deze sessie is mogelijk verwijderd of de link is ongeldig.',

            // Consensus / Compare
            consensusTitle: 'Gezamenlijke Consensus',
            consensusSub: 'Vergelijk twee lijsten om overeenkomsten en favorieten te ontdekken.',
            shareSummaryBtn: 'Deel Samenvatting',
            partnerLabel: 'Partner {num}',
            selectSessionPrompt: 'Kies een sessie...',
            noRankedSessions: 'Geen gerangschikte sessies gevonden in deze categorie.',
            mismatchCategoryNotice: 'Kies twee sessies binnen dezelfde categorie.',
            metricAgreement: 'Overeenkomst Score',
            metricMutualTops: 'Gedeelde Top 5 Favorieten',
            metricHighDisagreement: 'Grootste Verschil',
            colRank: 'Consensus',
            colName: 'Naam',
            colDiff: 'Verschil',
            colScore: 'Match',
            statusTopMutual: 'Gedeelde Topfavoriet',
            statusStrongAgree: 'Hoge Overeenkomst',
            statusModerateAgree: 'Gematigde Overeenkomst',
            statusDivergence: 'Groot Verschil',
            noMutualNames: 'Geen gemeenschappelijke namen gevonden tussen deze sessies.',

            // Landing Hero & Bento Grid
            duelOr: 'of',
            heroTitle: 'Samen de perfecte babynaam kiezen',
            heroSub: 'Keuze voor keuze. Rangschik elk je eigen favorieten in 1-op-1 duels en ontdek waar jullie het eens zijn.',
            bentoMethodTitle: 'Kies jouw favoriet',
            bentoMethodDesc: 'Twee namen verschijnen. Tik op jouw voorkeur. Herhaal tot alles geordend is.',
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
            rankedStatus: 'Classé',
            setupStatus: 'En cours',
            roundBadge: 'Tour {round}',
            activeNamesCount: '{count} prénoms actifs',
            viewResultsBtn: 'Voir les résultats',
            continueBtn: 'Continuer',
            confirmDeleteSession: 'Supprimer cette session ? Cette action est irréversible.',

            // New Session Modal
            modalNewTitle: 'Nouvelle Session',
            modalNewSub: 'Classez vos prénoms favoris en duel',
            yourNameLabel: 'Votre Prénom',
            yourNamePlaceholder: 'ex. Camille ou Alexandre',
            categoryLabel: 'Catégorie',
            topListsTitle: 'Listes Top 50',
            topListsSub: 'Cliquez pour ajouter',
            candidateNamesLabel: 'Liste des prénoms',
            namesCount: '({count} prénoms)',
            namesPlaceholder: 'Entrez les prénoms (un par ligne)...',
            personRequiredAlert: 'Veuillez saisir votre prénom.',
            minNamesAlert: 'Veuillez entrer au moins 2 prénoms.',

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
            comparisonArena: 'Arène des Prénoms',
            whichDoYouPrefer: 'Quel prénom préférez-vous ?',
            comparisonProgress: 'Comparaison {current} sur ~{total}',
            resultsComplete: 'Classement Terminé',
            rankedFavoritesTitle: 'Vos Prénoms Favoris',
            rankedFavoritesSub: 'Consultez votre ordre final ou retirez les prénoms indésirables.',
            removedNamesTitle: 'Prénoms Retirés',
            rerankRemainingBtn: 'Reclasser les favoris restants →',
            shareRankingsBtn: 'Partager / Copier',
            sessionNotFoundTitle: 'Session introuvable',
            sessionNotFoundSub: 'Cette session a été supprimée ou le lien est invalide.',

            // Consensus / Compare
            consensusTitle: 'Consensus du Couple',
            consensusSub: 'Comparez deux listes pour découvrir vos coups de cœur communs.',
            shareSummaryBtn: 'Partager le bilan',
            partnerLabel: 'Partenaire {num}',
            selectSessionPrompt: 'Sélectionnez une session...',
            noRankedSessions: 'Aucune session classée trouvée pour cette catégorie.',
            mismatchCategoryNotice: 'Veuillez choisir deux sessions de la même catégorie.',
            metricAgreement: 'Score d’accord',
            metricMutualTops: 'Top 5 Communs',
            metricHighDisagreement: 'Plus Grand Écart',
            colRank: 'Consensus',
            colName: 'Prénom',
            colDiff: 'Écart',
            colScore: 'Accord',
            statusTopMutual: 'Coup de Cœur Commun',
            statusStrongAgree: 'Fort Accord',
            statusModerateAgree: 'Accord Modéré',
            statusDivergence: 'Désaccord',
            noMutualNames: 'Aucun prénom en commun entre ces deux sessions.',

            // Landing Hero & Bento Grid
            duelOr: 'ou',
            heroTitle: 'Choisissez ensemble le prénom idéal',
            heroSub: 'Un choix à la fois. Classez chacun vos favoris en duel, puis découvrez vos accords.',
            bentoMethodTitle: 'Choisissez votre favori',
            bentoMethodDesc: 'Deux prénoms apparaissent. Touchez celui que vous préférez. Répétez jusqu’au classement.',
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
            rankedStatus: 'Clasificado',
            setupStatus: 'En progreso',
            roundBadge: 'Ronda {round}',
            activeNamesCount: '{count} nombres activos',
            viewResultsBtn: 'Ver Resultados',
            continueBtn: 'Continuar',
            confirmDeleteSession: '¿Eliminar esta sesión? Esta acción no se puede deshacer.',

            // New Session Modal
            modalNewTitle: 'Nueva Sesión',
            modalNewSub: 'Elige tus favoritos mediante duelos directos',
            yourNameLabel: 'Tu Nombre',
            yourNamePlaceholder: 'ej. Lucía o Mateo',
            categoryLabel: 'Categoría',
            topListsTitle: 'Listas Top 50',
            topListsSub: 'Haz clic para añadir',
            candidateNamesLabel: 'Lista de nombres',
            namesCount: '({count} nombres)',
            namesPlaceholder: 'Introduce nombres (uno por línea)...',
            personRequiredAlert: 'Por favor, introduce tu nombre.',
            minNamesAlert: 'Introduce al menos 2 nombres para comparar.',

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
            comparisonArena: 'Duelo de Nombres',
            whichDoYouPrefer: '¿Qué nombre prefieres?',
            comparisonProgress: 'Comparación {current} de ~{total}',
            resultsComplete: 'Clasificación Completa',
            rankedFavoritesTitle: 'Tus Nombres Favoritos',
            rankedFavoritesSub: 'Revisa tu orden final o descarta nombres indeseados.',
            removedNamesTitle: 'Nombres Descartados',
            rerankRemainingBtn: 'Reclasificar Favoritos Restantes →',
            shareRankingsBtn: 'Compartir / Copiar',
            sessionNotFoundTitle: 'Sesión no encontrada',
            sessionNotFoundSub: 'Esta sesión ha sido eliminada o el enlace no es válido.',

            // Consensus / Compare
            consensusTitle: 'Consenso de Pareja',
            consensusSub: 'Compara dos clasificaciones para descubrir coincidencias y acuerdos.',
            shareSummaryBtn: 'Compartir Resumen',
            partnerLabel: 'Pareja {num}',
            selectSessionPrompt: 'Selecciona una sesión...',
            noRankedSessions: 'No hay sesiones clasificadas en esta categoría.',
            mismatchCategoryNotice: 'Por favor, selecciona dos sesiones de la misma categoría.',
            metricAgreement: 'Nivel de Acuerdo',
            metricMutualTops: 'Top 5 Favoritos Comunes',
            metricHighDisagreement: 'Mayor Desacuerdo',
            colRank: 'Consenso',
            colName: 'Nombre',
            colDiff: 'Diferencia',
            colScore: 'Afinidad',
            statusTopMutual: 'Favorito Mutuo',
            statusStrongAgree: 'Gran Acuerdo',
            statusModerateAgree: 'Acuerdo Moderado',
            statusDivergence: 'Desacuerdo',
            noMutualNames: 'No se encontraron nombres comunes entre estas dos sesiones.',

            // Landing Hero & Bento Grid
            duelOr: 'o',
            heroTitle: 'Elijan juntos el nombre ideal',
            heroSub: 'Una elección a la vez. Cada uno clasifica sus favoritos en duelos directos y descubran sus coincidencias.',
            bentoMethodTitle: 'Elige tu favorito',
            bentoMethodDesc: 'Aparecen dos nombres. Toca el que prefieras. Repite hasta clasificar todos.',
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
            rankedStatus: 'Geordnet',
            setupStatus: 'In Bearbeitung',
            roundBadge: 'Runde {round}',
            activeNamesCount: '{count} aktive Namen',
            viewResultsBtn: 'Ergebnisse ansehen',
            continueBtn: 'Fortsetzen',
            confirmDeleteSession: 'Diese Sitzung löschen? Dies kann nicht rückgängig gemacht werden.',

            // New Session Modal
            modalNewTitle: 'Neue Rangliste',
            modalNewSub: 'Finde deine Favoriten im direkten 1-gegen-1',
            yourNameLabel: 'Dein Name',
            yourNamePlaceholder: 'z.B. Emma oder Lukas',
            categoryLabel: 'Kategorie',
            topListsTitle: 'Top 50 Listen',
            topListsSub: 'Klicken zum Hinzufügen',
            candidateNamesLabel: 'Namensliste',
            namesCount: '({count} Namen)',
            namesPlaceholder: 'Namen eingeben (einer pro Zeile)...',
            personRequiredAlert: 'Bitte gib deinen Namen ein.',
            minNamesAlert: 'Bitte gib mindestens 2 Namen ein.',

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
            comparisonArena: 'Namensduell',
            whichDoYouPrefer: 'Welchen Namen bevorzugst du?',
            comparisonProgress: 'Vergleich {current} von ~{total}',
            resultsComplete: 'Rangliste abgeschlossen',
            rankedFavoritesTitle: 'Deine Favoriten',
            rankedFavoritesSub: 'Überprüfe deine finale Reihenfolge oder sortiere Namen aus.',
            removedNamesTitle: 'Aussortierte Namen',
            rerankRemainingBtn: 'Verbleibende Favoriten neu ordnen →',
            shareRankingsBtn: 'Teilen / Kopieren',
            sessionNotFoundTitle: 'Sitzung nicht gefunden',
            sessionNotFoundSub: 'Diese Sitzung wurde gelöscht oder der Link ist ungültig.',

            // Consensus / Compare
            consensusTitle: 'Gemeinsamer Konsens',
            consensusSub: 'Vergleicht eure Listen und findet gemeinsame Favoriten.',
            shareSummaryBtn: 'Zusammenfassung teilen',
            partnerLabel: 'Partner {num}',
            selectSessionPrompt: 'Sitzung auswählen...',
            noRankedSessions: 'Keine geordneten Sitzungen in dieser Kategorie gefunden.',
            mismatchCategoryNotice: 'Bitte wähle zwei Sitzungen derselben Kategorie.',
            metricAgreement: 'Übereinstimmung',
            metricMutualTops: 'Gemeinsame Top 5',
            metricHighDisagreement: 'Größter Unterschied',
            colRank: 'Konsens',
            colName: 'Name',
            colDiff: 'Differenz',
            colScore: 'Match',
            statusTopMutual: 'Gemeinsamer Favorit',
            statusStrongAgree: 'Hohe Übereinstimmung',
            statusModerateAgree: 'Mittlere Übereinstimmung',
            statusDivergence: 'Uneinigkeit',
            noMutualNames: 'Keine gemeinsamen Namen zwischen diesen Sitzungen gefunden.',

            // Landing Hero & Bento Grid
            duelOr: 'oder',
            heroTitle: 'Findet gemeinsam den perfekten Namen',
            heroSub: 'Schritt für Schritt. Jeder ordnet seine Favoriten im Duell und entdeckt gemeinsame Treffer.',
            bentoMethodTitle: 'Wähle deinen Favoriten',
            bentoMethodDesc: 'Zwei Namen erscheinen. Tippe auf deinen Favoriten. Wiederhole bis alles sortiert ist.',
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
            rankedStatus: 'مكتمل الترتيب',
            setupStatus: 'قيد الترتيب',
            roundBadge: 'الجولة {round}',
            activeNamesCount: '{count} أسماء نشطة',
            viewResultsBtn: 'عرض النتائج',
            continueBtn: 'متابعة الترتيب',
            confirmDeleteSession: 'هل أنت متأكد من حذف هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء.',

            // New Session Modal
            modalNewTitle: 'جلسة ترتيب جديدة',
            modalNewSub: 'اختر أسماءك المفضلة من خلال المقارنات الثنائية',
            yourNameLabel: 'اسمك',
            yourNamePlaceholder: 'مثال: يوسف أو مريم',
            categoryLabel: 'الفئة',
            topListsTitle: 'قوائم أفضل 50',
            topListsSub: 'اضغط للإضافة',
            candidateNamesLabel: 'قائمة الأسماء',
            namesCount: '({count} أسماء)',
            namesPlaceholder: 'أدخل الأسماء (اسم واحد في كل سطر)...',
            personRequiredAlert: 'يرجى إدخال اسمك.',
            minNamesAlert: 'يرجى إدخال اسمين على الأقل للمقارنة.',

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
            comparisonArena: 'حلبة مقارنة الأسماء',
            whichDoYouPrefer: 'أي الاسمين تفضل؟',
            comparisonProgress: 'المقارنة {current} من حوالي {total}',
            resultsComplete: 'اكتمل الترتيب',
            rankedFavoritesTitle: 'قائمة الأسماء المفضلة',
            rankedFavoritesSub: 'راجع ترتيبك النهائي أو احذف الأسماء التي لم تعد ترغب بها.',
            removedNamesTitle: 'الأسماء المحذوفة',
            rerankRemainingBtn: 'إعادة ترتيب المفضلات المتبقية ←',
            shareRankingsBtn: 'مشاركة / نسخ',
            sessionNotFoundTitle: 'الجلسة غير موجودة',
            sessionNotFoundSub: 'ربما تم حذف هذه الجلسة أو الرابط غير صالح.',

            // Consensus / Compare
            consensusTitle: 'التوافق المشترك',
            consensusSub: 'قارن ترتيبكما لاكتشاف الأسماء المفضلة المشتركة ومستوى الاتفاق.',
            shareSummaryBtn: 'مشاركة الملخص',
            partnerLabel: 'الشريك {num}',
            selectSessionPrompt: 'اختر جلسة...',
            noRankedSessions: 'لا توجد جلسات مكتملة لهذه الفئة.',
            mismatchCategoryNotice: 'يرجى اختيار جلستين من نفس الفئة.',
            metricAgreement: 'نسبة التوافق',
            metricMutualTops: 'أفضل 5 مفضلات مشتركة',
            metricHighDisagreement: 'أكبر تباين في الرأي',
            colRank: 'الترتيب',
            colName: 'الاسم',
            colDiff: 'الفارق',
            colScore: 'التوافق',
            statusTopMutual: 'المفضل المشترك',
            statusStrongAgree: 'توافق قوي',
            statusModerateAgree: 'توافق معتدل',
            statusDivergence: 'تباين في الرأي',
            noMutualNames: 'لا توجد أسماء مشتركة بين هاتين الجلستين.',

            // Landing Hero & Bento Grid
            duelOr: 'أو',
            heroTitle: 'اختارا معاً الاسم المثالي لمولودكما',
            heroSub: 'اختياراً تلو الآخر. يقوم كل منكما بترتيب مفضلاته في مقارنات ثنائية، ثم تكتشفان نقاط الاتفاق.',
            bentoMethodTitle: 'اختر اسمك المفضل',
            bentoMethodDesc: 'يظهر اسمان في كل جولة. اختر الاسم المفضل لديك حتى تكتمل القائمة.',
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
