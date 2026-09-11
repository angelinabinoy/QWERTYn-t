/* =========================================
   QWERTYn't - KEY MAPPER
========================================= */

// Physical QWERTY key -> Alphabetical Output
const letterMapping = {
    q: "a", w: "b", e: "c", r: "d", t: "e", y: "f", u: "g", i: "h", o: "i", p: "j",
    a: "k", s: "l", d: "m", f: "n", g: "o", h: "p", j: "q", k: "r", l: "s",
    z: "t", x: "u", c: "v", v: "w", b: "x", n: "y", m: "z"
};

// Physical Number key -> Reversed Number Output
const numberMapping = {
    "1": "0", "2": "9", "3": "8", "4": "7", "5": "6",
    "6": "5", "7": "4", "8": "3", "9": "2", "0": "1"
};

// Shifted number symbols mapped in reverse
const shiftedNumberMapping = {
    "!": ")", "@": "(", "#": "*", "$": "&", "%": "^",
    "^": "%", "&": "$", "*": "#", "(": "@", ")": "!"
};

// Reverse lookup maps (Mapped Output -> Physical Key)
const reverseLetterMapping = {};
for (const [phys, mapped] of Object.entries(letterMapping)) {
    reverseLetterMapping[mapped] = phys;
}

const reverseNumberMapping = {};
for (const [phys, mapped] of Object.entries(numberMapping)) {
    reverseNumberMapping[mapped] = phys;
}

/**
 * Returns the remapped output character for a given physical key press
 */
function getMappedCharacter(key, shiftPressed = false) {
    if (!key) return "";

    const lowerKey = key.toLowerCase();

    // Letters
    if (letterMapping[lowerKey]) {
        let mapped = letterMapping[lowerKey];
        return shiftPressed ? mapped.toUpperCase() : mapped;
    }

    // Numbers
    if (numberMapping[key]) {
        return numberMapping[key];
    }

    // Shifted Numbers
    if (shiftedNumberMapping[key]) {
        return shiftedNumberMapping[key];
    }

    // Space & Control keys
    if (key === " ") return " ";
    if (key === "Enter") return "\n";

    // Punctuation and other allowed keys pass through
    return key;
}

/**
 * Given a mapped output character, get the physical key code/char that triggers it
 */
function getPhysicalKeyForMapped(mappedChar) {
    if (!mappedChar) return null;
    const lower = mappedChar.toLowerCase();
    if (reverseLetterMapping[lower]) {
        return reverseLetterMapping[lower];
    }
    if (reverseNumberMapping[mappedChar]) {
        return reverseNumberMapping[mappedChar];
    }
    return mappedChar;
}

// Export for global access
window.letterMapping = letterMapping;
window.numberMapping = numberMapping;
window.reverseLetterMapping = reverseLetterMapping;
window.reverseNumberMapping = reverseNumberMapping;
window.getMappedCharacter = getMappedCharacter;
window.getPhysicalKeyForMapped = getPhysicalKeyForMapped;