/**
 * Baby Name Ranker — Shared Storage & Security Module
 * All state lives in localStorage under the "babynamer:" prefix.
 * No backend. Fully stateless from the server's perspective.
 */

const STORAGE_KEY = 'babynamer:sessions';

// ─── Curated Starter Packs (Popular Dutch Names) ────────────
const STARTER_PACKS = {
    Dutch: {
        Girls: ['Emma', 'Julia', 'Mila', 'Tess', 'Sophie', 'Zoë', 'Sara', 'Nora', 'Yara', 'Eva', 'Liv', 'Lotte', 'Olivia', 'Noor', 'Fleur', 'Lynn', 'Milou', 'Saar', 'Lauren', 'Nola', 'Isa', 'Lyn', 'Jade', 'Lieke', 'Lana', 'Evi', 'Maud', 'Lieve', 'Mette', 'Linde', 'Vivian', 'Yentl', 'Naomi', 'Nuna', 'Sterre', 'Yenthe', 'Stevie', 'Wies', 'Juna', 'Yente', 'Bente', 'Fenna', 'Roos', 'Luna', 'Vera', 'Elena', 'Elin', 'Fien', 'Nova', 'Puck', 'Maaike', 'Sanne', 'Lisa', 'Anouk', 'Romy', 'Femke', 'Esmee', 'Tessa', 'Daphne', 'Anne'],
        Boys: ['Noah', 'Liam', 'Lucas', 'Sem', 'Daan', 'Finn', 'Levi', 'Milan', 'James', 'Jesse', 'Luuk', 'Bram', 'Sam', 'Mees', 'Mason', 'Noud', 'Adam', 'Mats', 'Gijs', 'Zayn', 'Boas', 'Fedde', 'Elias', 'Ezra', 'Sebas', 'Olaf', 'Thijs', 'Julian', 'Lars', 'Guus', 'Cas', 'Hugo', 'Teun', 'Ruben', 'Stijn', 'Floris', 'Jens', 'Jack', 'Ties', 'Dex', 'Morris', 'Tobias', 'Otis', 'Mick', 'David', 'Arthur', 'Boris', 'Dean', 'Benjamin', 'Joep', 'Jelle', 'Tim', 'Max', 'Tom', 'Bas', 'Dirk', 'Sven', 'Jeroen', 'Koen', 'Pim'],
        Unisex: ['Sam', 'Robin', 'Charlie', 'Bo', 'Dani', 'Senna', 'Noa', 'Lou', 'Jip', 'Mika', 'Bobby', 'Riley', 'Quinn', 'Bowie', 'Mex', 'Puck', 'River', 'Sasha', 'Rene', 'Alex', 'Teddy', 'Morgan', 'Sky', 'Storm', 'Jessie', 'Eden', 'Rowan', 'Kaj', 'Renée', 'Harper', 'Isa', 'Pip', 'Daan', 'Sen', 'Dion', 'Anne', 'Marly', 'Lennox', 'Skyler', 'Jody']
    },
    Arabic: {
        Girls: ['Fatima', 'Aisha', 'Zainab', 'Maryam', 'Khadija', 'Leila', 'Nour', 'Amina', 'Yasmine', 'Salma', 'Amira', 'Farah', 'Malak', 'Rania', 'Hana', 'Lina', 'Sara', 'Aya', 'Huda', 'Nadia', 'Maha', 'Dina', 'Layla', 'Rima', 'Safa', 'Zahra', 'Hala', 'Mona', 'Reem', 'Sana', 'Danya', 'Samira', 'Jana', 'Tala', 'Ruba', 'Shaima', 'Safiya', 'Ruqayya', 'Hafsa', 'Asma', 'Jamila', 'Kawtar', 'Latifa', 'Maysa', 'Nabila', 'Oumaima', 'Rahma', 'Soumaya', 'Wafa', 'Zina'],
        Boys: ['Muhammad', 'Ahmed', 'Ali', 'Omar', 'Youssef', 'Hassan', 'Hussein', 'Ibrahim', 'Mahmoud', 'Tariq', 'Zaid', 'Amir', 'Hamza', 'Karim', 'Khalid', 'Mustafa', 'Nabil', 'Osama', 'Rami', 'Sami', 'Tarek', 'Walid', 'Yahya', 'Zakaria', 'Abdullah', 'Abdul', 'Adel', 'Akram', 'Ayman', 'Bassam', 'Bilal', 'Fadi', 'Fares', 'Hadi', 'Hassan', 'Hesham', 'Imad', 'Jalal', 'Jamal', 'Kamal', 'Majed', 'Marwan', 'Mounir', 'Nader', 'Nasir', 'Riyad', 'Saad', 'Saleh', 'Tamer', 'Ziad'],
        Unisex: ['Nour', 'Amal', 'Wissam', 'Rayan', 'Iman', 'Safa', 'Marwa', 'Ihsan', 'Nidal', 'Zain', 'Bayan', 'Farah', 'Rida', 'Salam', 'Widad', 'Malak', 'Sabah', 'Fida', 'Doha', 'Majd', 'Dia', 'Naseem', 'Saja', 'Areej', 'Hiba', 'Kawthar', 'Afaf', 'Sahar', 'Suha', 'Wafa']
    },
    English: {
        Girls: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett', 'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie', 'Lily', 'Nova', 'Isla', 'Grace', 'Violet', 'Aurora', 'Riley', 'Zoey', 'Willow', 'Emilia', 'Stella', 'Zoe', 'Victoria', 'Hannah', 'Lucy', 'Elara', 'Sadie', 'Josephine', 'Autumn', 'Ruby'],
        Boys: ['Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Theodore', 'Jack', 'Levi', 'Alexander', 'Jackson', 'Mateo', 'Daniel', 'Michael', 'Mason', 'Sebastian', 'Ethan', 'Logan', 'Owen', 'Samuel', 'Jacob', 'Asher', 'Aiden', 'John', 'Joseph', 'Wyatt', 'David', 'Leo', 'Luke', 'Julian', 'Hudson', 'Grayson', 'Matthew', 'Ezra', 'Gabriel', 'Carter', 'Isaac', 'Jayden', 'Luca', 'Anthony', 'Dylan', 'Lincoln', 'Thomas', 'Maverick', 'Josiah', 'Charles', 'Caleb'],
        Unisex: ['Riley', 'Rowan', 'Charlie', 'Emerson', 'Finley', 'River', 'Avery', 'Quinn', 'Peyton', 'Skyler', 'Taylor', 'Jordan', 'Cameron', 'Dylan', 'Eden', 'Hayden', 'Parker', 'Dakota', 'Reese', 'Kendall', 'Morgan', 'Spencer', 'Rory', 'Teagan', 'Sage', 'Hunter', 'Logan', 'Micah', 'Phoenix', 'Blake']
    },
    French: {
        Girls: ['Louise', 'Jade', 'Ambre', 'Alba', 'Emma', 'Rose', 'Alice', 'Romy', 'Anna', 'Lina', 'Léna', 'Mia', 'Lou', 'Julia', 'Chloé', 'Alma', 'Agathe', 'Iris', 'Inès', 'Léa', 'Léonie', 'Juliette', 'Jeanne', 'Nina', 'Eva', 'Lola', 'Victoire', 'Adèle', 'Manon', 'Zoé', 'Camille', 'Margaux', 'Romane', 'Lucie', 'Charlotte', 'Olivia', 'Alix', 'Clémence', 'Louna', 'Mathilde', 'Célia', 'Amélia', 'Mila', 'Lila', 'Maëlys', 'Éden', 'Giulia', 'Lya', 'Margot', 'Victoria'],
        Boys: ['Gabriel', 'Léo', 'Raphaël', 'Maël', 'Louis', 'Noah', 'Jules', 'Arthur', 'Adam', 'Lucas', 'Liam', 'Sacha', 'Isaac', 'Gabin', 'Éden', 'Hugo', 'Naël', 'Malo', 'Noé', 'Paul', 'Léon', 'Victor', 'Aaron', 'Nino', 'Mathis', 'Ayden', 'Tom', 'Robin', 'Enzo', 'Gaspard', 'Tiago', 'Ethan', 'Martin', 'Marius', 'Théo', 'Côme', 'Antoine', 'Lyam', 'Marceau', 'Augustin', 'Axel', 'Evan', 'Nathanaël', 'Timéo', 'Clément', 'Milo', 'Valentin', 'Maxence', 'Eliott', 'Oscar'],
        Unisex: ['Camille', 'Charlie', 'Sacha', 'Lou', 'Eden', 'Léonie', 'Andrea', 'Alix', 'Noa', 'Thaïs', 'Maël', 'Elie', 'Swann', 'Loïc', 'Gaby', 'Ariel', 'Max', 'Sasha', 'Malo', 'Ange', 'Yael', 'Lison', 'Morgan', 'Jude', 'Candice', 'Joa', 'Anaé', 'Meryl', 'Céleste', 'Doris']
    },
    Spanish: {
        Girls: ['Lucia', 'Sofia', 'Martina', 'Maria', 'Julia', 'Paula', 'Valeria', 'Emma', 'Alejandra', 'Alba', 'Noa', 'Carmen', 'Daniela', 'Carla', 'Alma', 'Olivia', 'Sara', 'Lola', 'Vega', 'Mia', 'Chloe', 'Ana', 'Elena', 'Valentina', 'Candela', 'Triana', 'Aitana', 'Laia', 'Vera', 'Adriana', 'Blanca', 'Marina', 'Marta', 'Ines', 'Gala', 'Carlota', 'Irene', 'Victoria', 'Clara', 'Rocio', 'Alicia', 'Celia', 'Eva', 'Lia', 'Isabel', 'Nora', 'Diana', 'Berta', 'Cloe', 'Jimena'],
        Boys: ['Martin', 'Hugo', 'Mateo', 'Leo', 'Lucas', 'Manuel', 'Daniel', 'Alejandro', 'Pablo', 'Enzo', 'Alvaro', 'Mario', 'Diego', 'Adrian', 'Thiago', 'Izan', 'David', 'Bruno', 'Oliver', 'Marcos', 'Nicolas', 'Alex', 'Javier', 'Carlos', 'Dylan', 'Gael', 'Juan', 'Marc', 'Gonzalo', 'Gabriel', 'Marco', 'Liam', 'Luca', 'Antonio', 'Miguel', 'Jose', 'Hector', 'Luis', 'Sergio', 'Jorge', 'Samuel', 'Victor', 'Iker', 'Eric', 'Guillermo', 'Ruben', 'Pau', 'Adam', 'Ivan', 'Joel'],
        Unisex: ['Alex', 'Andrea', 'Dani', 'Cris', 'Gael', 'Pau', 'Rene', 'Noa', 'Cruz', 'Milan', 'Paris', 'Reyes', 'Sol', 'Trinidad', 'Asuncion', 'Consuelo', 'Guadalupe', 'Milagros', 'Nieves', 'Paz', 'Pilar', 'Rosario', 'Belen', 'Carmen', 'Luz', 'Rocio', 'Amparo', 'Angeles', 'Mar', 'Estrella']
    },
    Nordic: {
        Girls: ['Astrid', 'Freja', 'Saga', 'Ida', 'Ebba', 'Alice', 'Maja', 'Elsa', 'Klara', 'Ella', 'Alma', 'Lilly', 'Agnes', 'Olivia', 'Signe', 'Elin', 'Linnea', 'Vera', 'Selma', 'Stella', 'Ines', 'Nova', 'Sofia', 'Isabella', 'Nora', 'Alva', 'Lea', 'Alicia', 'Sigrid', 'Amelia', 'Liv', 'Ellie', 'Tilde', 'Matilda', 'Ester', 'Molly', 'Tyra', 'Iris', 'Evelina', 'Svea', 'Cornelia', 'Emma', 'Julie', 'Tilda', 'Lova', 'Meja', 'Siri', 'Luna', 'Vilda', 'Hedda'],
        Boys: ['William', 'Liam', 'Noah', 'Hugo', 'Oliver', 'Lucas', 'Elias', 'Oscar', 'Matteo', 'Alexander', 'Nils', 'Walter', 'Isak', 'August', 'Leon', 'Olle', 'Ludvig', 'Vincent', 'Theo', 'Anton', 'Filip', 'Arvid', 'Axel', 'Elliot', 'Edvin', 'Benjamin', 'Charlie', 'Valter', 'Melvin', 'Albin', 'Alfred', 'Kasper', 'Josef', 'Harry', 'Viktor', 'Loke', 'Love', 'Otto', 'Mio', 'Adrian', 'Malte', 'Sixten', 'Emil', 'Ebbe', 'Sam', 'Vidar', 'Viggo', 'Arthur', 'Folke', 'Elton'],
        Unisex: ['Robin', 'Kim', 'Mika', 'Alex', 'Charlie', 'Lo', 'Sam', 'Vilde', 'Eli', 'Noa', 'Billie', 'Love', 'Sasha', 'Rene', 'Marion', 'Lee', 'Gry', 'Ilo', 'Vide', 'Mille']
    }
};

