const topAlphabets = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const middleAlphabets = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const bottomAlphabets = ["Z", "X", "C", "V", "B", "N", "M"];

const topRow = document.getElementById("top");
const middleRow = document.getElementById("middle");
const bottomRow = document.getElementById("bottom");

const hangmanImage = document.getElementById("hangman-picture");
const answerZone = document.getElementById("answer-list");

const URL = "https://random-word-api.herokuapp.com/word?lang=en";

let mistakeCount = 0;
let word = "";

//this simply gets a random word
//from a random word api I found on google
async function randomWordAPI() {
  let res = await fetch(URL);
  let data = await res.json();
  return data.toString();
}

async function getHangmanWord() {
  word = await randomWordAPI();
  let parsedWord = word.split("");
  createWordZone(parsedWord);
}

//creating and inserting li elements that act as a keyboard input for the user
let createKeyboard = () => {
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
let getInput = () => {
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

let userInput = (e) => {
  console.log(e.target.id);
  mistakeCount++;
  updateHangman();
};

//this makes it so that every mistake adds a stroke to the hangman
let updateHangman = () => {
  switch (mistakeCount) {
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
  }
};

let createWordZone = (parsedWord) => {
  for (let i = 0; i < parsedWord.length; i++) {
    alphabets = document.createElement("li");
    alphabets.id = parsedWord[i];
    alphabets.innerHTML = parsedWord[i];
    answerZone.appendChild(alphabets);
    console.log("hi");
  }
};

window.onload = () => {
  getHangmanWord();
  createKeyboard();
  getInput();
};
