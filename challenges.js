/* =========================================
   QWERTYn't - CHALLENGES & WORD BANKS
========================================= */

const commonWords = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    "keyboard", "typing", "alphabet", "reverse", "qwerty", "trust", "brain", "victim",
    "chaos", "remap", "order", "system", "monkey", "challenge", "muscle", "memory",
    "scramble", "pointless", "frustration", "wasted", "finish", "attempt", "struggle"
];

const numberWords = [
    "10", "20", "30", "40", "50", "60", "70", "80", "90", "100",
    "1984", "2026", "1234", "9876", "555", "777", "007", "404", "500", "8080",
    "level1", "code9", "test0", "room42", "path7", "zone3", "unit8", "agent5"
];

const humorousQuotes = [
    "your muscle memory is now officially your worst enemy",
    "welcome to a typing experience designed purely to test your mental stability",
    "typing Q produces A and pressing 1 types 0 because sanity is overrated",
    "every single key you press is a betrayal of everything you learned in elementary school",
    "keyboard trust level dropping to zero faster than your typing speed",
    "if you complete this challenge without screaming you deserve an award",
    "physical key Q says hello from letter A while numbers count backward to oblivion",
    "why type normally when you can suffer in perfect alphabetical order",
    "pointlessness progress is rising with every misplaced finger",
    "congratulations on subjecting your fingers to absolute alphabetical anarchy"
];

/**
 * Generate a random sequence of words based on settings
 * @param {Object} options - { count: 25, includeNumbers: false, mode: 'words'|'quotes' }
 */
function generateChallengeText(options = {}) {
    const count = options.count || 25;
    const includeNumbers = options.includeNumbers || false;
    const mode = options.mode || 'words';

    if (mode === 'quote') {
        const randomIndex = Math.floor(Math.random() * humorousQuotes.length);
        return humorousQuotes[randomIndex];
    }

    let pool = [...commonWords];
    if (includeNumbers) {
        pool = pool.concat(numberWords);
    }

    const selected = [];
    for (let i = 0; i < count; i++) {
        const word = pool[Math.floor(Math.random() * pool.length)];
        selected.push(word);
    }

    return selected.join(" ");
}

let currentChallenge = "";

function getRandomChallenge() {
    return generateChallengeText({ count: 25, includeNumbers: false });
}

function startChallenge(options) {
    currentChallenge = generateChallengeText(options);
    return currentChallenge;
}

window.commonWords = commonWords;
window.numberWords = numberWords;
window.humorousQuotes = humorousQuotes;
window.generateChallengeText = generateChallengeText;
window.getRandomChallenge = getRandomChallenge;
window.startChallenge = startChallenge;