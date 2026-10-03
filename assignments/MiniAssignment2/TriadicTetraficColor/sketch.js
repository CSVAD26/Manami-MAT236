// Triadic Tetradic Colo
// Mouse position changes base hue value. Four squares show analogous colors (base, base +30, base +60, base +90).
// extended from Rune Madsen's Color Scheme Analogous Example :https://printingcode.runemadsen.com/examples/color/scheme_analogous/index.html

let outerRadius = 300;
let innerRadius = 100; // hole size
// let steps = 360/15; // resolution
let ringImage;
let colorCount = 2;
// let mode = 'triadic'; // change to 'tetradic' for tetradic colors

let saturation = 50;
let baseHue = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  createRingImage();
}

function draw() {
  background(100);
  image(ringImage, 0, 0);
  // drawRing();
  // if(mode === 'triadic'){
  //   drawTriadicColors();
  // } else if(mode === 'tetradic'){
  //   drawTetradicColors();
  // }
  drawSelectedColors();
  fill(0);
  // text('click to toggle mode',50, height-50);
  textSize(20);
  text(
    'Press Space key to change the number of selected colors: ' + colorCount + ' colors',
    50,
    height - 50
  );
}

function keyPressed() {
  if (key === ' ') {
    colorCount = colorCount + 1;

    if (colorCount > 4) {
      colorCount = 2;
    }

    return false;
  }
}

// function mousePressed(){
//   colorCount = colorCount + 1;

//   if (colorCount > 4) {
//     colorCount = 2;
//   }　
// }

function mouseDragged() {
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;

  
  if (dx !== 0 || dy !== 0) {
    baseHue = (degrees(atan2(dy, dx)) + 360) % 360;
  }

  let distance = dist(
    mouseX, mouseY,
    width / 2, height / 2
  );

  saturation = map(
    distance,
    innerRadius, outerRadius,
    0, 100,
    true
  );
}

function drawSelectedColors() {
  
  let hueStep = 360 / colorCount;
  let sliceAngle = TWO_PI / colorCount;

  push();
  noStroke();

  // middle 
  for (let i = 0; i < colorCount; i++) {
    let hue = ((baseHue + i * hueStep) % 360 + 360) % 360;

    let startAngle = -HALF_PI + i * sliceAngle;
    let endAngle = startAngle + sliceAngle;

    fill(hue, saturation, 100);

    arc(
      width / 2,
      height / 2,
      innerRadius * 2,
      innerRadius * 2,
      startAngle,
      endAngle,
      PIE
    );
  }


  noFill();
  stroke(0, 0, 200);
  strokeWeight(50);

  circle(
    width / 2,
    height / 2,
    innerRadius * 2
  );


  noStroke();

  for (let i = 0; i < colorCount; i++) {
    let hue = ((baseHue + i * hueStep) % 360 + 360) % 360;
    drawColorPosition(hue);
  }

  pop();

  // let squareWidth = width / colorCount;

  // for (let i = 0; i < colorCount; i++) {
  //   let hue = ((baseHue + i * hueStep) % 360 + 360) % 360;

  //   fill(hue, 100, 100);
  //   rect(i * squareWidth, 0, squareWidth, height / 4);

  //   drawColorPosition(hue);
  // }
}


// function drawTriadicColors(){
//   // Map mouseX to hue (0–360)
//   let baseHue = map(mouseX, 0, width, 0, 360);

//   let squareWidth = width/3;
//   // Square 1: base hue
//   fill((baseHue + 0) % 360, 100, 100);
//   rect(0, 0, squareWidth, height/4);
//   drawColorPosition(baseHue);

//   // Square 2: base + 120
//   fill((baseHue + 120) % 360, 100, 100);
//   rect(squareWidth, 0, squareWidth, height/4);
//   drawColorPosition(baseHue + 120);

//   // Square 3: base + 240
//   fill((baseHue + 240) % 360, 100, 100);
//   rect(squareWidth * 2, 0, squareWidth, height/4);
//   drawColorPosition(baseHue + 240);

// }

// function drawTetradicColors(){
//   // Map mouseX to hue (0–360)
//   let baseHue = map(mouseX, 0, width, 0, 360);

//   let squareWidth = width/4;
//   // Square 1: base hue
//   fill((baseHue + 0) % 360, 100, 100);
//   rect(0, 0, squareWidth, height/4);
//   drawColorPosition(baseHue);

//   // Square 2: base + 90
//   fill((baseHue + 90) % 360, 100, 100);
//   rect(squareWidth, 0, squareWidth, height/4);
//   drawColorPosition(baseHue + 90);

//   // Square 3: base + 180
//   fill((baseHue + 180) % 360, 100, 100);
//   rect(squareWidth * 2, 0, squareWidth, height/4);
//   drawColorPosition(baseHue + 180);

//    // Square 4: base + 270
//   fill((baseHue + 270) % 360, 100, 100);
//   rect(squareWidth * 3, 0, squareWidth, height/4);
//   drawColorPosition(baseHue + 270);
// }

function drawColorPosition(hue){
  push();
  translate(width / 2, height / 2); 

   let markerRadius = map(
    saturation,
    0, 100,
    innerRadius, outerRadius
  );

  let x1 = cos(radians(hue)) * markerRadius;
  let y1 = sin(radians(hue)) * markerRadius;
  fill(0);
  ellipse(x1, y1, 20,20);
  pop();
}

function createRingImage() {
  ringImage = createImage(width, height);
  ringImage.loadPixels();

  let centerX = width / 2;
  let centerY = height / 2;

  for (let y = 0; y < ringImage.height; y++) {
    for (let x = 0; x < ringImage.width; x++) {

      let dx = x  - centerX;
      let dy = y  - centerY;

      
      let distance = sqrt(dx * dx + dy * dy);

      
      if (distance < innerRadius || distance > outerRadius) {
        continue;
      }

      
      let angle = degrees(atan2(dy, dx));
      let hue = (angle + 360) % 360;

   
      let saturation = map(
        distance,
        innerRadius, outerRadius,
        0, 100
      );

      let pixelColor = color(hue, saturation, 100);

  
      let index = (x + y * ringImage.width) * 4;


      ringImage.pixels[index] = red(pixelColor);
      ringImage.pixels[index + 1] = green(pixelColor);
      ringImage.pixels[index + 2] = blue(pixelColor);
      ringImage.pixels[index + 3] = 255;
    }
  }

  ringImage.updatePixels();
}


// function drawRing(){

  // push();
  // translate(width / 2, height / 2); // center of canvas


  // for (let angle = 0; angle < 360; angle+=steps) {
  //   let nextAngle = angle + steps;

  //   // Outer edge points
  //   let x1 = cos(radians(angle)) * outerRadius;
  //   let y1 = sin(radians(angle)) * outerRadius;
  //   let x2 = cos(radians(nextAngle)) * outerRadius;
  //   let y2 = sin(radians(nextAngle)) * outerRadius;

  //   // Inner edge points
  //   let x3 = cos(radians(nextAngle)) * innerRadius;
  //   let y3 = sin(radians(nextAngle)) * innerRadius;
  //   let x4 = cos(radians(angle)) * innerRadius;
  //   let y4 = sin(radians(angle)) * innerRadius;

  //   fill(angle, 100, 100);
  //   quad(x1, y1, x2, y2, x3, y3, x4, y4);
   
  // }
  // pop();

// }
