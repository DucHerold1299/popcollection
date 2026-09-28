# Character pictures

Put one image per character in this folder. It replaces the drawn picture for that character
everywhere in the app (Browse Pop Mart, name suggestions, and figures without their own photo).

- Name the file after the character: `labubu.png`, `nyota.jpg`, `hirono.webp`, `twinkle twinkle.png`
  (dashes or underscores instead of spaces also work: `twinkle-twinkle.png`).
- Upper/lower case doesn't matter. Formats: png, jpg, jpeg, webp, avif, svg.
- `default.png` is used for every character without its own picture (instead of the "?" box).
- Square images look best. See-through PNGs sit on a pastel background.
- Characters without a file keep their drawing.

The code for this is in `src/lib/characterImages.js`.
