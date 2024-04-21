// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // // create an instance of the class
  // myInstance = new MyClass("VALUE1", "VALUE2");
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

}

// p2_base.js ------------------------------

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

// p2_base.js ------------------------------

// p2_solution.js ------------------------------

/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  /* TODO: To generate biomes in the overworld, consider using an expression like noise(i/10,j/10) > 0.5 to select one code or another in a chaotic but spatially coherent manner.
           Try to keep the number of distinct codes used in your grid very small (2-4) so that it is easy to interactively edit and there are fewer combinations to handle in your renderer.
*/
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Generate a Perlin noise value for the cell
      let noiseValue = noise(i / 10, j / 10);
      let code;
      if (noiseValue < 0.2) {
        code = ".";
      } else if (noiseValue < 0.5) {
        code = ".";
      } else if (noiseValue < 0.68) {
        code = "w";
      } else if (noiseValue < 0.8) {
        code = "m";
      } else if (noiseValue < 0.9) { 
        code = "t"; 
      } else {
        code = "h";
      }

      // If the code is ":" or ".", there's a 10% chance to change it to "h"
      if ((code === ":" || code === ".") && Math.random() < 0.02) {
        code = "h";
      }
      // If the code is ":" or ".", there's a 5% chance to change it to "t"
      if ((code === ":" || code === ".") && Math.random() < 0.05) {
        code = "t";
      }

      row.push(code);
    }
    grid.push(row);
  }

  return grid;
}

function drawGrid(grid) {
  background(128)

  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ":")) { // add dirt
        placeTile(i, j, 0, 3);
      } else if (gridCheck(grid, i, j, "m")) { // add mountain
        placeTile(i, j, 15, 15);
      } else if (gridCheck(grid, i, j, "t")) { // add tree
        placeTile(i, j, 14, 0); 
      } else {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 0);
      } 
      if (gridCheck(grid, i, j, "h")) { // add house
        placeTile(i, j, 26, 0);
      }
      if (gridCheck(grid, i, j, "w")) { // add water with animation
        placeTile(i, j, (4 * pow(noise(t / 10, i, j / 4 + t), 2)) | 0, 14);
        drawContext(grid, i, j, "w", 9, 3, true);
      } else {
        drawContext(grid, i, j, ".", 4, 0); // add grass
      }

    }
  }

}

function gridCheck(grid, i, j, target) {
  // TODO: If location i,j is inside the grid (not out of bounds), does grid[i][j]==target? Otherise, return false.
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[i].length &&
    grid[i][j] == target
  );
}

function gridCode(grid, i, j, target) {
  return (
    (gridCheck(grid, i - 1, j, target) << 0) +
    (gridCheck(grid, i, j - 1, target) << 1) +
    (gridCheck(grid, i, j + 1, target) << 2) +
    (gridCheck(grid, i + 1, j, target) << 3)
  );
}

function drawContext(grid, i, j, target, dti, dtj, invert = false) {
  // TODO: Get the code for this location and target. 
  // Use the code as an array index to get a pair of tile offset numbers. 
  // const [tiOffset, tjOffset] = lookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);

  let code = gridCode(grid, i, j, target);

  // ChatGPT told me to add invert into the parameters
  if (invert) {
    code = 15 - code;
  }

  let [tiOffset, tjOffset] = lookup[code];

  placeTile(i, j, dti + tiOffset, dtj + tjOffset);

}

const lookup = [
// TODO: A global variable referring to an array of 16 elements. 
// Fill this with hand-typed tile offset pairs, e.g. [2,1], so that drawContext does not need to handle any special cases.
  [1, 1],
  [1, 0],
  [0, 1],
  [0, 0],
  [2, 1], 
  [2, 0], 
  [1, 1],
  [1, 0],
  [1, 2], 
  [1, 1],
  [0, 2], 
  [0, 1],
  [2, 2], 
  [2, 1],
  [1, 2],
  [1, 1]

];



// p2_solution.js ------------------------------

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}
