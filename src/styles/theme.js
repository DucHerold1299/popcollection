// Shared Tailwind class strings and fonts, so buttons and inputs look the same everywhere.

export const inputCls = "w-full rounded-xl border border-pc-line-strong bg-white px-3 py-2 text-sm text-pc-ink placeholder:text-stone-400 focus:outline-none focus:border-pc-ring focus:ring-2 focus:ring-pc-soft";
export const btn = "rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";
export const serif = { fontFamily: "'Fraunces', Georgia, serif" };
export const btnPrimary = `${btn} bg-pc-accent text-white font-bold shadow-[0_4px_14px_-4px_rgb(var(--pc-accent)/0.6)] hover:bg-pc-accent-strong`;
export const btnGhost = `${btn} border border-pc-line-strong bg-white text-stone-700 hover:bg-pc-surface`;
export const pageFont = { fontFamily: "'Nunito', system-ui, sans-serif" };
