// Login wallpapers. Every image in src/assets/wallpapers/phone and /desktop is picked up automatically.
// Tall screens (phones) use wallpapers/phone, wide screens use wallpapers/desktop.
const PHONE_WALLPAPERS = Object.values(
    import.meta.glob("../assets/wallpapers/phone/*.{jpg,jpeg,png,webp,avif}", { eager: true, import: "default" })
);
const DESKTOP_WALLPAPERS = Object.values(
    import.meta.glob("../assets/wallpapers/desktop/*.{jpg,jpeg,png,webp,avif}", { eager: true, import: "default" })
);
const LOGIN_WALLPAPERS = window.matchMedia("(orientation: portrait)").matches ? PHONE_WALLPAPERS : DESKTOP_WALLPAPERS;

// Picks one per page load, never the same one twice in a row.
const pickWallpaper = () => {
  const n = LOGIN_WALLPAPERS.length;
  if (!n) return null;
  let last = -1;
  try { const s = localStorage.getItem("pc-last-wallpaper"); if (s !== null) last = Number(s); } catch {}
  let i = Math.floor(Math.random() * n);
  if (n > 1 && i === last) i = (i + 1) % n;
  try { localStorage.setItem("pc-last-wallpaper", String(i)); } catch {}
  return LOGIN_WALLPAPERS[i];
};
export const LOGIN_BG = pickWallpaper();
