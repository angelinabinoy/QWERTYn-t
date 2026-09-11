/* =========================================
   QWERTYn't - STATISTICS ENGINE
========================================= */

let totalTyped = 0;
let correctCharacters = 0;
let incorrectCharacters = 0;
let targetTotalChars = 0;
let isCompleted = false;
let userGaveUp = false;

// Second-by-second timeline history for results graph
let timelineData = []; // Array of { second, wpm, rawWpm, errors }
let timelineInterval = null;

function resetStatistics(targetChars = 0) {
    totalTyped = 0;
    correctCharacters = 0;
    incorrectCharacters = 0;
    targetTotalChars = targetChars;
    isCompleted = false;
    userGaveUp = false;
    timelineData = [];

    if (timelineInterval) {
        clearInterval(timelineInterval);
        timelineInterval = null;
    }
}

function startTimelineTracking() {
    if (timelineInterval) clearInterval(timelineInterval);

    timelineInterval = setInterval(() => {
        const sec = Math.max(1, Math.floor(getElapsedSeconds()));
        const currentStats = getStatistics();
        timelineData.push({
            second: sec,
            wpm: Math.round(currentStats.wpm),
            rawWpm: Math.round(currentStats.rawWpm),
            errors: currentStats.incorrect
        });
    }, 1000);
}

function stopTimelineTracking() {
    if (timelineInterval) {
        clearInterval(timelineInterval);
        timelineInterval = null;
    }
}

function recordCharacter(isCorrect) {
    totalTyped++;
    if (isCorrect) {
        correctCharacters++;
    } else {
        incorrectCharacters++;
    }
}

function setTestCompleted(completed, gaveUp = false) {
    isCompleted = completed;
    userGaveUp = gaveUp;
    stopTimelineTracking();
}

function getAccuracy() {
    if (totalTyped === 0) return 100;
    return (correctCharacters / totalTyped) * 100;
}

function getWPM() {
    const elapsedSeconds = getElapsedSeconds();
    if (elapsedSeconds <= 0) return 0;
    const words = correctCharacters / 5;
    const minutes = elapsedSeconds / 60;
    return words / minutes;
}

function getRawWPM() {
    const elapsedSeconds = getElapsedSeconds();
    if (elapsedSeconds <= 0) return 0;
    const words = totalTyped / 5;
    const minutes = elapsedSeconds / 60;
    return words / minutes;
}

function getProgressPercent() {
    if (targetTotalChars <= 0) return 0;
    return Math.min(100, Math.round((correctCharacters / targetTotalChars) * 100));
}

/**
 * Returns formatted object for final Monkeytype-style results screen
 * mapped to required user markings:
 * 1. Accuracy -> Keyboard Trust Level
 * 2. Errors -> Victims
 * 3. Time -> Time Wasted
 * 4. Progress -> Pointlessness Progress
 * 5. Completion -> You Actually Finished This?
 */
function getStatistics() {
    const accuracyVal = getAccuracy();
    const elapsed = getElapsedSeconds();
    const progressVal = getProgressPercent();

    // Trust level rating generator
    let trustLabel = "100% (Naive Trust)";
    if (accuracyVal < 100 && accuracyVal >= 90) trustLabel = `${accuracyVal.toFixed(1)}% (Mild Suspicion)`;
    else if (accuracyVal >= 75) trustLabel = `${accuracyVal.toFixed(1)}% (Severe Distrust)`;
    else if (accuracyVal >= 50) trustLabel = `${accuracyVal.toFixed(1)}% (Keyboard Mutiny)`;
    else trustLabel = `${accuracyVal.toFixed(1)}% (Total Betrayal)`;

    // Completion label
    let completionLabel = "NO - Gave Up";
    if (isCompleted) {
        completionLabel = "YES - Unbelievable!";
    } else if (userGaveUp) {
        completionLabel = "NO - Rage Quit";
    } else if (elapsed > 0) {
        completionLabel = `PARTIAL (${progressVal}%)`;
    }

    return {
        typed: totalTyped,
        correct: correctCharacters,
        incorrect: incorrectCharacters, // "Victims"
        accuracy: accuracyVal,          // "Keyboard Trust Level"
        accuracyText: trustLabel,
        wpm: getWPM(),
        rawWpm: getRawWPM(),
        timeWasted: elapsed,           // "Time Wasted"
        progressPercent: progressVal,  // "Pointlessness Progress"
        completionText: completionLabel, // "You Actually Finished This?"
        timeline: timelineData
    };
}

window.resetStatistics = resetStatistics;
window.startTimelineTracking = startTimelineTracking;
window.stopTimelineTracking = stopTimelineTracking;
window.recordCharacter = recordCharacter;
window.setTestCompleted = setTestCompleted;
window.getAccuracy = getAccuracy;
window.getWPM = getWPM;
window.getRawWPM = getRawWPM;
window.getStatistics = getStatistics;