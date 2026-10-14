# Mini Assignment 3 — Color Focus

Based on [rule_of_thirds_image](https://github.com/CSVAD26/code_samples/tree/main/layoutp5/rule_of_thirds_image).

Click a color to keep similar colors visible and dim the rest.
Use the slider to change the color range, upload your own image, or press Reset.
Open `index.html` using VS Code Live Server.

Default painting: Pierre-Auguste Renoir, *Luncheon of the Boating Party* (1881).
[Image source: Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Luncheon_of_the_Boating_Party_Renoir_1881.jpg), public domain; resized for the sketch.

Code to read first: `handleFile()` loads an image, `mousePressed()` picks a color,
and `highlightColors()` compares each pixel with that color.
