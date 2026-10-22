// DRIVE TO DRAW
// Up/Down: speed. Left/Right: steer. Space: stop/resume. R: preview.
// Drag the wheel center sideways, or grab the rim to turn it.

let car = {
  x: 0,
  y: 0,
  angle: 0,
  speed: 3
};

let path = [];
const minSpeed = 0.2;
const maxSpeed = 12;

// Steering / Color Wheel
let wheelX;
let wheelY;
let wheelR = 90;
let cockpitScale = 1;

let wheelAngle = 0;
let prevMouseAngle = 0;
let draggingWheel = false;
let dragWheelFromCenter = false;
let prevWheelMouseX = 0;

// Stop / resume (keeps the chosen driving speed)
let isStopped = false;
let hasStarted = false;
let countdownStartedAt = 0;
const countdownDuration = 4000;
let showSteeringHint = true;

// View
let revealMode = true;
let revealButton;
let endButton;
let startOverButton;
let isFinished = false;
let roadBend = 0;
let roadTravel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  layoutCockpit();
  strokeCap(ROUND);
  revealButton = createButton('HIDE PREVIEW ×');
  revealButton.class('reveal-button');
  revealButton.mousePressed(toggleReveal);
  endButton = createButton('END →');
  endButton.class('reveal-button end-button');
  endButton.mousePressed(finishArtwork);
  startOverButton = createButton('START OVER ↻');
  startOverButton.class('reveal-button start-over-button');
  startOverButton.mousePressed(startOver);
  startOver();
}

function draw() {
  background(230, 40, 5);
  if (isFinished) {
    drawReveal(true);
    return;
  }
  if (!hasStarted && millis() - countdownStartedAt >= countdownDuration) {
    hasStarted = true;
    endButton.removeAttribute('disabled');
  }
  updateCar();
  drawDriverView();
  drawColorWheel();
  drawSpeedIndicator();
  if (revealMode) drawReveal();
  if (millis() - countdownStartedAt < countdownDuration + 700) drawCountdown();
  // Keep the title visible above the driving scene.
  push();
  noStroke();
  fill(0, 0, 100, 85);
  textAlign(LEFT, TOP);
  textSize(width < 520 ? 14 : 18);
  text('DRIVE TO DRAW', width < 520 ? 16 : 24, 28);
  pop();
}

// --- DRIVING ---

function updateCar() {
  if (!hasStarted || isFinished) return;

  // Turn the wheel with Left/Right. Colors can change while stopped.
  let steeringStep = 0.035 * constrain(deltaTime / (1000 / 60), 0, 3);
  if (keyIsDown(LEFT_ARROW)) wheelAngle -= steeringStep;
  if (keyIsDown(RIGHT_ARROW)) wheelAngle += steeringStep;

  // ↑ accelerate
  if (keyIsDown(UP_ARROW)) {
    car.speed += 0.16;
  }

  // ↓ brake
  if (keyIsDown(DOWN_ARROW)) {
    car.speed -= 0.16;
  }
  car.speed = constrain(car.speed, minSpeed, maxSpeed);
  if (isStopped) return;

  // Use sin() to keep steering smooth across a full wheel turn.
  let steering = sin(wheelAngle) * HALF_PI;
  car.angle += steering * 0.018;
  roadBend = lerp(roadBend, steering / HALF_PI, 0.08);
  roadTravel = (roadTravel + car.speed * 0.0008 / 0.14) % 1;
  car.x += cos(car.angle) * car.speed;
  car.y += sin(car.angle) * car.speed;

  // Save position, color, and speed only while moving.
  path.push({x: car.x, y: car.y, hue: getCurrentHue(), speed: car.speed});
}

// --- DRIVER VIEW ---

