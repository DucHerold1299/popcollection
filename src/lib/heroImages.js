import { pickPerVisit } from "./pickPerVisit";

// Background pictures for the top part of the shelf page ("Hi …" and the summary cards).
// Every image in src/assets/hero/ is picked up automatically; with several, one is chosen per visit.
// With an empty folder, the page shows the colored circles instead.
const HERO_IMAGES = Object.values(
    import.meta.glob("../assets/hero/*.{jpg,jpeg,png,webp,avif}", { eager: true, import: "default" })
);

export const HERO_IMAGE = pickPerVisit(HERO_IMAGES, "pc-last-hero");
