# DRIVE TO DRAW

Project 1 — MAT236  
Manami Nakagawa  
Working draft

## Idea

DRIVE TO DRAW is a drawing tool where driving a car makes a drawing. Instead of moving a brush directly across a canvas, the user controls a car and leaves a colored path behind it. My starting idea was to connect driving and drawing: steering becomes a way to make a line, and a trip becomes an abstract image. I wanted the interaction to feel playful and a little difficult to control. The user can guide the drawing, but the movement of the car also shapes the result.

The interface shows a night road, a car, a steering wheel, and a speed display. The wheel is also a color wheel. This connects a familiar driving control with a drawing control. A small live preview shows the drawing from above, while the main view focuses on driving. Pressing END shows the finished path as an artwork.

## Functionality

The car starts moving after a short countdown: READY?, 3, 2, 1, and GO! The left and right arrow keys turn the steering wheel. The up and down arrow keys change speed. The user can also drag the center of the wheel sideways or grab its outer ring and rotate it with the mouse. Space stops and resumes movement. While stopped, the user can still turn the wheel to choose a color before moving again.

The fixed pointer above the wheel shows the current color. As the wheel rotates, both the steering and the drawing color change. Each saved point contains the car's position, color, and speed. The preview uses these points to draw the path. At lower speeds, the line is continuous. Above the starting speed, the marks become shorter and gaps appear. This lets the user change the rhythm of the drawing by accelerating and slowing down.

The preview is visible at the start and can be hidden with its button or the R key. END switches to a larger view of the artwork. START OVER clears the path and begins a new session. To run the project locally, open this folder with VS Code and serve `index.html` using Live Server. The project uses p5.js, with the library files included in the `libraries` folder.

## Design Principles and Constraints

The main constraint is that the user draws through movement rather than placing marks wherever they want. The car keeps moving unless stopped, and its heading changes gradually. This encourages continuous lines, curves, loops, and crossings. There is no separate tool for placing an unrelated shape or starting a line somewhere else. The drawing records one connected journey, even when parts of its visible trail are dashed.

Another constraint is that color and steering share the same wheel. Choosing a new color can also change the direction of travel. This makes the two decisions depend on each other. It may be inconvenient when the user wants a very specific color and curve, but that tension is part of the tool's character. I want users to respond to unexpected marks instead of controlling every detail in advance.

The dark background and bright lines give the work a consistent neon appearance. The user chooses hue, while the tool sets the brightness, saturation, and line treatment. These limits help different drawings feel related without making them identical.

## Process

During development, I focused on how the user could discover the controls without someone explaining them aloud. The dashboard includes short keyboard hints, and the buttons describe their actions. I added a countdown so the user has a moment to look at the interface before the car moves. GO! marks the moment driving begins.

I also worked on visual hints around the car. I first tried arrows next to READY?, then moved them beside the road. The current version places four thick white arrows around the car and makes them pulse. They disappear when the user presses any arrow key and return after START OVER. I moved the car farther into the scene and made it smaller to leave room for these hints. The goal is to connect the arrow keys with the car through their position, rather than relying only on written directions.

## Reflections and Current Outcome

The current tool turns a driving path into a colored drawing, with speed affecting the line pattern. One design challenge is balancing the driving scene with the artwork. The road and car make the interaction inviting, but the user also needs to understand that they are making an image. The live preview helps connect those two views, while hiding it lets the user focus on movement and discover the result afterward.

Another challenge is making the shared steering and color control understandable. The colored wheel and pointer provide feedback, but I still need to observe whether a first-time user understands their connection to the trail. The pulsing arrows introduce keyboard input, but they do not explain every relationship in the tool.

The classroom partner review has not been documented yet. During that review, I want to observe which controls the user discovers first, whether the color changes feel useful or frustrating, and how quickly the drawings begin to feel repetitive. I also want to collect two or three screenshots of drawings made during exploration. Those observations will help me revise both the interface and this reflection after the review.
