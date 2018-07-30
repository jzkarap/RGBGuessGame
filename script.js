// A number of possible color elements to generate -- setting this to highest possible amount,
// based on highest difficulty, prevents identical elements from "painting in" after switching to higher difficulty
// from finished game on lower difficulty; this restriction is necessary only until colorChoices has been generated
let numberOfColors = 15;

// Create boolean to allow selections
let selectionAllowed = true;

// Create variable to hold value of color selected by user
let chosenColor;

// Get document body
const body = document.querySelector("body");

// Create identifier for container that will hold color elements
const container = document.querySelector("#container");

// Creates an array that will hold our color elements
const colorChoices = createColorElements();

// Creates identifier for our difficulty selectors
const difficulty = document.querySelectorAll(".difficulty");

// Create identifier for reset button
const resetButton = document.querySelector("#reset-button");

// Create an array of colors using the current number of colors to display (based on difficulty -- we start with 10, for medium difficulty)
let colors = generateRandomColors(10);

// Get the color that needs to be selected to win
let winColor = getWinColor();

// Create identifier for the text that will display RGB values for color to find
const winColorDisplay = document.querySelector(".win-color");

// Sets text for RGB to find to current winning RGB values
winColorDisplay.textContent = winColor;

// Create identifier for game status message
const messageDisplay = document.querySelector("#message");

// Create identifier for page header
const header = document.querySelector("#header");

// Fills divs with random colors, adds EventListeners so game can proceed
prepareColors();

/**
 * Generates divs within #container, to become color elements
 */
function createColorElements() {
    for (let i = 0; i < numberOfColors; i++) {
        container.appendChild(document.createElement("div"));
    }

    // Creates a true array object out of our nodelist of the divs within div#container.
    // This initializes colorChoices with a length of 10 (10 is the current numberOfColors -- 
    // that's the amount that are generated on medium difficulty, and the game starts on medium)
    return (Array.prototype.slice.call(document.querySelectorAll("#container div")));
}

/**
 * Creates conditions that make it possible to play game
 */
function prepareColors() {

    // adds the class .color to each div within div#container
    colorChoices.forEach(function (colorChoice) {
        colorChoice.classList.add("color");

        // Add EventListener to be able to pick each color
        colorChoice.addEventListener("click", function () {

            // Get rgb value of clicked color (if selection is allowed)
            if (selectionAllowed === true) {

                chosenColor = this.style.backgroundColor;

                // Compare color of clicked color to winning color
                if (chosenColor === winColor) {
                    messageDisplay.textContent = "Groovy.";

                    header.style.backgroundColor = winColor;

                    body.classList.add("waiting");
                    selectionAllowed = false;
                    changeToWinColor();
                    resetButton.textContent = "Play Again?";
                }

                // If color choice is incorrect, status message is updated and color element becomes transparent
                else {
                    messageDisplay.textContent = "Try again!";
                    this.style.backgroundColor = "transparent";
                }
            }
        });
    });

    // Display only color elements which have a color attached
    displayBlocks();
}

/**
 * Takes a number, generates an array with that amount of random-color elements
 * @param {Number} numberOfColors The amount of colors to generate
 */
function generateRandomColors(numberOfColors) {

    // Make an array
    let array = [];

    // Add numberOfColors colors to array
    for (let i = 0; i < numberOfColors; i++) {
        array.push(generateColor());
    }

    // Return that array
    return array;
}

/**
 * Generates a single random RGB value
 */
function generateColor() {

    // Generate RGB values
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return ("rgb(" + red + ", " + green + ", " + blue + ")");
}

// Assign a color to each div.color
for (let i = 0; i < colorChoices.length; i++) {
    colorChoices[i].style.backgroundColor = colors[i];
}

/**
 * Converts color choices all to winning color with a given delay between each conversion (currently 80 milliseconds)
 */
function changeToWinColor() {
    // Loop through all colors to match to winning color

    // This code will convert elements one by one
    let counter = 0;

    setInterval(function () {
        if (counter < colorChoices.length) {
            colorChoices[counter].style.backgroundColor = winColor;
            counter++;
        } else
            return;
    }, 80);

    // waits 1 second for animation to finish before allowing user selection
    // this prevents user from selecting wrong color if it hasn't been painted over by winning color
    setTimeout(function () {
        selectionAllowed = true;
        body.classList.remove("waiting");
    }, 1000);
}

/**
 * Gets a win color from the colors array, by picking a random element within the array
 */
function getWinColor() {
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

resetButton.addEventListener("click", function () {

    if (selectionAllowed === true) {

        reset();
    }
})

/**
 * Add EventListeners to difficulty buttons, allow difficulty change
 */
for (let i = 0; i < difficulty.length; i++) {

    difficulty[i].addEventListener("click", function () {

        if (selectionAllowed === true) {
            // Remove .selected from buttons
            difficulty[0].classList.remove("selected");
            difficulty[1].classList.remove("selected");
            difficulty[2].classList.remove("selected");
            // Apply .selected to selected button
            this.classList.add("selected");

            if (this.textContent === "Easy") {
                numberOfColors = 5;
            }
            else if (this.textContent === "Medium") {
                numberOfColors = 10;
            }
            else {
                numberOfColors = 15;
            }

            reset();
        }
    })
}

function reset() {

    if (selectionAllowed === true) {

        messageDisplay.textContent = "Guess the color.";

        header.style.backgroundColor = "black";

        resetButton.textContent = "New Colors";

        colors = generateRandomColors(numberOfColors);

        winColor = getWinColor();

        // Change the displayed color to find
        winColorDisplay.textContent = winColor;

        prepareColors();

        displayBlocks();
    }
}

function displayBlocks() {
    // Change colors on page
    // Assign a color to each div.color
    for (let i = 0; i < colorChoices.length; i++) {
        if (colors[i]) {
            colorChoices[i].style.display = "block";
            colorChoices[i].style.backgroundColor = colors[i];
        }
        else {
            colorChoices[i].style.display = "none";
        }
    }
}