// ─── Security Helpers ────────────────────────────────────────

/**
 * Escapes characters to prevent HTML/XSS injection when rendering in DOM
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const s = String(str);
    return s.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

/**
 * Cryptographically secure ID generation
 */
function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function now() {
    return new Date().toISOString();
}

/**
 * Strict schema validation and sanitization for imported or stored sessions
 */
function validateSession(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

    // Check & sanitize ID
    let id = typeof raw.id === 'string' && raw.id.trim().length > 0
        ? raw.id.trim().slice(0, 100)
        : generateId();

    // Check & sanitize Person
    let person = typeof raw.person === 'string' ? raw.person.trim().slice(0, 60) : '';
    if (!person) return null;

    // Check & sanitize Category
    const allowedCats = ['Girls', 'Boys', 'Unisex'];
    let category = allowedCats.includes(raw.category) ? raw.category : 'Girls';

    // Helper to sanitize array of strings
    const cleanStringArray = (arr, maxItems = 200, maxLen = 60) => {
        if (!Array.isArray(arr)) return [];
        const result = [];
        const seen = new Set();
        for (const item of arr) {
            if (typeof item !== 'string') continue;
            const cleaned = item.trim().slice(0, maxLen);
            if (cleaned.length > 0 && !seen.has(cleaned)) {
                seen.add(cleaned);
                result.push(cleaned);
                if (result.length >= maxItems) break;
            }
        }
        return result;
    };

    const names = cleanStringArray(raw.names);
    if (names.length === 0) return null;

    const ranking = cleanStringArray(raw.ranking);
    const deleted = cleanStringArray(raw.deleted);

    const status = raw.status === 'ranked' ? 'ranked' : 'setup';
    const parentId = typeof raw.parentId === 'string' && raw.parentId.trim() ? raw.parentId.trim().slice(0, 100) : null;
    
    let round = Number.isInteger(raw.round) && raw.round >= 1 && raw.round <= 100 ? raw.round : 1;

    let createdAt = typeof raw.createdAt === 'string' && raw.createdAt.length <= 50 ? raw.createdAt : now();
    let updatedAt = typeof raw.updatedAt === 'string' && raw.updatedAt.length <= 50 ? raw.updatedAt : now();

    return {
        id,
        person,
        category,
        names,
        ranking,
        deleted,
        status,
        parentId,
        round,
        createdAt,
        updatedAt
    };
}

