// Photo recognition (runs fully in the browser).

// Each photo gets a "fingerprint": a colour histogram of the centre area + a tiny
// grayscale shape map. New photos are compared against the fingerprints of
// figures already in the collection.
function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Could not read that image"));
    img.src = URL.createObjectURL(file);
  });
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, max ? d / max : 0, max];
}

export async function processPhoto(file) {
  const img = await loadImage(file);
  // centre square crop
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2, sy = (img.height - side) / 2;

  const thumb = document.createElement("canvas");
  thumb.width = thumb.height = 320;
  thumb.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, 320, 320);
  const photo = thumb.toDataURL("image/jpeg", 0.78);

  // colour histogram on inner 70% (figure usually sits in the middle)
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const inset = side * 0.15;
  ctx.drawImage(img, sx + inset, sy + inset, side - 2 * inset, side - 2 * inset, 0, 0, 64, 64);
  const px = ctx.getImageData(0, 0, 64, 64).data;
  const H = 12, S = 3, V = 3;
  const hist = new Array(H * S * V + 3).fill(0);
  for (let i = 0; i < px.length; i += 4) {
    const [h, s, v] = rgbToHsv(px[i], px[i + 1], px[i + 2]);
    if (s < 0.12) { hist[H * S * V + Math.min(2, Math.floor(v * 3))]++; continue; } // greys/white/black
    const bin = Math.floor(h / 30) * S * V + Math.min(S - 1, Math.floor(s * S)) * V + Math.min(V - 1, Math.floor(v * V));
    hist[bin]++;
  }
  const total = 64 * 64;
  const colour = hist.map((x) => x / total);

  // 16x16 grayscale shape map, normalised
  const g = document.createElement("canvas");
  g.width = g.height = 16;
  const gctx = g.getContext("2d", { willReadFrequently: true });
  gctx.drawImage(img, sx, sy, side, side, 0, 0, 16, 16);
  const gp = gctx.getImageData(0, 0, 16, 16).data;
  const gray = [];
  for (let i = 0; i < gp.length; i += 4) gray.push(0.299 * gp[i] + 0.587 * gp[i + 1] + 0.114 * gp[i + 2]);
  const mean = gray.reduce((a, b) => a + b, 0) / gray.length;
  const sd = Math.sqrt(gray.reduce((a, b) => a + (b - mean) ** 2, 0) / gray.length) || 1;
  const shape = gray.map((x) => +((x - mean) / sd).toFixed(3));

  return { photo, sig: { colour: colour.map((x) => +x.toFixed(4)), shape } };
}

export function similarity(a, b) {
  let inter = 0;
  for (let i = 0; i < a.colour.length; i++) inter += Math.min(a.colour[i], b.colour[i]);
  let corr = 0;
  for (let i = 0; i < a.shape.length; i++) corr += a.shape[i] * b.shape[i];
  corr = (corr / a.shape.length + 1) / 2; // 0..1
  return 0.7 * inter + 0.3 * corr;
}
