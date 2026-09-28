// Tailwind setup. The app colors (bg-pc-bg, text-pc-ink, border-pc-line, …) read CSS variables
// that src/lib/theme.js fills in from the login wallpaper. Their defaults are in src/styles/index.css.
const APP_COLORS = ["bg", "surface", "softer", "soft", "line", "line-strong", "ring", "accent", "accent-strong",
  "ink", "muted", "shadow", "decor1", "decor2", "decor3", "decor4"];

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind only keeps the classes it finds in these files, so the CSS stays small.
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pc: Object.fromEntries(APP_COLORS.map((name) => [name, `rgb(var(--pc-${name}) / <alpha-value>)`])),
      },
    },
  },
};
