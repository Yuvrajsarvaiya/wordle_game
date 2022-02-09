let grid = document.getElementById("grid");
let wordLists = ["horse", "party", "house"];

const { secretWord, secretWordHashTable } = initialize();

let attempts = [];
let currentAttempt = [];
let currentRowIndex = 0;
let currentWordsHashTable = {};

buildGrid();
registerKeyboardListener();

function initialize() {
  const secretIndex = Math.floor(Math.random() * wordLists.length);
  const secretWord = wordLists[secretIndex];
  const secretWordHashTable = {};
  buildHashTableForSecretWord();
  return { secretWord, secretWordHashTable };

  function buildHashTableForSecretWord() {
    for (let index = 0; index < secretWord.length; index++) {
      const currentLetter = secretWord[index];
      const countOfLetter = secretWordHashTable[currentLetter];
      secretWordHashTable[currentLetter] =
        countOfLetter === undefined ? 1 : countOfLetter + 1;
    }
  }
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function registerKeyboardListener() {
  document.addEventListener("keydown", function handleKeyDown(event) {
    if (event.altKey || event.shiftKey || event.ctrlKey) {
      return;
    }
    const currentTypedKey = event.key.toLowerCase();

    if (currentTypedKey === "backspace") {
      currentAttempt.pop();
      updateGrid();
      return;
    }
    if (currentTypedKey === "enter") {
      if (currentAttempt.length < 5) {
        const currentAttemptRow = grid.children[currentRowIndex];
        currentAttemptRow.setAttribute("invalid", true);
        setTimeout(() => currentAttemptRow.removeAttribute("invalid"), 600);
        return;
      }
      attempts.push(currentAttempt.join(""));
      currentAttempt = [];
      if (currentRowIndex <= 5) {
        currentRowIndex += 1;
        currentWordsHashTable = {};
      }
      updateGrid();
    }

    if (
      currentTypedKey.length === 1 &&
      currentTypedKey.charCodeAt(0) >= 97 &&
      currentTypedKey.charCodeAt(0) <= 122 &&
      currentAttempt.length < 5
    ) {
      currentAttempt.push(currentTypedKey);
      updateGrid();
    }
  });
}

function updateGrid() {
  let row = grid.firstChild;
  for (const attempt of attempts) {
    currentWordsHashTable = {};
    buildPastAttempts(attempt, row);
    row = row.nextSibling;
  }
  buildCurrentAttempt(currentAttempt, row);
}

function buildCurrentAttempt(attempt, row) {
  for (let index = 0; index < 5; index++) {
    const cell = row.children[index];
    cell.textContent = attempt[index] ?? "";
    cell.style.backgroundColor =
      attempt[index] == undefined ? "transparent" : "#000";
  }
}

function buildPastAttempts(attempt, row) {
  for (let index = 0; index < attempt.length; index++) {
    const cell = row.children[index];
    cell.textContent = attempt[index] ?? "";
    const letter = cell.textContent;
    cell.style.backgroundColor = getBgColor(letter, index);
  }
}

function getBgColor(letter, letterIndex) {
  updateCurrentWordsHashTable(letter);

  if (
    secretWord.indexOf(letter) === -1 ||
    currentWordsHashTable[letter] > secretWordHashTable[letter]
  ) {
    return "#3A3A3C";
  }
  if (secretWord[letterIndex] === letter) {
    return "#538D4E";
  }
  return "#B59F3B";
}

function updateCurrentWordsHashTable(letter) {
  currentWordsHashTable[letter] =
    currentWordsHashTable[letter] === undefined
      ? 1
      : currentWordsHashTable[letter] + 1;
}
