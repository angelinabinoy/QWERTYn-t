const challenges = [
    "the quick brown fox jumps over the lazy dog",
    "practice makes progress",
    "typing requires focus and consistency",
    "every key tells a different story",
    "keep your hands steady and type naturally",
    "speed comes with practice and patience",
    "the computer understands what you type",
    "simple things can become surprisingly difficult",
    "focus on accuracy before increasing your speed",
    "technology should make life easier",
    "a good typing rhythm improves accuracy",
    "take your time and avoid unnecessary mistakes",
    "the keyboard looks exactly the same as always",
    "sometimes you just have to trust the process",
    "learning something new takes time and practice",
    "stay focused and keep moving forward",
    "typing fast is useless when every letter is wrong",
    "your fingers know the keyboard better than you think",
    "nothing seems unusual until you start typing",
    "welcome to a perfectly normal typing experience"
];

let currentChallenge = "";

function getRandomChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
}

function startChallenge() {
    currentChallenge = getRandomChallenge();
    return currentChallenge;
}