function drawDriverView() {

  // ----- sky stars -----
  randomSeed(4);
  noStroke();
  for (let i = 0; i < 80; i++) {

    fill(0, 0, 100, 50);

    circle(
      random(width),
      random(height * 0.55),
      random(1, 3)
    );
  }

  // The same curve positions the road edges and moving markers.
  let h = getCurrentHue();
  let samples = 48;
  noStroke();
  fill(0, 0, 10);
  beginShape();
  for (let i = 0; i <= samples; i++) {
    let p = roadPoint(i / samples);
    vertex(p.x - p.halfWidth, p.y);
  }
  for (let i = samples; i >= 0; i--) {
    let p = roadPoint(i / samples);
    vertex(p.x + p.halfWidth, p.y);
  }
  endShape(CLOSE);
  for (let i = 1; i <= samples; i++) {
    let a = roadPoint((i - 1) / samples);
    let b = roadPoint(i / samples);
    drawNeonLine(a.x - a.halfWidth, a.y, b.x - b.halfWidth, b.y, h);
    drawNeonLine(a.x + a.halfWidth, a.y, b.x + b.halfWidth, b.y, h);
  }
  drawSpeedMarkers(h);
  // Rear view: the tires sit on the road, above the steering wheel.
  let carY = constrain(min(height * 0.60, wheelY - wheelR - 85),
    height * 0.32 + 65, height * 0.70);
  let carT = (carY - height * 0.32) / (height * 0.68);
  let ground = roadPoint(carT);
  let carSize = min(1, ground.halfWidth / 80, height / 750);
  // Blink four arrows around the car until an arrow key is pressed.
  let hintElapsed = millis() - countdownStartedAt;
  if (showSteeringHint) {
    let pulse = (1 + cos(TWO_PI * hintElapsed / 1200)) / 2;
    push();
    noFill();
    stroke(0, 0, 100, lerp(15, 85, pulse));
    strokeWeight(8);
    let arrowSize = min(44, width * 0.06);
    let centerY = ground.y - 32 * carSize;
    let gapX = 65 * carSize + arrowSize;
    let gapY = 45 * carSize + arrowSize;
    for (let direction of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      push();
      translate(ground.x + direction[0] * gapX, centerY + direction[1] * gapY);
      rotate(atan2(direction[1], direction[0]));
      line(-arrowSize / 2, 0, arrowSize / 2, 0);
      line(arrowSize * 0.15, -arrowSize * 0.3, arrowSize / 2, 0);
      line(arrowSize * 0.15, arrowSize * 0.3, arrowSize / 2, 0);
      pop();
    }
    pop();
  }
  push();
  translate(ground.x, ground.y);
  noStroke();
  fill(0, 0, 0, 45);
  ellipse(0, 0, 122 * carSize, 24 * carSize);
  pop();
  drawRearCar(ground.x, ground.y, carSize, h, roadBend);

  // Dashboard behind the steering wheel.
  noStroke();
  fill(0, 0, 4);
  rect(0, height * 0.82, width, height * 0.18);
}

function roadPoint(t) {
  return {
    x: width / 2 + roadBend * width * 0.30 * pow(1 - t, 2),
    y: lerp(height * 0.32, height, t),
    halfWidth: lerp(width * 0.04, width * 0.32, t)
  };
}

