import { pickPerVisit } from "./pickPerVisit";

// Login wallpapers. Every image in src/assets/wallpapers/phone and /desktop is picked up automatically.
// Tall screens (phones) use wallpapers/phone, wide screens use wallpapers/desktop.
const PHONE_WALLPAPERS = Object.values(
    import.meta.glob("../assets/wallpapers/phone/*.{jpg,jpeg,png,webp,avif}", { eager: true, import: "default" })
);
const DESKTOP_WALLPAPERS = Object.values(
    import.meta.glob("../assets/wallpapers/desktop/*.{jpg,jpeg,png,webp,avif}", { eager: true, import: "default" })
);
const LOGIN_WALLPAPERS = window.matchMedia("(orientation: portrait)").matches ? PHONE_WALLPAPERS : DESKTOP_WALLPAPERS;

export const LOGIN_BG = pickPerVisit(LOGIN_WALLPAPERS, "pc-last-wallpaper");
