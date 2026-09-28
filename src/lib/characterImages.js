import { normName } from "./format";

// Character pictures. Every image in src/assets/characters/ is picked up automatically and
// replaces the drawn picture for that character (in Browse Pop Mart, suggestions and figures
// without a photo of their own).
//
// Name each file after the character, e.g. labubu.png, nyota.jpg, skullpanda.webp,
// "twinkle twinkle.png", "baby molly.png". Upper/lower case doesn't matter.
// default.png (or .jpg …) is used for everything without its own picture, instead of the "?" box.
const FILES = import.meta.glob("../assets/characters/*.{png,jpg,jpeg,webp,avif,svg}", { eager: true, import: "default" });

const fileKey = (path) => normName(path.split("/").pop().replace(/\.[^.]+$/, "").replace(/_/g, " "));

// Longest names first, so "baby molly.png" wins over "molly.png" for "Baby Molly – …".
const IMAGES = Object.entries(FILES)
    .map(([path, url]) => ({ key: fileKey(path), url }))
    .sort((a, b) => b.key.length - a.key.length);

const DEFAULT_IMAGE = IMAGES.find((i) => i.key === "default")?.url ?? null;

// The picture for a character or figure name ("Nyota", "Nyota – Wishing Star"), or null for the drawing.
export function characterImage(name = "") {
  const words = ` ${normName(name)} `;
  const hit = IMAGES.find((i) => i.key !== "default" && words.includes(` ${i.key} `));
  return hit?.url ?? DEFAULT_IMAGE;
}
