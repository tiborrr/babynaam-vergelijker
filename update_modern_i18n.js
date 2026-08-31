const fs = require('fs');

const file = 'i18n.js';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
    en: {
        newSessionBtn: 'New List',
        emptyStateTitle: 'No lists yet',
        emptyStateSub: 'Start a new list to find your favorite names.',
        compareBarTitle: '{count} lists selected',
        modalNewTitle: 'New Name List',
        modalNewSub: 'Pick your names and rank them head-to-head.',
        rerankBtn: '🔁 Rank Again',
        rankedStatus: 'Done',
        setupStatus: 'Draft',
        comparisonArena: 'Rank Your Names',
        resultsComplete: 'All Done',
        rankedFavoritesTitle: 'Your Top Names',
        rankedFavoritesSub: "Check your final order or remove names you don't love.",
        removedNamesTitle: 'Skipped Names',
        rerankRemainingBtn: 'Rank Remaining Names →',
        consensusTitle: 'Your Matches',
        consensusSub: 'Compare your lists to find the names you both love.',
        selectSessionPrompt: 'Choose a list...',
        noRankedSessions: 'No finished lists found for this category.',
        colRank: 'Match',
        statusTopMutual: 'Top Match',
        statusStrongAgree: 'Strong Match',
        statusModerateAgree: 'Moderate Match',
        statusDivergence: 'No Match',
        noMutualNames: 'No names in common between these lists.'
    },
    nl: {
        newSessionBtn: 'Nieuwe Lijst',
        emptyStateTitle: 'Nog geen lijsten',
        emptyStateSub: 'Maak een nieuwe lijst aan om je favoriete namen te ontdekken.',
        compareBarTitle: '{count} lijsten geselecteerd',
        modalNewTitle: 'Nieuwe Namenlijst',
        modalNewSub: 'Kies je namen en rangschik ze 1-tegen-1.',
        rerankBtn: '🔁 Rangschik Opnieuw',
        rankedStatus: 'Klaar',
        setupStatus: 'Concept',
        comparisonArena: 'Namen Rangschikken',
        resultsComplete: 'Klaar!',
        rankedFavoritesTitle: 'Jouw Top Namen',
        rankedFavoritesSub: 'Bekijk je volgorde en verwijder de namen die afvallen.',
        removedNamesTitle: 'Overgeslagen Namen',
        rerankRemainingBtn: 'Rangschik Overgebleven Namen →',
        consensusTitle: 'Jullie Matches',
        consensusSub: 'Vergelijk jullie lijsten en vind de namen die jullie allebei mooi vinden.',
        selectSessionPrompt: 'Kies een lijst...',
        noRankedSessions: 'Geen voltooide lijsten gevonden in deze categorie.',
        colRank: 'Match',
        statusTopMutual: 'Top Match',
        statusStrongAgree: 'Goede Match',
        statusModerateAgree: 'Redelijke Match',
        statusDivergence: 'Geen Match',
        noMutualNames: 'Geen gedeelde namen gevonden tussen deze lijsten.'
    },
    fr: {
        newSessionBtn: 'Nouvelle Liste',
        emptyStateTitle: 'Aucune liste',
        emptyStateSub: 'Créez une nouvelle liste pour commencer à trouver vos prénoms favoris.',
        compareBarTitle: '{count} listes sélectionnées',
        modalNewTitle: 'Nouvelle Liste de Prénoms',
        modalNewSub: 'Choisissez vos prénoms et classez-les en duel.',
        rerankBtn: '🔁 Reclasser',
        rankedStatus: 'Terminé',
        setupStatus: 'Brouillon',
        comparisonArena: 'Classez vos Prénoms',
        resultsComplete: 'Terminé !',
        rankedFavoritesTitle: 'Votre Top Prénoms',
        rankedFavoritesSub: "Consultez votre classement et retirez les prénoms que vous n'aimez pas.",
        removedNamesTitle: 'Prénoms Ignorés',
        rerankRemainingBtn: 'Reclasser les prénoms restants →',
        consensusTitle: 'Vos Matchs',
        consensusSub: 'Comparez vos listes pour trouver les prénoms que vous aimez tous les deux.',
        selectSessionPrompt: 'Choisissez une liste...',
        noRankedSessions: 'Aucune liste terminée trouvée pour cette catégorie.',
        colRank: 'Match',
        statusTopMutual: 'Top Match',
        statusStrongAgree: 'Excellent Match',
        statusModerateAgree: 'Bon Match',
        statusDivergence: 'Pas de Match',
        noMutualNames: 'Aucun prénom commun trouvé entre ces listes.'
    },
    es: {
        newSessionBtn: 'Nueva Lista',
        emptyStateTitle: 'No hay listas',
        emptyStateSub: 'Crea una nueva lista para encontrar tus nombres favoritos.',
        compareBarTitle: '{count} listas seleccionadas',
        modalNewTitle: 'Nueva Lista de Nombres',
        modalNewSub: 'Elige tus nombres y clasifícalos cara a cara.',
        rerankBtn: '🔁 Reclasificar',
        rankedStatus: 'Completado',
        setupStatus: 'Borrador',
        comparisonArena: 'Clasifica tus Nombres',
        resultsComplete: '¡Todo Listo!',
        rankedFavoritesTitle: 'Tu Top de Nombres',
        rankedFavoritesSub: 'Revisa tu orden final o elimina los que no te gusten.',
        removedNamesTitle: 'Nombres Ignorados',
        rerankRemainingBtn: 'Clasificar Nombres Restantes →',
        consensusTitle: 'Vuestras Coincidencias',
        consensusSub: 'Compara vuestras listas para encontrar nombres que os encanten a los dos.',
        selectSessionPrompt: 'Elige una lista...',
        noRankedSessions: 'No se encontraron listas completadas en esta categoría.',
        colRank: 'Match',
        statusTopMutual: 'Top Match',
        statusStrongAgree: 'Gran Match',
        statusModerateAgree: 'Buen Match',
        statusDivergence: 'Sin Match',
        noMutualNames: 'No se encontraron nombres en común entre estas listas.'
    },
    de: {
        newSessionBtn: 'Neue Liste',
        emptyStateTitle: 'Noch keine Listen',
        emptyStateSub: 'Erstelle eine neue Liste, um deine Favoriten zu finden.',
        compareBarTitle: '{count} Listen ausgewählt',
        modalNewTitle: 'Neue Namensliste',
        modalNewSub: 'Namen auswählen und im direkten Duell bewerten.',
        rerankBtn: '🔁 Neu Ordnen',
        rankedStatus: 'Fertig',
        setupStatus: 'Entwurf',
        comparisonArena: 'Namen Bewerten',
        resultsComplete: 'Alles Fertig!',
        rankedFavoritesTitle: 'Deine Top-Namen',
        rankedFavoritesSub: 'Überprüfe deine Liste und lösche die Namen, die dir nicht gefallen.',
        removedNamesTitle: 'Übersprungene Namen',
        rerankRemainingBtn: 'Verbleibende Namen neu ordnen →',
        consensusTitle: 'Eure Matches',
        consensusSub: 'Vergleicht eure Listen und findet Namen, die ihr beide liebt.',
        selectSessionPrompt: 'Liste auswählen...',
        noRankedSessions: 'Keine fertigen Listen in dieser Kategorie gefunden.',
        colRank: 'Match',
        statusTopMutual: 'Top-Match',
        statusStrongAgree: 'Starkes Match',
        statusModerateAgree: 'Gutes Match',
        statusDivergence: 'Kein Match',
        noMutualNames: 'Keine gemeinsamen Namen in diesen Listen gefunden.'
    },
    ar: {
        newSessionBtn: 'قائمة جديدة',
        emptyStateTitle: 'لا توجد قوائم بعد',
        emptyStateSub: 'ابدأ قائمة جديدة للعثور على أسمائك المفضلة.',
        compareBarTitle: 'تم تحديد {count} قوائم',
        modalNewTitle: 'قائمة أسماء جديدة',
        modalNewSub: 'اختر الأسماء ورتبها في مقارنات ثنائية.',
        rerankBtn: '🔁 ترتيب من جديد',
        rankedStatus: 'مكتمل',
        setupStatus: 'مسودة',
        comparisonArena: 'رتب أسماءك',
        resultsComplete: 'جاهز!',
        rankedFavoritesTitle: 'أفضل أسمائك',
        rankedFavoritesSub: 'راجع ترتيبك النهائي أو احذف الأسماء التي لا تعجبك.',
        removedNamesTitle: 'الأسماء المستبعدة',
        rerankRemainingBtn: 'ترتيب الأسماء المتبقية ←',
        consensusTitle: 'تطابقاتكم',
        consensusSub: 'قارنا بين قوائمكما لمعرفة الأسماء التي تعجبكما معاً.',
        selectSessionPrompt: 'اختر قائمة...',
        noRankedSessions: 'لا توجد قوائم مكتملة في هذه الفئة.',
        colRank: 'تطابق',
        statusTopMutual: 'أفضل تطابق',
        statusStrongAgree: 'تطابق قوي',
        statusModerateAgree: 'تطابق جيد',
        statusDivergence: 'لا يوجد تطابق',
        noMutualNames: 'لا توجد أسماء مشتركة بين هذه القوائم.'
    }
};

let lines = content.split('\n');
let currentLang = '';
let newLines = [];

for (let line of lines) {
    let langMatch = line.match(/^\s+([a-z]{2}):\s*\{/);
    if (langMatch) {
        currentLang = langMatch[1];
    }
    
    if (currentLang && replacements[currentLang]) {
        let replaced = false;
        for (const [key, val] of Object.entries(replacements[currentLang])) {
            let regex = new RegExp(`^(\\s+${key}:\\s*['"])(.*?)(['"],?)$`);
            if (regex.test(line)) {
                // Escape quotes in the new value
                let safeVal = val.replace(/'/g, "\\'");
                line = line.replace(regex, `$1${safeVal}$3`);
                replaced = true;
                break;
            }
        }
    }
    newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
console.log('Done.');