// Rotate each car face and make distant points look smaller.
// face() uses [x, height, depth] points and [hue, saturation, brightness] colors.
function drawRearCar(x, y, size, h, turn = 0) {
  let yaw = turn * 0.42;
  let faces = [];
  function face(points, paint) {
    let vertices = [];
    let depth = 0;
    for (let p of points) {
      let px = p[0];
      let py = p[1];
      let pz = p[2] * 1.35; // Make the car body longer.
      let rx = px * cos(yaw) + pz * sin(yaw);
      let rz = -px * sin(yaw) + pz * cos(yaw);
      let perspective = 320 / (320 + rz);
      vertices.push({
        x: rx * perspective,
        y: (-py * 0.94 - rz * 0.28) * perspective
      });
      depth += rz;
    }
    faces.push({vertices: vertices, paint: paint, depth: depth / points.length});
  }

  // Body: front, sides, trunk deck, and rear all share the same corners.
  face([[-48, 7, 38], [48, 7, 38], [48, 29, 38], [-48, 29, 38]], [h, 65, 35]);
  for (let side of [-1, 1]) {
    let sx = side * 48;
    face([[sx, 7, -38], [sx, 7, 38], [sx, 29, 38], [sx, 29, -38]], [h, 70, 40]);
    // Front and rear tires remain vertical and on the ground.
    for (let z of [-24, 25]) {
      face([[side * 50, 0, z - 9], [side * 50, 0, z + 9],
        [side * 50, 17, z + 9], [side * 50, 17, z - 9]], [0, 0, 5]);
    }
    face([[side * 49, 0, -34], [side * 38, 0, -34],
      [side * 38, 16, -34], [side * 49, 16, -34]], [0, 0, 5]);
  }
  face([[-48, 29, -38], [48, 29, -38], [48, 29, 38], [-48, 29, 38]], [h, 65, 68]);

  // Cabin roof, rear glass, and side windows form a solid volume.
  face([[-29, 56, -8], [29, 56, -8], [29, 56, 18], [-29, 56, 18]], [h, 45, 75]);
  face([[-40, 29, -25], [40, 29, -25], [29, 56, -8], [-29, 56, -8]], [h, 65, 50]);
  face([[-32, 33, -23], [32, 33, -23], [25, 52, -11], [-25, 52, -11]], [230, 45, 16]);
  for (let side of [-1, 1]) {
    face([[side * 40, 29, -25], [side * 40, 29, 30],
      [side * 29, 56, 18], [side * 29, 56, -8]], [h, 65, 42]);
    face([[side * 38.5, 33, -18], [side * 38.5, 33, 23],
      [side * 30.5, 52, 15], [side * 30.5, 52, -5]], [230, 40, 13]);
  }
  face([[-48, 7, -38], [48, 7, -38], [48, 29, -38], [-48, 29, -38]], [h, 65, 38]);
  // Tail lights and bumper are attached to the rear plane and turn with it.
  for (let side of [-1, 1]) {
    face([[side * 18, 19, -38.5], [side * 43, 19, -38.5],
      [side * 43, 25, -38.5], [side * 18, 25, -38.5]], [0, 80, 100]);
  }
  face([[-44, 8, -38.5], [44, 8, -38.5], [44, 13, -38.5], [-44, 13, -38.5]], [0, 0, 10]);
  face([[-8, 17, -38.5], [8, 17, -38.5], [8, 23, -38.5], [-8, 23, -38.5]], [0, 0, 85]);
  push();
  translate(x, y);
  scale(size);
  strokeWeight(0.6);
  // Draw distant faces first so nearby faces cover them.
  faces.sort((a, b) => b.depth - a.depth);
  for (let surface of faces) {
    fill(surface.paint[0], surface.paint[1], surface.paint[2]);
    stroke(surface.paint[0], surface.paint[1] * 0.6, surface.paint[2] * 0.8);
    beginShape();
    for (let point of surface.vertices) vertex(point.x, point.y);
    endShape(CLOSE);
  }
  pop();
}

// A small vector car, pointing along its actual heading in the map.
function drawCar(x, y, heading, size, h) {
  push();
  translate(x, y);
  rotate(heading + HALF_PI);
  scale(size);
  rectMode(CENTER);
  noStroke();
  fill(0, 0, 0, 35);
  ellipse(0, 6, 48, 76);
  fill(0, 0, 8);
  rect(-18, -19, 9, 19, 3);
  rect(18, -19, 9, 19, 3);
  rect(-18, 20, 9, 19, 3);
  rect(18, 20, 9, 19, 3);
  stroke(h, 35, 100);
  strokeWeight(2);
  fill(h, 75, 65);
  rect(0, 0, 34, 64, 9);
  noStroke();
  fill(230, 45, 12);
  rect(0, -10, 25, 17, 4);
  rect(0, 18, 23, 10, 3);
  fill(h, 30, 95);
  rect(0, 4, 23, 9, 3);
  fill(55, 12, 100);
  rect(-11, -27, 7, 5, 2);
  rect(11, -27, 7, 5, 2);
  fill(0, 85, 100);
  rect(-11, 28, 7, 4, 1);
  rect(11, 28, 7, 4, 1);
  pop();
}

// --- NEON ---

function drawNeonLine(x1, y1, x2, y2, h) {

  // glow
  stroke(h, 90, 100, 15);
  strokeWeight(18);
  line(x1, y1, x2, y2);
  stroke(h, 80, 100, 35);
  strokeWeight(8);
  line(x1, y1, x2, y2);

  // core
  stroke(h, 30, 100, 100);
  strokeWeight(2);
  line(x1, y1, x2, y2);
}

// --- SPEED MARKERS ---

