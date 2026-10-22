# Mini Assignment 3 — Color Focus

A p5.js sketch for exploring how a color appears across an image. Click a color to keep similar colors visible and dim the rest.

Based on [rule_of_thirds_image](https://github.com/CSVAD26/code_samples/tree/main/layoutp5/rule_of_thirds_image).

## Interaction

1. Click a color in the image to select it.
2. Adjust the **Color range** slider. A smaller range keeps only close matches visible; a larger range includes more colors.
3. Upload an image to explore a different composition. The image is resized to fit the canvas while preserving its proportions.
4. Press **Reset** to clear the selection and see the current image in full color.

## Changes

1. **Select a color directly from the image.** `mousePressed()` reads the RGB value at the clicked position. Clicks outside the image are ignored.

2. **Find similar colors across the image.** `highlightColors()` compares each pixel with the selected color using distance in RGB space. Pixels within the selected range keep their original color; the rest become dark gray. This makes it easier to see where related colors appear in the composition.

3. **Adjust the range interactively.** The slider updates the highlighted image immediately after a color is selected, so the user can explore both close matches and broader groups of colors.

4. **Explore other images.** `handleFile()` loads an uploaded image, and `prepareImage()` fits and centers it on the 800 × 600 canvas. Loading a new image clears the previous color selection.

## Run Locally

Open this folder in VS Code and serve `index.html` using Live Server. The p5.js library is included in the `libraries` folder.

## Image Credit

Default painting: Pierre-Auguste Renoir, *Luncheon of the Boating Party* (1881).
[Image source: Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Luncheon_of_the_Boating_Party_Renoir_1881.jpg), public domain; resized for the sketch.
