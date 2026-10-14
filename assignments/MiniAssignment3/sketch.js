// Based on layoutp5/rule_of_thirds_image/sketch.js
let img;
let highlighted;
let selectedColor;
let rangeSlider;
let x = 0, y = 0;
let w = 0, h = 0;

function preload() {
  img = loadImage('assets/default.jpg');
}

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  createP('Click a color in the image.');
  createFileInput(handleFile);
  createP('Color range (how similar the colors must be):');
  rangeSlider = createSlider(0, 250, 60);
  rangeSlider.input(highlightColors);

  createButton('Reset').mousePressed(() => {
    highlighted = null;
    selectedColor = null;
  });

  prepareImage();
}

function handleFile(file) {
  if (file.type === 'image') {
    loadImage(file.data, loadedImage => {
      img = loadedImage;
      prepareImage();
    });
  }
}

function prepareImage() {

  let scale = min(width / img.width, height / img.height);
  w = max(1, floor(img.width * scale));
  h = max(1, floor(img.height * scale));
  img.resize(w, h);
  x = (width - w) / 2;
  y = (height - h) / 2;
  highlighted = null;
  selectedColor = null;
}

function draw() {
  background(240);
  if (highlighted) {
    image(highlighted, x, y);
  } else {
    image(img, x, y);
  }
}

function mousePressed() {
  if (mouseX < x || mouseX >= x + w || mouseY < y || mouseY >= y + h) return;

  selectedColor = img.get(floor(mouseX - x), floor(mouseY - y));
  console.log('Selected RGB:', selectedColor);
  highlightColors();
}

function highlightColors() {
  if (!selectedColor) return;

  highlighted = img.get();
  highlighted.loadPixels();

  
  for (let i = 0; i < highlighted.pixels.length; i += 4) {
    let r = highlighted.pixels[i];
    let g = highlighted.pixels[i + 1];
    let b = highlighted.pixels[i + 2];

    let difference = dist(r, g, b, selectedColor[0], selectedColor[1], selectedColor[2]);
    if (difference > rangeSlider.value()) {
      let gray = (r + g + b) / 3 * 0.25;
      highlighted.pixels[i] = gray;
      highlighted.pixels[i + 1] = gray;
      highlighted.pixels[i + 2] = gray;
    }
  }
  highlighted.updatePixels();
}