// ─── CRUD ────────────────────────────────────────────────────

function loadSessions() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(raw)) return [];
        return raw.map(validateSession).filter(Boolean);
    } catch {
        return [];
    }
}

function saveSessions(sessions) {
    const validated = Array.isArray(sessions) ? sessions.map(validateSession).filter(Boolean) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
}

function getSession(id) {
    if (!id || typeof id !== 'string') return null;
    return loadSessions().find(s => s.id === id) || null;
}

function saveSession(session) {
    const valid = validateSession(session);
    if (!valid) return;
    const sessions = loadSessions();
    const idx = sessions.findIndex(s => s.id === valid.id);
    valid.updatedAt = now();
    if (idx >= 0) {
        sessions[idx] = valid;
    } else {
        sessions.unshift(valid);
    }
    saveSessions(sessions);
}

function deleteSession(id) {
    if (!id || typeof id !== 'string') return;
    const sessions = loadSessions().filter(s => s.id !== id);
    saveSessions(sessions);
}

/**
 * Create a brand-new session object (not yet saved).
 */
function createSession({ person, category, names }) {
    const cleanNames = Array.isArray(names)
        ? names.map(n => typeof n === 'string' ? n.trim().slice(0, 60) : '').filter(Boolean)
        : [];

    return validateSession({
        id: generateId(),
        person: person ? String(person).trim().slice(0, 60) : '',
        category: category || 'Girls',
        names: [...new Set(cleanNames)],
        ranking: [],
        deleted: [],
        status: 'setup',
        parentId: null,
        round: 1,
        createdAt: now(),
        updatedAt: now(),
    });
}

/**
 * Create a re-rank session from an existing ranked session.
 * Uses only the non-deleted names from the parent's ranking.
 */
function createReRankSession(parentSession) {
    const activeNames = parentSession.ranking.filter(
        n => !parentSession.deleted.includes(n)
    );
    const child = createSession({
        person: parentSession.person,
        category: parentSession.category,
        names: activeNames,
    });
    child.parentId = parentSession.id;
    child.round = (parentSession.round || 1) + 1;
    return child;
}

/**
 * Format sessions export payload
 */
function createExportData(sessionsToExport = null) {
    const sessions = sessionsToExport || loadSessions();
    return {
        version: 1,
        appName: 'BabyNameRanker',
        exportedAt: now(),
        sessions: sessions.map(validateSession).filter(Boolean)
    };
}

// ─── Export as global (no bundler needed) ────────────────────

window.BNR = {
    loadSessions,
    saveSessions,
    getSession,
    saveSession,
    deleteSession,
    createSession,
    createReRankSession,
    generateId,
    validateSession,
    escapeHtml,
    createExportData,
    STARTER_PACKS
};
