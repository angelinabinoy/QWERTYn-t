let totalTyped = 0;
let correctCharacters = 0;
let incorrectCharacters = 0;

function resetStatistics() {

    totalTyped = 0;
    correctCharacters = 0;
    incorrectCharacters = 0;
}

function recordCharacter(isCorrect) {

    totalTyped++;

    if (isCorrect) {
        correctCharacters++;
    } else {
        incorrectCharacters++;
    }
}

function getAccuracy() {

    if (totalTyped === 0) {
        return 100;
    }

    return (correctCharacters / totalTyped) * 100;
}

function getWPM() {

    const elapsedSeconds = getElapsedSeconds();

    if (elapsedSeconds <= 0) {
        return 0;
    }

    /*
        Standard typing calculation:
        5 characters = 1 word
    */

    const words = correctCharacters / 5;
    const minutes = elapsedSeconds / 60;

    return words / minutes;
}

function getStatistics() {

    return {
        typed: totalTyped,
        correct: correctCharacters,
        incorrect: incorrectCharacters,
        accuracy: getAccuracy(),
        wpm: getWPM()
    };
}