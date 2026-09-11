/* =========================================
   QWERTYn't - TIMER MODULE
========================================= */

let startTime = null;
let elapsedTime = 0;
let timerRunning = false;
let timerInterval = null;
let timerMode = "stopwatch"; // "stopwatch" or "countdown"
let targetDuration = 30; // seconds for countdown
let onTimerExpireCallback = null;

function setTimerMode(mode, duration = 30) {
    timerMode = mode;
    targetDuration = duration;
}

function setTimerExpireCallback(callback) {
    onTimerExpireCallback = callback;
}

function startTimer() {
    if (timerRunning) return;

    startTime = Date.now() - elapsedTime;
    timerRunning = true;

    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    if (!timerRunning) return;

    elapsedTime = Date.now() - startTime;
    const seconds = elapsedTime / 1000;

    if (timerMode === "countdown") {
        const remaining = Math.max(0, targetDuration - seconds);
        if (remaining <= 0) {
            stopTimer();
            if (typeof onTimerExpireCallback === "function") {
                onTimerExpireCallback();
            }
        }
    }
}

function stopTimer() {
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    startTime = null;
    elapsedTime = 0;
}

function getElapsedSeconds() {
    return elapsedTime / 1000;
}

function getRemainingSeconds() {
    if (timerMode === "countdown") {
        return Math.max(0, targetDuration - (elapsedTime / 1000));
    }
    return 0;
}

window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.resetTimer = resetTimer;
window.setTimerMode = setTimerMode;
window.setTimerExpireCallback = setTimerExpireCallback;
window.getElapsedSeconds = getElapsedSeconds;
window.getRemainingSeconds = getRemainingSeconds;