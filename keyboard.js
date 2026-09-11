const letterMapping = {
    q: "a",
    w: "b",
    e: "c",
    r: "d",
    t: "e",
    y: "f",
    u: "g",
    i: "h",
    o: "i",
    p: "j",

    a: "k",
    s: "l",
    d: "m",
    f: "n",
    g: "o",
    h: "p",
    j: "q",
    k: "r",
    l: "s",

    z: "t",
    x: "u",
    c: "v",
    v: "w",
    b: "x",
    n: "y",
    m: "z"
};

const numberMapping = {
    "1": "0",
    "2": "9",
    "3": "8",
    "4": "7",
    "5": "6",
    "6": "5",
    "7": "4",
    "8": "3",
    "9": "2",
    "0": "1"
};

function getMappedCharacter(key, shiftPressed = false) {

    const lowerKey = key.toLowerCase();

    // Letters
    if (letterMapping[lowerKey]) {

        let mapped = letterMapping[lowerKey];

        if (shiftPressed) {
            mapped = mapped.toUpperCase();
        }

        return mapped;
    }

    // Numbers
    if (numberMapping[key]) {
        return numberMapping[key];
    }

    // Space
    if (key === " ") {
        return " ";
    }

    // Enter
    if (key === "Enter") {
        return "\n";
    }

    // Punctuation and other allowed keys
    return key;
}