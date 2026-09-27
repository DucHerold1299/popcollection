import { pickPerVisit } from "./pickPerVisit";

// Logos. Every image in src/assets/logo/ is picked up automatically. One is chosen per visit
// (never the same one twice in a row) and used both in the app and as the browser/homescreen icon.
const LOGOS = Object.values(
    import.meta.glob("../assets/logo/*.{jpg,jpeg,png,webp,avif,svg}", { eager: true, import: "default" })
);

export const LOGO_IMAGE = pickPerVisit(LOGOS, "pc-last-logo");

function iconLink(rel) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
  return el;
}

// Sets the browser tab icon and the homescreen icon to a picture.
export function setAppIcon(url) {
  if (!url) return;
  // Homescreen: the picture itself (phones round the corners on their own).
  iconLink("apple-touch-icon").href = url;
  // Browser tab: the picture itself at first, then cropped into a circle like the logo in the app.
  const tab = iconLink("icon");
  tab.removeAttribute("type");
  tab.href = url;
  const img = new Image();
  img.onload = () => {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) return;
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    tab.type = "image/png";
    tab.href = canvas.toDataURL("image/png");
  };
  img.src = url;
}
