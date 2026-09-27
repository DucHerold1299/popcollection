// Shared Tailwind class strings and fonts, so buttons and inputs look the same everywhere.

export const inputCls = "w-full rounded-xl border border-[#EBDCCB] bg-white px-3 py-2 text-sm text-[#3D2E27] placeholder:text-stone-400 focus:outline-none focus:border-[#F0A48F] focus:ring-2 focus:ring-[#FDE3D8]";
export const btn = "rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";
export const serif = { fontFamily: "'Fraunces', Georgia, serif" };
export const btnPrimary = `${btn} bg-[#E0765C] text-white font-bold shadow-[0_4px_14px_-4px_rgba(224,118,92,0.6)] hover:bg-[#CC6249]`;
export const btnGhost = `${btn} border border-[#EBDCCB] bg-white text-stone-700 hover:bg-[#FFF6EC]`;
export const fontCss = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');`;
export const pageFont = { fontFamily: "'Nunito', system-ui, sans-serif" };
