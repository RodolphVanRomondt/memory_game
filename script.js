const gameContainer = document.getElementById("game");
let click1 = "";
let click2 = "";
let clickTimes = 0;
let clickable = false;

const INPUT = document.querySelector(".input-name");
const savedScore = JSON.parse(localStorage.getItem("score")) || {};
let score = 0;
const scoreArray = [];

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

const BTN = document.querySelector("#btn");

BTN.addEventListener("click", function (e) {
  if (e.target.innerText === "RESET") {
    setTimeout(window.location.reload(true), 1000);
  } else if (e.target.className === "start") {
    e.preventDefault();
    e.target.previousElementSibling.classList.add("none");
    e.target.parentElement.parentElement.nextElementSibling.classList.remove("none");
    e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.classList.remove("none");
    e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.innerText += `Score: ${score}`;
    e.target.innerText = "RESET";
    if (!(INPUT.value)) {
      INPUT.value = "NoName";
    }
    if (!savedScore.hasOwnProperty(INPUT.value)) {
      savedScore[INPUT.value] = 9999;
    }
  }
});

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(e) {
  // you can use event.target to see which element was clicked

  if (clickable) return;
  if (e.target.classList.contains("flipped")) return;
  
  score++;
  scoreArray.push(score);
  e.target.parentElement.nextElementSibling.innerText = `Score: ${score}`;
  e.target.style.backgroundColor = e.target.classList[0];

  if (!click1 || !click2) {
    e.target.classList.add("flipped");
    click1 = click1 || e.target;
    click2 = e.target === click1 ? null : e.target;
  }

  if (click1 && click2) {
    clickable = true;
    let color1 = click1.className;
    let color2 = click2.className;

    if (color1 === color2) {
      clickTimes += 2;
      click1.removeEventListener("click", handleCardClick);
      click2.removeEventListener("click", handleCardClick);
      click1 = null;
      click2 = null;
      clickable = false;
    } else {
      setTimeout(function () {
        click1.style.backgroundColor = "";
        click2.style.backgroundColor = "";
        click1.classList.remove("flipped");
        click2.classList.remove("flipped");
        click1 = null;
        click2 = null;
        clickable = false;
      }, 1000);
    }
  }

  if (clickTimes === COLORS.length) {
    if (savedScore[INPUT.value] > score) {
      savedScore[INPUT.value] = score;
    }
    localStorage.setItem("score", JSON.stringify(savedScore));
    setTimeout(function () {
      // console.log("GAME OVER");
      alert(`Your score is ${score}. Your best score was ${savedScore[INPUT.value]}`);
    }, 500);
    
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
