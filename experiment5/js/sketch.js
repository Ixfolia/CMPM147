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

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = p4_initialize(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

// p4_base.js start

/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global p4_inspirations, p4_initialize, p4_render, p4_mutate */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;


function preload() {
  

  let allInspirations = p4_inspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
  
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  p4_mutate(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  p4_render(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());

    // Draw the original image on the right side of the canvas
    image(currentInspiration.image, width, 0, width, height);
}


// p4_base.js end


// my_design.js start

/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


/*
TODO: 
Add the images to your Glitch project assets bucket. 
Then edit the p4_inspirations() function to return an array of inspiration objects. 
The first item in the array will be the one used by default.
Required fields on these objects:
name: string, a short name for this image to show in the drop-down menu
assetUrl: string, URL of image in your Glitch assets bucket
*/

function p4_inspirations() {
  return [
    {
      name: "Minecraft Shaders Image",
      assetUrl: "https://cdn.glitch.global/fd8b4d5e-cacf-4452-bb21-66842720cd64/mcShaders.png?v=1714877775150"
    },
    {
      name: "Microsoft Edge Logo",
      assetUrl: "https://cdn.glitch.global/fd8b4d5e-cacf-4452-bb21-66842720cd64/edge%20logo.png?v=1714695443939"
    },
    {
      name: "Google Chrome Logo",
      assetUrl: "https://cdn.glitch.global/fd8b4d5e-cacf-4452-bb21-66842720cd64/chrome%20logo.jpg?v=1714695444319"
    },
  ];
}

/* 
TODO:
p4_initialize(inspiration)function to return an object with a few different fields 
(of your choice). The inspiration parameter will be one of the items returned 
by your p4_inspirations() function with one 
additional field: image (a p5.Image loaded from assetUrl).

This is a good place to call resizeCanvas to reshape 
your drawing canvas to something with the same shape as the inspiring image.
Your generator will run faster if you work with a smaller canvas:
resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
*/

// my_design.js start

/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function p4_initialize(inspiration) {
  // Resize the canvas to match the inspiration image size
  let scaleFactor = 4;
  resizeCanvas(inspiration.image.width / scaleFactor, inspiration.image.height / scaleFactor);

  let design = {
    bg: 128,
    circles: Array(1000).fill().map(() => {  // Initialize 10 circles
      let x = random(width);
      let y = random(height);
      let col = inspiration.image.get(x * scaleFactor, y * scaleFactor);  // Sample the color at the circle's location
      return {
        x: x,
        y: y,
        r: random(width/4), // radius of the circle
        fill: color(col[0], col[1], col[2])  // Use the sampled color
      };
    })
  };

  return design;
}

function p4_render(design, inspiration) {
  // Clear the canvas with the background color from the design
  background(design.bg);

  // Draw each circle in the design
  design.circles.forEach(circle => {
    // Set the fill color to the circle's color
    fill(circle.fill);

    // Draw the circle
    ellipse(circle.x, circle.y, circle.r);
  });
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function p4_mutate(design, inspiration, rate) {
  console.log("p4_mutate || Before mutation: ", JSON.parse(JSON.stringify({...design})))

  // Mutate the background color
  design.bg = mut(design.bg, 0, 255, rate);

  // Iterate over each circle in the design
  design.circles.forEach(circle => {
    // Mutate the circle's properties
    circle.x = mut(circle.x, 0, width, rate);
    circle.y = mut(circle.y, 0, height, rate);
    circle.r = mut(circle.r, 0, width/4, rate); // mutate the radius

    let scaleFactor = 4;
    let col = inspiration.image.get(circle.x * scaleFactor, circle.y * scaleFactor);  // Sample the color at the new location
    circle.fill = color(col[0], col[1], col[2]);  // Use the sampled color
  });

  console.log('p4_mutate || After mutation: ', JSON.parse(JSON.stringify({...design})));
}

// my_design.js end


// my_design.js end

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}