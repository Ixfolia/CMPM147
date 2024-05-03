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

function p4_initialize(inspiration) {
  // console.log("Logging p4_initialize || p4_initialize called with inspiration:", inspiration); // logging inspiration object

  let design = { image: null, ready: false };

  loadImage(inspiration.assetUrl, function(loadedImage) {
    // console.log("Logging p4_initialize || Image loaded from URL:", inspiration.assetUrl); // making sure url works

    design.image = loadedImage;
    resizeCanvas(loadedImage.width, loadedImage.height);
    design.ready = true;  // Indicate that the image is ready for rendering

    // console.log("Logging p4_initialize || Design after image load:", design); // logging after image is loaded

    redraw();  // This forces a redraw once the image is loaded
  });

  // console.log("Logging p4_initialize ||Design initialized:", design); // logging before image is loaded

  return design;
}




/*
Edit the p4_render(design, inspiration)function to draw your parameterized design. 
The design object is the one returned by p4_initialize(inspiration) and inspiration is the 
currently selected inspiration object. You can use any p5.js drawing functions here, 
but you should avoid any signs of life (animation or interaction). 
We want every interesting varying detail of the design to be determined by the design object. 
This function is always called just after executing randomSeed(0).
If your design becomes overly complex, you’ll notice the “exploration rate” on the 
display page drop below about 20 frames per second. Considering simplifying your design 
if this is the case.
*/

let imageLoaded = true; // bool to see if image is loaded. Stops p4_render from spamming when false

function p4_render(design, inspiration) {
  if (design.ready) {  // Check if the image is ready
    image(design.image, 0, 0);

    // Use the inspiration image to influence your design
    tint(inspiration.color);
    image(inspiration.image, 0, 0, width, height);
  } else if (imageLoaded){
    console.log("Logging p4_render || Image is not loaded yet.");
    imageLoaded = false;
  }
}


 
/*
Edit the p4_mutate(design, inspiration, rate)function to modify your parameterized design. 
The design object is the one returned by p4_initialize(inspiration) and inspiration is the 
currently selected inspiration object. The rate parameter is a number 
between 0.0 and 1.0 based on the slider on the display page. 
You can use this value to scale the amount of mutation applied to your design parameters. 
It doesn’t have an effect until you incorporate it into the expressions used 
to adjust your parameters.
Here is a handy recipe for generating random mutations to a parameter with upper and 
lower bounds: 
function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
*/


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function p4_mutate(design, inspiration, rate) {
  // Example mutation: Suppose we have a parameter 'size' in the design object
  if (design.size) {
    design.size = mut(design.size, 10, 100, rate);  // Mutating 'size' within bounds
  }
  // You can add more parameters to mutate based on your design requirements
}


// my_design.js end

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}