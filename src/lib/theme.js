// Builds the app's colors from the login wallpaper, so every page matches the picture.
// Each color is stored as a CSS variable ("R G B") on <html>. index.html turns these
// variables into Tailwind colors: bg-pc-bg, text-pc-ink, bg-pc-accent, border-pc-line, …
// With no wallpaper, the default colors in index.html are used.

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const hueDistance = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  s = clamp(s, 0, 1); l = clamp(l, 0, 1);
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
}

// Contrast ratio between two colors (1 = none, 21 = black on white).
function contrast(a, b) {
  const lum = (rgb) => {
    const [r, g, bl] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Finds the main colors of a picture: up to 4 hues (at least 40° apart) and how saturated they are.
function analysePicture(img) {
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  const px = ctx.getImageData(0, 0, size, size).data;

  const bins = new Array(36).fill(0); // 10° per bin
  let satSum = 0, weight = 0;
  for (let i = 0; i < px.length; i += 4) {
    const [h, s, l] = rgbToHsl(px[i], px[i + 1], px[i + 2]);
    const vivid = s * (1 - Math.abs(2 * l - 1)); // grey, white and black pixels count for (almost) nothing
    if (vivid < 0.08) continue;
    bins[Math.floor(h / 10) % 36] += vivid;
    satSum += s * vivid;
    weight += vivid;
  }
  const smooth = bins.map((v, i) => bins[(i + 35) % 36] + 2 * v + bins[(i + 1) % 36]);
  const hues = [];
  for (const [v, i] of smooth.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0])) {
    if (v <= 0 || hues.length === 4) break;
    const h = i * 10 + 5;
    if (hues.every((x) => hueDistance(x, h) >= 40)) hues.push(h);
  }
  return { hues, saturation: weight ? satSum / weight : 0, colourful: weight / (size * size) };
}

// Turns the picture's colors into the app's color roles.
function buildTheme({ hues, saturation, colourful }) {
  const grey = !hues.length || colourful < 0.02;
  const h = grey ? 30 : hues[0];
  const s = grey ? 0.08 : clamp(saturation, 0.4, 0.8);
  const extra = hues.slice(1);
  [30, -30, 60].forEach((shift) => { if (extra.length < 3) extra.push((h + shift + 360) % 360); });

  // Buttons use white text, so darken the accent until the text is easy to read (contrast 4.5:1).
  let accentL = 0.6;
  while (accentL > 0.25 && contrast(hslToRgb(h, s, accentL), [255, 255, 255]) < 4.5) accentL -= 0.01;

  return {
    bg: hslToRgb(h, s * 0.55, 0.975),       // page background
    surface: hslToRgb(h, s * 0.6, 0.955),   // light panels
    softer: hslToRgb(h, s * 0.8, 0.95),     // tabs, selected items
    soft: hslToRgb(h, s * 0.9, 0.92),       // badges, avatar circle
    line: hslToRgb(h, s * 0.45, 0.88),      // borders
    "line-strong": hslToRgb(h, s * 0.4, 0.84),
    ring: hslToRgb(h, s * 0.85, 0.74),      // focus outline
    accent: hslToRgb(h, s, accentL),        // main buttons and links
    "accent-strong": hslToRgb(h, s, accentL - 0.08),
    ink: hslToRgb(h, 0.25, 0.17),           // text
    muted: hslToRgb(h, 0.14, 0.4),          // secondary text
    shadow: hslToRgb(h, 0.45, 0.3),
    decor1: hslToRgb(h, 0.75, 0.9),         // background circles and stat cards
    decor2: hslToRgb(extra[0], 0.75, 0.9),
    decor3: hslToRgb(extra[1], 0.75, 0.9),
    decor4: hslToRgb(extra[2], 0.75, 0.9),
  };
}

function applyTheme(theme) {
  const root = document.documentElement.style;
  for (const [name, rgb] of Object.entries(theme)) root.setProperty(`--pc-${name}`, rgb.join(" "));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", `rgb(${theme.bg.join(",")})`);
}

// Colors are remembered per wallpaper, so a wallpaper seen before is themed instantly.
const CACHE_KEY = "pc-themes-v1";

export function applyWallpaperTheme(url) {
  if (!url) return;
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch {}
  if (cache[url]) return applyTheme(cache[url]);

  const img = new Image();
  img.onload = () => {
    const theme = buildTheme(analysePicture(img));
    applyTheme(theme);
    if (Object.keys(cache).length > 30) cache = {};
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...cache, [url]: theme })); } catch {}
  };
  img.src = url;
}

// Three colors from a picture's main hues, dark enough to read as large text on a light background.
// Used for the "Hi …" gradient on the shelf page. Resolves to null for (almost) grey pictures.
const TEXT_CACHE_KEY = "pc-picture-colors-v1";

export function loadPictureColors(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(TEXT_CACHE_KEY)) || {}; } catch {}
    if (url in cache) return resolve(cache[url]);

    const img = new Image();
    img.onload = () => {
      const { hues, saturation, colourful } = analysePicture(img);
      let colors = null;
      if (hues.length && colourful >= 0.02) {
        const s = clamp(saturation, 0.55, 0.85);
        const picked = hues.slice(0, 3);
        [40, -40].forEach((shift) => { if (picked.length < 3) picked.push((picked[0] + shift + 360) % 360); });
        colors = picked.map((h) => {
          let l = 0.55;
          while (l > 0.2 && contrast(hslToRgb(h, s, l), [255, 255, 255]) < 3.5) l -= 0.01;
          return `rgb(${hslToRgb(h, s, l).join(" ")})`;
        });
      }
      if (Object.keys(cache).length > 30) cache = {};
      try { localStorage.setItem(TEXT_CACHE_KEY, JSON.stringify({ ...cache, [url]: colors })); } catch {}
      resolve(colors);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
