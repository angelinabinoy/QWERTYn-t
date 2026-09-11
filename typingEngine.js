let challengePosition = 0;
let challengeStarted = false;

function initializeTypingTest() {

    currentChallenge = startChallenge();

    challengePosition = 0;
    challengeStarted = false;

    resetStatistics();
    resetTimer();

    updateChallengeDisplay();
}

function updateChallengeDisplay() {

    const challengeElement =
        document.getElementById("challenge");

    if (!challengeElement) {
        return;
    }

    challengeElement.textContent = currentChallenge;
}

function processTypedCharacter(character) {

    if (!challengeStarted) {

        challengeStarted = true;

        startTimer();
    }

    const expectedCharacter =
        currentChallenge[challengePosition];

    const isCorrect =
        character === expectedCharacter;

    recordCharacter(isCorrect);

    challengePosition++;

    /*
        Challenge completed
    */

    if (challengePosition >= currentChallenge.length) {

        finishChallenge();

        return;
    }

    return isCorrect;
}

function finishChallenge() {

    stopTimer();

    const stats = getStatistics();

    console.log("Challenge completed!");
    console.log("WPM:", stats.wpm.toFixed(2));
    console.log("Accuracy:", stats.accuracy.toFixed(2) + "%");

    /*
        Start another challenge after a short delay
    */

    setTimeout(() => {

        currentChallenge = getRandomChallenge();

        challengePosition = 0;
        challengeStarted = false;

        resetStatistics();
        resetTimer();

        updateChallengeDisplay();

    }, 1000);
}