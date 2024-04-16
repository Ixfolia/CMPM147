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
let seed = 0;
// Bubble variables
let bubbles = [];

// Wave variables
let waveOffsets = [];
let waveCount = 5;

// Seabed variables
let seabedHeight;
let seabedColor = '#8c5e2d';
let sandyDots = [];



class MyClass {
    constructor(param1, param2) 
    {
        this.property1 = param1;
        this.property2 = param2;
    }

}

// listener for reimagine button
$("#reimagine").click(function() {
  reinitializeBubbles();
});

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

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // Create bubbles
  let numBubbles = 20; // Control the number of bubbles
  randomSeed(millis());
  for (let i = 0; i < numBubbles; i++) {
      bubbles.push(new Bubble());
  }
  // Initialize wave offsets
  for (let i = 0; i < waveCount; i++) {
      waveOffsets.push(random(1000));
  }

  // Define the colors for the top (light) and bottom (dark) of the water
  topColor = color('#a1d9ff'); // Light blue, simulating light
  bottomColor = color('#146b81'); // Dark blueish color


  // Seabed height is half the screen
  seabedHeight = height / 3;

  // Define the number of dots and their properties
  let numDots = 2000;
  for (let i = 0; i < numDots; i++) {
      let dot = {
          x: random(width),
          y: height - seabedHeight + random(seabedHeight), // dots are only on seabed
          diameter: random(1, 3),
          opacity: random(50, 150)
      };
      sandyDots.push(dot);
  }
}

function draw() {
  let bgColor = '#146b81'; // Dark blueish color
  background(bgColor);
  
  // Drawing the seabed one third up the screen
  fill(seabedColor);
  noStroke();
  rect(0, height - seabedHeight, width, seabedHeight);

  drawSandyDots();

  // Update and draw each bubble
  for (let bubble of bubbles) {
      bubble.rise();
      bubble.show();
  }
  // Draw waves
  for (let j = 0; j < waveCount; j++) {
    let waveOffset = waveOffsets[j];
    stroke(255, 255 * (1 - j / waveCount)); // Fade the waves as they go down
    noFill();
    beginShape();
    for (let x = 0; x < width; x++) {
        let y = map(noise(x * 0.01, waveOffset), 0, 1, j * 20, j * 20 + 20);
        vertex(x, y);
    }
    endShape();
    waveOffsets[j] += 0.01; // wave offset for animation
  }


}

// Bubble class
class Bubble {
  constructor() {
      // Set initial position, diameter, and rising speed of the bubble
      this.x = random(width);
      this.y = random(height);
      this.diameter = random(10, 50);
      this.riseSpeed = this.diameter * 0.1;
  }

  // Update the bubble's position
  rise() {
      this.y -= this.riseSpeed;
      // Reset the bubble's position when it goes off screen
      if (this.y < -this.diameter) {
          this.y = height + this.diameter;
          this.x = random(width); // Get a new random x position
      }
  }

  // Display the bubble
  show() {
      fill(255, 255, 255, 127); // Semi-transparent white
      noStroke();
      ellipse(this.x, this.y, this.diameter);
  }
}

function drawSandyDots() {
  for (let dot of sandyDots) {
      fill(255, 255, 240, dot.opacity);
      ellipse(dot.x, dot.y, dot.diameter, dot.diameter);
  }
}

function reinitializeBubbles() {
  bubbles = []; // Clear existing bubbles
  initializeBubbles();
}

function initializeBubbles() {
  let numBubbles = 20;
  for (let i = 0; i < numBubbles; i++) {
      bubbles.push(new Bubble());
  }
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}