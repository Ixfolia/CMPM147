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
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "_") {
        placeTile(i, j, floor(random(4)), 0);
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
  // TODO: Form a 4-bit code using gridCheck on the north/south/east/west neighbors of i,j for the target code.
  // You might us an example like (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3).
  let northBit = gridCheck(grid, i-1, j, target);
  let southBit = gridCheck(grid, i+1, j, target);
  let eastBit = gridCheck(grid, i, j+1, target);
  let westBit = gridCheck(grid, i, j-1, target);

  return (northBit<<0) + (southBit<<1) + (eastBit<<2) + (westBit<<3);

}

function drawContext(grid, i, j, target, dti, dtj) {
  // TODO: Get the code for this location and target. 
  // Use the code as an array index to get a pair of tile offset numbers. 
  // const [tiOffset, tjOffset] = lookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);




}

const lookup = [
// TODO: A global variable referring to an array of 16 elements. 
// Fill this with hand-typed tile offset pairs, e.g. [2,1], so that drawContext does not need to handle any special cases.


];

// p2_solution.js ------------------------------

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}
