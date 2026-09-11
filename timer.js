let startTime = null;
let elapsedTime = 0;
let timerRunning = false;
let timerInterval = null;

function startTimer() {

    if (timerRunning) {
        return;
    }

    startTime = Date.now() - elapsedTime;
    timerRunning = true;

    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {

    if (!timerRunning) {
        return;
    }

    elapsedTime = Date.now() - startTime;
}

function stopTimer() {

    timerRunning = false;

    clearInterval(timerInterval);
}

function resetTimer() {

    stopTimer();

    startTime = null;
    elapsedTime = 0;
}

function getElapsedSeconds() {

    return elapsedTime / 1000;
}