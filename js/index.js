//separated into three arrays so that the input looks like a QWERTY keyboard
const topAlphabets = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const middleAlphabets = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const bottomAlphabets = ["Z", "X", "C", "V", "B", "N", "M"];
//separated for the same reason above
const topRow = document.getElementById("top");
const middleRow = document.getElementById("middle");
const bottomRow = document.getElementById("bottom");

const hangmanImage = document.getElementById("hangman-picture");
const textZone = document.getElementById("text-zone");
const hintText = document.getElementById("hint");

const WORD_URL = "https://random-word-api.herokuapp.com/word?lang=en";
const HINT_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let mistakeCount = 0;
let answerWord = "";
let gameSessionOn = false;
let hint = "";

//this simply gets a random word
//from a random word api I found on google
//and passes the word to createWordZone
async function getHangmanWord() {
  let res = await fetch(WORD_URL);
  let data = await res.json();
  word = await data.toString();
  answerWord = word;
  let parsedWord = word.split("");
  createWordZone(parsedWord);
}

//this simply searches up the word to a public dictionary api
//the definition is the hint
//if it doesnt exist in the dictionary...?
//yeah this function is not that responsible
const getHint = async (word) => {
  let res = await fetch(HINT_URL + word);
  if (res.status === 200) {
    let data = await res.json();
    data.map((def) => {
      showHint(def.meanings[0].definitions[0].definition);
    });
  } else if (res.status === 404) {
    showHint("Not a word in the dictionary apparently 🤷");
  }
};

//makes the guess zone
const createWordZone = (parsedWord) => {
  for (let i = 0; i < parsedWord.length; i++) {
    const html = document.createElement("p");
    html.className = "answer-character";
    html.innerHTML = "*";
    textZone.appendChild(html);
  }
};

//creating and inserting li elements that act as a keyboard input for the user
const createKeyboard = () => {
  for (let i = 0; i < topAlphabets.length; i++) {
    keys = document.createElement("li");
    keys.innerHTML = topAlphabets[i];
    keys.id = topAlphabets[i];
    topRow.appendChild(keys);
  }
  for (let i = 0; i < middleAlphabets.length; i++) {
    keys = document.createElement("li");
    keys.innerHTML = middleAlphabets[i];
    keys.id = middleAlphabets[i];
    middleRow.appendChild(keys);
  }
  for (let i = 0; i < bottomAlphabets.length; i++) {
    keys = document.createElement("li");
    keys.innerHTML = bottomAlphabets[i];
    keys.id = bottomAlphabets[i];
    bottomRow.appendChild(keys);
  }
};

//all the code below have to do with assinging click function on individual li elements
const getInput = () => {
  for (let i = 0; i < topAlphabets.length; i++) {
    document
      .getElementById(topAlphabets[i])
      .addEventListener("click", userInput);
  }
  for (let i = 0; i < middleAlphabets.length; i++) {
    document
      .getElementById(middleAlphabets[i])
      .addEventListener("click", userInput);
  }
  for (let i = 0; i < bottomAlphabets.length; i++) {
    document
      .getElementById(bottomAlphabets[i])
      .addEventListener("click", userInput);
  }
};

//handles input
//its a loop hell... there must be a better way to solve this
//im trying to write this s**t all over again
const userInput = (e) => {
  let guessChar = e.target.id.toLowerCase();

  if (answerWord.includes(guessChar)) {
    let correctIndex = getIndexes(guessChar);
    correctIndex.forEach((i) => {
      textZone.children[i].textContent = guessChar;
    });
    if (!checkGameStatus()) {
      hangmanImage.src = "./static/victory.png";
      alert("You won!");
      setTimeout(() => init(), 3000);
    }
  } else {
    mistakeCount += 1;
    updateHangman();
  }
  disableButton(guessChar);
  if (mistakeCount > 2) {
    getHint(answerWord);
  }
};

//this makes it so that every mistake adds a stroke to the hangman
//everything below here are utility functions
const disableButton = (c) => {
  const char = c.toUpperCase();
  if (topAlphabets.includes(char)) {
    let i = topAlphabets.indexOf(char);
    topRow.children[i].removeEventListener("click", userInput);
    topRow.children[i].style.backgroundColor = "gray";
  } else if (middleAlphabets.includes(char)) {
    let j = middleAlphabets.indexOf(char);
    middleRow.children[j].removeEventListener("click", userInput);
    middleRow.children[j].style.backgroundColor = "gray";
  } else if (bottomAlphabets.includes(char)) {
    let k = bottomAlphabets.indexOf(char);
    bottomRow.children[k].removeEventListener("click", userInput);
    bottomRow.children[k].style.backgroundColor = "gray";
  }
};

const updateHangman = () => {
  switch (mistakeCount) {
    case 0:
      hangmanImage.src = "./static/1.png";
      break;
    case 1:
      hangmanImage.src = "./static/2.png";
      break;
    case 2:
      hangmanImage.src = "./static/3.png";
      break;
    case 3:
      hangmanImage.src = "./static/4.png";
      break;
    case 4:
      hangmanImage.src = "./static/5.png";
      break;
    case 5:
      hangmanImage.src = "./static/6.png";
      break;
    case 6:
      hangmanImage.src = "./static/7.png";
      break;
    case 7:
      hangmanImage.src = "./static/lose.png";
      alert(`You lost! The word was: ${answerWord}`);
      setTimeout(() => init(), 3000);
      break;
  }
};

const checkGameStatus = () => {
  gameSessionOn = false;

  for (let i = 0; i < textZone.children.length; i++) {
    if (textZone.children[i].textContent === "*") {
      gameSessionOn = "true";
    }
  }
  return gameSessionOn;
};

const getIndexes = (letter) => {
  let indexes = [];
  [...answerWord].forEach((val, i) => {
    if (val === letter) {
      const index = i;
      indexes.push(index);
    }
  });
  return indexes;
};

const showHint = (hint) => {
  let hintT = hint;
  hintText.innerHTML = `Hint: ${hintT}`;
};

//sets up the game
const init = () => {
  textZone.innerHTML = "";
  hintText.innerHTML = "Hint:";
  topRow.innerHTML = "";
  middleRow.innerHTML = "";
  bottomRow.innerHTML = "";
  mistakeCount = 0;
  getHangmanWord();
  updateHangman();
  createKeyboard();
  getInput();
};

window.onload = init();