function drawSpeedMarkers(h) {
  // Keep each repeat fixed; shorten the paint to make faster speeds visibly dashed.
  const spacing = 0.14;
  let speedRatio = constrain((car.speed - 3) / (maxSpeed - 3), 0, 1);
  let dashLength = spacing * lerp(0.98, 0.16, sqrt(speedRatio));
  let offset = roadTravel * spacing;
  push();
  stroke(h, 12, 100, 95);
  strokeCap(ROUND);
  for (let t = offset - spacing; t < 1; t += spacing) {
    let start = max(0, t);
    let end = min(1, t + dashLength);
    if (end <= start) continue;
    // Follow the road curve, just inside the neon edges for contrast.
    for (let i = 0; i < 4; i++) {
      let from = lerp(start, end, i / 4);
      let to = lerp(start, end, (i + 1) / 4);
      let a = roadPoint(from * from);
      let b = roadPoint(to * to);
      strokeWeight(lerp(1.5, 8, to));
      for (let side of [-1, 1]) {
        line(a.x + side * a.halfWidth * 0.88, a.y,
          b.x + side * b.halfWidth * 0.88, b.y);
      }
    }
  }
  pop();
}

// --- COLOR / STEERING WHEEL ---

function drawColorWheel() {
  push();
  translate(wheelX, wheelY);
  rotate(wheelAngle);
  noFill();
  strokeWeight(25);

  // hue ring
  for (let a = 0; a < 360; a += 3) {

    stroke(a, 90, 100);

    arc(
      0,
      0,
      wheelR * 2,
      wheelR * 2,
      radians(a),
      radians(a + 3)
    );
  }

  // steering wheel spokes
  stroke(0, 0, 80, 80);
  strokeWeight(5);
  line(0, 0, -wheelR * 0.75, 0);
  line(0, 0, wheelR * 0.75, 0);
  line(0, 0, 0, wheelR * 0.7);

  // center
  fill(getCurrentHue(), 80, 100);
  noStroke();
  circle(0, 0, 25);
  pop();

  // fixed color selector at top
  noStroke();
  fill(0, 0, 100);
  triangle(
    wheelX - 7,
    wheelY - wheelR - 25,

    wheelX + 7,
    wheelY - wheelR - 25,

    wheelX,
    wheelY - wheelR - 12
  );
}

// --- CURRENT COLOR ---

function getCurrentHue() {
  // Find the hue (0-359) under the fixed pointer above the wheel.
  return (270 - degrees(wheelAngle) % 360 + 360) % 360;
}

// --- MOUSE STEERING ---

function mousePressed() {
  if (isFinished) return;
  let wy = wheelY;
  let d = dist(
    mouseX,
    mouseY,
    wheelX,
    wy
  );

  // Grab the rim to rotate, or drag the center sideways for easier control.
  if (d < wheelR + 30) {
    draggingWheel = true;
    dragWheelFromCenter = d < wheelR * 0.7;
    prevWheelMouseX = mouseX;

    prevMouseAngle = atan2(
      mouseY - wy,
      mouseX - wheelX
    );
  }
}

function mouseDragged() {
  if (!draggingWheel || isFinished) return;
  if (dragWheelFromCenter) {
    wheelAngle += (mouseX - prevWheelMouseX) * 0.012 / cockpitScale;
    prevWheelMouseX = mouseX;
    return false;
  }
  let wy = wheelY;
  let currentMouseAngle = atan2(
    mouseY - wy,
    mouseX - wheelX
  );
  let delta = currentMouseAngle - prevMouseAngle;

  // prevent jump at -PI / PI
  delta = atan2(sin(delta), cos(delta));
  wheelAngle += delta;
  prevMouseAngle = currentMouseAngle;
}

function mouseReleased() {
  draggingWheel = false;
}

// --- KEYBOARD CONTROLS ---

function keyPressed(event) {
  if (isFinished) return;
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    showSteeringHint = false;
  }
  if (!hasStarted && (key === ' ' || keyCode === UP_ARROW || keyCode === DOWN_ARROW)) {
    return false;
  }
  // Change speed on a quick tap. updateCar() handles held keys.
  if ((!event || !event.repeat) &&
      (keyCode === UP_ARROW || keyCode === DOWN_ARROW)) {
    car.speed = constrain(car.speed + (keyCode === UP_ARROW ? 0.6 : -0.6),
      minSpeed, maxSpeed);
  }
  if (key === ' ') {
    if (!event || !event.repeat) isStopped = !isStopped;
    return false;
  }

  // R = reveal
  if (key === 'r' || key === 'R') toggleReveal();
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) return false;
}

