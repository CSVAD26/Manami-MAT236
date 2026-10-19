# DRIVE TO DRAW

Project 1 — MAT236  
Manami Nakagawa  
Working draft

![DRIVE TO DRAW demo](project1.gif)

What if you could become a color and go for a drive? In DRIVE TO DRAW, a line is a trace of where you have been. Turn, change color, speed up, or pause, without needing to know what the picture will become. Travel through the canvas from the color's point of view, then look back to find the image your journey has left behind.




## Idea

After trying several drawing tools, I felt that an efficient canvas and color selection tools are useful when I already know what I want to express. They help me choose colors, adjust their properties, and place them where I want. In that situation, I felt like a manager of color, looking at the whole image from above and deciding where each color should go.

For this project, I wanted to explore a different relationship with color. What would drawing feel like from the color's own point of view? Rather than planning a complete image, I wanted to wander through a canvas as if I were going for a drive without a fixed destination. Here, freedom means being able to follow a feeling and discover where it leads, even without knowing what I want to draw beforehand.

The driving idea grew out of [Mini Assignment 2](../MiniAssignment2/README.md), where I made a tool that selected colors through circular mouse movement around a color wheel. That motion reminded me of turning a steering wheel. I began to imagine a wheel that could change both a color and its direction of movement. This became DRIVE TO DRAW: the user drives a car, and its colored trail becomes the drawing. The car represents the moving color, inviting the user to imagine drawing from its point of view rather than directing it only from above.

The interface shows a night road, a car, a steering wheel, and a speed display. The wheel is also a color wheel. This connects a familiar driving control with a drawing control. A small live preview shows the drawing from above, while the main view focuses on driving. Pressing END shows the finished path as an artwork.

## Functionality

The car starts moving after a short countdown: READY?, 3, 2, 1, and GO! The left and right arrow keys turn the steering wheel. The up and down arrow keys change speed. The user can also drag the center of the wheel sideways or grab its outer ring and rotate it with the mouse. Space stops and resumes movement. While stopped, the user can still turn the wheel to choose a color before moving again.

The fixed pointer above the wheel shows the current color. As the wheel rotates, both the steering and the drawing color change. Each saved point contains the car's position, color, and speed. The preview uses these points to draw the path. At lower speeds, the line is continuous. Above the starting speed, the marks become shorter and gaps appear. This lets the user change the rhythm of the drawing by accelerating and slowing down.

The preview is visible at the start and can be hidden with its button or the R key. END switches to a larger view of the artwork. START OVER clears the path and begins a new session. To run the project locally, open this folder with VS Code and serve `index.html` using Live Server. The project uses p5.js, with the library files included in the `libraries` folder.

## Design Principles and Constraints

The main constraint is that the user draws through movement rather than placing marks wherever they want. The car keeps moving unless stopped, and its heading changes gradually. This encourages continuous lines, curves, loops, and crossings. There is no separate tool for placing an unrelated shape or starting a line somewhere else. The drawing records one connected journey, even when parts of its visible trail are dashed.

Another constraint is that color and steering share the same wheel. Choosing a new color can also change the direction of travel. This makes the two decisions depend on each other. It may be inconvenient when the user wants a very specific color and curve, but that tension is part of the tool's character. I want users to respond to unexpected marks instead of controlling every detail in advance.

The freedom I am interested in does not require unlimited control. The connection between movement and color gives the user something to respond to while exploring. I hope the drawing can emerge from that experience, like the memory of a drive, instead of needing a clear plan before the first mark.

The dark background and bright lines give the work a consistent neon appearance. The user chooses hue, while the tool sets the brightness, saturation, and line treatment. These limits help different drawings feel related without making them identical.

## Process and Iteration

![DRIVE TO DRAW process and iteration](IMG_0590.jpg)

Early on, I considered connecting the tool to the Spotify API so that the drawing could respond to the music and its characteristics. However, I decided not to pursue this idea after considering practical issues such as authentication and setting up the app to run locally. I wanted the project to be easy to open and use, so I focused on the driving interaction instead.

I also considered using sliders to select colors. However, connecting color selection to the steering wheel felt more intuitive to me within the driving interface. A separate slider would add another control to manage, while the wheel lets one action change both direction and color. This decision also strengthened the connection between moving through the canvas and leaving a colored trail.

During development, I focused on how the user could discover the controls without someone explaining them aloud. The dashboard includes short keyboard hints, and the buttons describe their actions. I added a countdown so the user has a moment to look at the interface before the car moves. GO! marks the moment driving begins.

I also worked on visual hints around the car. I first tried arrows next to READY?, then moved them beside the road. The current version places four thick white arrows around the car and makes them pulse. They disappear when the user presses any arrow key and return after START OVER. I moved the car farther into the scene and made it smaller to leave room for these hints. The goal is to connect the arrow keys with the car through their position, rather than relying only on written directions.

## Reflections and Current Outcome

The current tool turns a driving path into a colored drawing, with speed affecting the line pattern. One design challenge is balancing the driving scene with the artwork. The road and car make the interaction inviting, but the user also needs to understand that they are making an image. The live preview helps connect those two views, while hiding it lets the user focus on movement and discover the result afterward.

Another challenge is making the shared steering and color control understandable. The colored wheel and pointer provide feedback about the selected hue, while the trail shows how that choice affects the drawing. The pulsing arrows introduce keyboard input, but they do not explain every relationship in the tool.
