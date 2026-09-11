/* =========================================
   QWERTYn't - TYPING ENGINE (MONKEYTYPE UX)
========================================= */

let challengeStarted = false;
let testFinished = false;
let targetWordsList = [];
let wordIndex = 0;
let charIndex = 0;
let audioCtx = null;
let soundEnabled = true;

/**
 * Audio Synthesizer for Mechanical Keyboard Sound Effects
 */
function playKeyClickSound(isError = false) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (isError) {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else {
            osc.type = "sine";
            osc.frequency.setValueAtTime(1400 + Math.random() * 300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        }
    } catch (e) {
        // Audio fallback
    }
}

/**
 * Initialize a new typing test with given options
 */
function initializeTypingTest(options = {}) {
    const text = startChallenge(options);
    targetWordsList = text.trim().split(/\s+/);

    wordIndex = 0;
    charIndex = 0;
    challengeStarted = false;
    testFinished = false;

    // Total target characters calculation
    const totalChars = targetWordsList.join(" ").length;
    resetStatistics(totalChars);
    resetTimer();

    // Render Monkeytype Words DOM
    renderWordsDOM();
    updateCaretPosition();
}

/**
 * Render words container DOM with spans for words and characters
 */
function renderWordsDOM() {
    const wordsContainer = document.getElementById("wordsContainer");
    if (!wordsContainer) return;

    wordsContainer.innerHTML = "";

    targetWordsList.forEach((wordStr, wIdx) => {
        const wordEl = document.createElement("div");
        wordEl.className = "word";
        wordEl.dataset.wordIndex = wIdx;

        for (let cIdx = 0; cIdx < wordStr.length; cIdx++) {
            const charSpan = document.createElement("span");
            charSpan.className = "char";
            charSpan.textContent = wordStr[cIdx];
            charSpan.dataset.charIndex = cIdx;
            wordEl.appendChild(charSpan);
        }

        wordsContainer.appendChild(wordEl);
    });

    // Ensure caret element exists inside words container
    let caret = document.getElementById("caret");
    if (!caret) {
        caret = document.createElement("div");
        caret.id = "caret";
        caret.className = "caret";
        wordsContainer.appendChild(caret);
    }
}

/**
 * Update the dynamic position of the smooth caret element
 */
function updateCaretPosition() {
    const caret = document.getElementById("caret");
    const wordsContainer = document.getElementById("wordsContainer");
    if (!caret || !wordsContainer) return;

    const currentWordEl = wordsContainer.querySelector(`.word[data-word-index="${wordIndex}"]`);
    if (!currentWordEl) return;

    const charSpans = currentWordEl.querySelectorAll(".char");
    let targetRect = null;

    if (charIndex < charSpans.length) {
        targetRect = charSpans[charIndex].getBoundingClientRect();
    } else if (charSpans.length > 0) {
        const lastCharRect = charSpans[charSpans.length - 1].getBoundingClientRect();
        targetRect = {
            left: lastCharRect.right,
            top: lastCharRect.top,
            height: lastCharRect.height
        };
    } else {
        targetRect = currentWordEl.getBoundingClientRect();
    }

    const containerRect = wordsContainer.getBoundingClientRect();
    const relativeLeft = targetRect.left - containerRect.left;
    const relativeTop = targetRect.top - containerRect.top;

    caret.style.transform = `translate(${relativeLeft}px, ${relativeTop}px)`;
    caret.style.height = `${targetRect.height || 24}px`;

    // Active word highlight
    const allWords = wordsContainer.querySelectorAll(".word");
    allWords.forEach((w, idx) => {
        w.classList.toggle("active-word", idx === wordIndex);
    });
}

/**
 * Process a typed character from keyboard mapping engine
 */
