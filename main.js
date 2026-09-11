const output = document.getElementById("output");
const pressedKey = document.getElementById("pressedKey");
const mappedKey = document.getElementById("mappedKey");
const keyStatus = document.getElementById("keyStatus");
const characterCount = document.getElementById("characterCount");


/* =========================================
   CHARACTER COUNT
========================================= */

function updateCharacterCount() {

    const count = output.value.length;

    characterCount.textContent =
        `${count} ${count === 1 ? "character" : "characters"}`;
}


/* =========================================
   INPUT / OUTPUT DISPLAY
========================================= */

function updateKeyDisplay(input, mapped) {

    pressedKey.textContent =
        input === " " ? "SPACE" : input;

    if (mapped === " ") {

        mappedKey.textContent = "SPACE";

    } else if (mapped === "\n") {

        mappedKey.textContent = "↵";

    } else {

        mappedKey.textContent = mapped;
    }

    keyStatus.textContent = "KEY REMAPPED";
}


/* =========================================
   INSERT CHARACTER
========================================= */

function insertCharacter(character) {

    const start = output.selectionStart;
    const end = output.selectionEnd;

    const text = output.value;

    output.value =
        text.substring(0, start) +
        character +
        text.substring(end);

    const newPosition =
        start + character.length;

    output.selectionStart = newPosition;
    output.selectionEnd = newPosition;

    updateCharacterCount();
}


/* =========================================
   BACKSPACE
========================================= */

function handleBackspace() {

    const start = output.selectionStart;
    const end = output.selectionEnd;

    if (start !== end) {

        output.value =
            output.value.substring(0, start) +
            output.value.substring(end);

        output.selectionStart = start;
        output.selectionEnd = start;

    } else if (start > 0) {

        output.value =
            output.value.substring(0, start - 1) +
            output.value.substring(start);

        output.selectionStart = start - 1;
        output.selectionEnd = start - 1;
    }

    updateCharacterCount();

    pressedKey.textContent = "BACKSPACE";
    mappedKey.textContent = "⌫";

    keyStatus.textContent = "CHARACTER DELETED";
}


/* =========================================
   DELETE
========================================= */

function handleDelete() {

    const start = output.selectionStart;
    const end = output.selectionEnd;

    if (start !== end) {

        output.value =
            output.value.substring(0, start) +
            output.value.substring(end);

        output.selectionStart = start;
        output.selectionEnd = start;

    } else {

        output.value =
            output.value.substring(0, start) +
            output.value.substring(start + 1);
    }

    updateCharacterCount();

    pressedKey.textContent = "DELETE";
    mappedKey.textContent = "⌫";

    keyStatus.textContent = "CHARACTER DELETED";
}


/* =========================================
   PHYSICAL KEYBOARD
========================================= */

document.addEventListener("keydown", function(event) {

    /*
        Allow browser shortcuts
        Ctrl + C
        Ctrl + V
        Ctrl + A
        Ctrl + Z
    */

    if (event.ctrlKey || event.metaKey) {
        return;
    }


    /* BACKSPACE */

    if (event.key === "Backspace") {

        event.preventDefault();

        handleBackspace();

        return;
    }


    /* DELETE */

    if (event.key === "Delete") {

        event.preventDefault();

        handleDelete();

        return;
    }


    /*
        Modifier keys don't produce
        characters.
    */

    if (
        event.key === "Shift" ||
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "CapsLock" ||
        event.key === "Tab"
    ) {
        return;
    }


    /*
        Get QWERTYn't output
    */

    const mappedCharacter =
        getMappedCharacter(
            event.key,
            event.shiftKey
        );


    /*
        Stop the browser from inserting
        the original character.
    */

    event.preventDefault();


    /*
        Add remapped character
        to virtual Notepad.
    */

    insertCharacter(mappedCharacter);


    /*
        Check against challenge
    */

    processTypedCharacter(mappedCharacter);


    /*
        Update INPUT → OUTPUT cards
    */

    updateKeyDisplay(
        event.key,
        mappedCharacter
    );


    /*
        Keep textarea active
    */

    output.focus();
});


/* =========================================
   KEY RELEASE
========================================= */

document.addEventListener("keyup", function() {

    setTimeout(() => {

        keyStatus.textContent =
            "READY TO TYPE";

    }, 250);
});


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    initializeTypingTest();

    updateCharacterCount();

    output.focus();
});