function toggleReveal() {
  if (isFinished) return;
  revealMode = !revealMode;
  draggingWheel = false;
  revealButton.html(revealMode ? 'HIDE PREVIEW ×' : 'REVEAL PREVIEW');
  revealButton.attribute('aria-pressed', String(revealMode));
}

function finishArtwork() {
  if (!hasStarted || isFinished) return;
  isFinished = true;
  draggingWheel = false;
  revealButton.hide();
  endButton.hide();
  startOverButton.show();
  startOverButton.elt.focus();
}

function startOver() {
  car = {x: 0, y: 0, angle: -HALF_PI, speed: 3};
  path = [];
  wheelAngle = 0;
  prevMouseAngle = 0;
  draggingWheel = false;
  dragWheelFromCenter = false;
  prevWheelMouseX = 0;
  roadBend = 0;
  roadTravel = 0;
  isStopped = false;
  isFinished = false;
  hasStarted = false;
  showSteeringHint = true;
  revealMode = true;
  countdownStartedAt = millis();
  revealButton.html('HIDE PREVIEW ×');
  revealButton.attribute('aria-pressed', 'true');
  revealButton.show();
  endButton.attribute('disabled', '');
  endButton.show();
  startOverButton.hide();
  revealButton.elt.focus();
}

// --- DASHBOARD / START COUNTDOWN ---

function layoutCockpit() {
  cockpitScale = min(1, (width - 24) / 584);
  wheelR = 90 * cockpitScale;
  wheelX = width / 2;
  wheelY = height - 125 * cockpitScale;
}

function drawSpeedIndicator() {
  let speed = hasStarted && !isStopped ? car.speed : 0;
  let ratio = speed / maxSpeed;
  let h = getCurrentHue();
  let startAngle = PI * 0.75;
  let endAngle = PI * 2.25;
  push();
  translate(wheelX - 205 * cockpitScale, wheelY);
  scale(cockpitScale);
  rectMode(CENTER);
  fill(230, 30, 7, 95);
  stroke(h, 25, 65, 45);
  strokeWeight(1);
  rect(0, 0, 172, 204, 18);
  noFill();
  stroke(0, 0, 22);
  strokeWeight(5);
  arc(0, -20, 116, 116, startAngle, endAngle);
  if (ratio > 0) {
    stroke(h, 70, 100);
    arc(0, -20, 116, 116, startAngle, lerp(startAngle, endAngle, ratio));
  }
  for (let i = 0; i <= 12; i++) {
    let a = lerp(startAngle, endAngle, i / 12);
    stroke(0, 0, i % 3 === 0 ? 85 : 40);
    strokeWeight(i % 3 === 0 ? 2 : 1);
    line(cos(a) * 47, -20 + sin(a) * 47,
      cos(a) * 53, -20 + sin(a) * 53);
  }
  let needle = lerp(startAngle, endAngle, ratio);
  stroke(h, 40, 100);
  strokeWeight(2);
  line(0, -20, cos(needle) * 40, -20 + sin(needle) * 40);
  noStroke();
  fill(h, 40, 100);
  circle(0, -20, 6);
  textAlign(CENTER, CENTER);
  fill(0, 0, 100);
  textSize(24);
  text(speed.toFixed(1), 0, 14);
  textSize(9);
  fill(0, 0, 65);
  text(!hasStarted ? 'READY' : isStopped ? 'STOPPED' : 'SPEED', 0, 35);
  stroke(0, 0, 25);
  strokeWeight(1);
  line(-66, 49, 66, 49);
  noStroke();
  fill(0, 0, 80);
  textSize(10);
  text('↑ FASTER   ↓ SLOWER', 0, 62);
  text('← → STEER · OR DRAG', 0, 78);
  fill(h, 25, 100);
  text(isStopped ? 'SPACE · RESUME' : 'SPACE · STOP', 0, 94);
  pop();
}

function drawCountdown() {
  let elapsed = millis() - countdownStartedAt;
  let beat = floor(elapsed / 1000);
  let label = hasStarted ? 'GO!' : beat === 0 ? 'READY?' : String(4 - beat);
  push();
  noStroke();
  if (!hasStarted) {
    fill(230, 40, 3, 55);
    rect(0, 0, width, height);
  }
  textAlign(CENTER, CENTER);
  fill(getCurrentHue(), 25, 100);
  textSize(min(80, width * 0.16));
  text(label, width / 2, height * 0.40);
  fill(0, 0, 85);
  textSize(12);
  text('DRIVE TO DRAW', width / 2, height * 0.40 + 65);
  pop();
}

