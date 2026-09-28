import { pickPerVisit } from "./pickPerVisit";

// Logos. Every image in src/assets/logo/ is picked up automatically. One is chosen per visit
// (never the same one twice in a row) and used both in the app and as the browser/homescreen icon.
const LOGOS = Object.values(
    import.meta.glob("../assets/logo/*.{jpg,jpeg,png,webp,avif,svg}", { eager: true, import: "default" })
);

export const LOGO_IMAGE = pickPerVisit(LOGOS, "pc-last-logo");

// Sets the browser tab icon to a picture (this visit's logo).
// The homescreen / Safari favorites icon is fixed: public/apple-touch-icon.png, linked in index.html.
export function setAppIcon(url) {
  if (!url) return;
  // Replace the fixed tab icons from index.html with one for this visit.
  document.head.querySelectorAll('link[rel="icon"]').forEach((el) => el.remove());
  const tab = document.createElement("link");
  tab.rel = "icon";
  document.head.appendChild(tab);
  // The picture itself at first, then cropped into a circle like the logo in the app.
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