function processTypedCharacter(mappedChar) {
    if (testFinished) return;

    if (!challengeStarted) {
        challengeStarted = true;
        startTimer();
        startTimelineTracking();
    }

    const wordsContainer = document.getElementById("wordsContainer");
    if (!wordsContainer) return;

    const currentWordEl = wordsContainer.querySelector(`.word[data-word-index="${wordIndex}"]`);
    if (!currentWordEl) return;

    const targetWord = targetWordsList[wordIndex];
    const charSpans = currentWordEl.querySelectorAll(".char:not(.extra)");

    // SPACE BAR pressed -> Jump to next word
    if (mappedChar === " ") {
        if (charIndex === 0) return; // Ignore space at start of word

        // Mark remaining untyped chars as incorrect
        for (let i = charIndex; i < charSpans.length; i++) {
            charSpans[i].classList.add("incorrect");
            recordCharacter(false);
        }

        playKeyClickSound(false);

        wordIndex++;
        charIndex = 0;

        if (wordIndex >= targetWordsList.length) {
            finishChallenge(true);
            return;
        }

        updateCaretPosition();
        updateLiveStatsHUD();
        return;
    }

    // Normal Character processing
    if (charIndex < targetWord.length) {
        const expectedChar = targetWord[charIndex];
        const isCorrect = (mappedChar === expectedChar);

        recordCharacter(isCorrect);
        playKeyClickSound(!isCorrect);

        const targetSpan = charSpans[charIndex];
        if (isCorrect) {
            targetSpan.classList.add("correct");
        } else {
            targetSpan.classList.add("incorrect");
        }

        charIndex++;
    } else {
        // Extra characters typed beyond word length
        if (currentWordEl.querySelectorAll(".extra").length < 8) {
            const extraSpan = document.createElement("span");
            extraSpan.className = "char extra incorrect";
            extraSpan.textContent = mappedChar;
            currentWordEl.appendChild(extraSpan);
            recordCharacter(false);
            playKeyClickSound(true);
            charIndex++;
        }
    }

    // Check if test is completely finished (last character of last word)
    if (wordIndex === targetWordsList.length - 1 && charIndex >= targetWord.length) {
        // Small timeout to show completed character before ending
        setTimeout(() => {
            finishChallenge(true);
        }, 10);
    }

    updateCaretPosition();
    updateLiveStatsHUD();
}

/**
 * Handle Backspace key
 */
function handleBackspaceKey() {
    if (testFinished) return;

    const wordsContainer = document.getElementById("wordsContainer");
    if (!wordsContainer) return;

    const currentWordEl = wordsContainer.querySelector(`.word[data-word-index="${wordIndex}"]`);
    if (!currentWordEl) return;

    // Check for extra chars first
    const extraSpans = currentWordEl.querySelectorAll(".extra");
    if (extraSpans.length > 0) {
        const lastExtra = extraSpans[extraSpans.length - 1];
        lastExtra.remove();
        charIndex--;
        updateCaretPosition();
        return;
    }

    if (charIndex > 0) {
        charIndex--;
        const charSpans = currentWordEl.querySelectorAll(".char:not(.extra)");
        if (charSpans[charIndex]) {
            charSpans[charIndex].className = "char";
        }
    } else if (wordIndex > 0) {
        // Backspace to previous word if there were errors
        const prevWordEl = wordsContainer.querySelector(`.word[data-word-index="${wordIndex - 1}"]`);
        if (prevWordEl) {
            const hasErrors = prevWordEl.querySelector(".incorrect");
            if (hasErrors) {
                wordIndex--;
                const prevCharSpans = prevWordEl.querySelectorAll(".char");
                charIndex = prevCharSpans.length;
                updateCaretPosition();
            }
        }
    }

    updateCaretPosition();
}

/**
 * Update live statistics display in HUD header
 */
function updateLiveStatsHUD() {
    const liveWpmEl = document.getElementById("liveWpm");
    const liveAccEl = document.getElementById("liveAcc");
    const liveProgressEl = document.getElementById("liveProgress");

    if (liveWpmEl) liveWpmEl.textContent = Math.round(getWPM());
    if (liveAccEl) liveAccEl.textContent = `${Math.round(getAccuracy())}%`;
    if (liveProgressEl) liveProgressEl.textContent = `${getProgressPercent()}%`;
}

/**
 * Finish challenge and display final humorous Monkeytype results modal
 */
function finishChallenge(completed = true) {
    if (testFinished) return;
    testFinished = true;

    stopTimer();
    setTestCompleted(completed);

    const stats = getStatistics();
    showResultsModal(stats);
}

function setSoundEnabled(enabled) {
    soundEnabled = enabled;
}

window.initializeTypingTest = initializeTypingTest;
window.processTypedCharacter = processTypedCharacter;
window.handleBackspaceKey = handleBackspaceKey;
window.finishChallenge = finishChallenge;
window.setSoundEnabled = setSoundEnabled;