// --- LIVE BIRD'S-EYE PREVIEW ---

function drawReveal(finalArtwork = false) {
  let panelW = finalArtwork ? min(900, width - 32) : min(300, width - 24);
  let panelH = finalArtwork ? max(120, height - 160) : min(240, height * 0.34);
  let panelX = finalArtwork ? (width - panelW) / 2 : width - panelW - 12;
  let panelY = finalArtwork ? 32 : 78;
  push();
  noStroke();
  fill(230, 40, 5, 96);
  stroke(270, 30, 80, 55);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 14);
  noStroke();
  fill(0, 0, 90);
  textAlign(LEFT, TOP);
  textSize(finalArtwork ? 24 : 12);
  text(finalArtwork ? 'YOUR ARTWORK!' : 'YOUR PATH · LIVE', panelX + 16, panelY + 14);
  if (finalArtwork) {
    fill(0, 0, 65);
    textSize(12);
    text('A drawing made by your drive.', panelX + 16, panelY + 48);
  }

  // bounding box
  let minX = car.x;
  let maxX = car.x;
  let minY = car.y;
  let maxY = car.y;
  for (let p of path) {

    minX = min(minX, p.x);
    maxX = max(maxX, p.x);

    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  }
  let drawingWidth = max(maxX - minX, 1);
  let drawingHeight = max(maxY - minY, 1);
  let scaleFactor = min(
    max(panelW - 64, 1) / drawingWidth,
    max(panelH - (finalArtwork ? 144 : 88), 1) / drawingHeight,
    2
  );
  push();
  translate(
    panelX + panelW / 2,
    panelY + (finalArtwork ? 80 : 34) + (panelH - (finalArtwork ? 80 : 34)) / 2
  );
  scale(scaleFactor);
  translate(
    -(minX + maxX) / 2,
    -(minY + maxY) / 2
  );

  // Draw solid or dashed lines based on the saved speed.
  let trailDistance = 0;
  for (let i = 1; i < path.length; i++) {
    let a = path[i - 1];
    let b = path[i];
    let d = dist(a.x, a.y, b.x, b.y);
    drawTrailSegment(a, b, scaleFactor, trailDistance, d);
    trailDistance += d;
  }

  // Cancel the map scale so the car stays readable for long paths.
  if (!finalArtwork) {
    drawCar(car.x, car.y, car.angle, 0.35 / scaleFactor, getCurrentHue());
  } else if (path.length < 2) {
    noStroke();
    fill(getCurrentHue(), 50, 100);
    circle(car.x, car.y, 6 / scaleFactor);
  }
  pop();
  pop();
}

// Anchor dashes to travel distance so zooming does not move them.
function drawTrailSegment(a, b, scaleFactor, startDistance, length) {
  if (length <= 0) return;
  let speedRatio = constrain((b.speed - 3) / (maxSpeed - 3), 0, 1);
  // Repeat every 120 travel units. Higher speeds leave shorter marks.
  let period = 120;
  let contrast = pow(speedRatio, 0.5);
  let inkLength = lerp(period, period * 0.12, contrast);
  let firstDash = floor(startDistance / period);
  let lastDash = floor((startDistance + length) / period);

  for (let i = firstDash; i <= lastDash; i++) {
    // Find the part of this segment that falls inside a dash.
    let from = max(0, i * period - startDistance);
    let to = min(length, i * period + inkLength - startDistance);
    if (to <= from) continue;
    let t1 = from / length;
    let t2 = to / length;
    let x1 = lerp(a.x, b.x, t1);
    let y1 = lerp(a.y, b.y, t1);
    let x2 = lerp(a.x, b.x, t2);
    let y2 = lerp(a.y, b.y, t2);
    stroke(b.hue, 90, 100, 18);
    strokeWeight(6 / scaleFactor);
    line(x1, y1, x2, y2);
    stroke(b.hue, 50, 100, 100);
    strokeWeight(2.5 / scaleFactor);
    line(x1, y1, x2, y2);
  }
}

// --- RESPONSIVE ---

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutCockpit();
}
