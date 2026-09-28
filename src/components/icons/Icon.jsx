// Small icons used on buttons and stat cards.

const Icon = {
  box: (p) => (
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden className="text-pc-accent-strong" {...p}>
        <path d="M5 11l11-5 11 5v12l-11 5-11-5z" style={{ fill: "rgb(var(--pc-soft))" }} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M5 11l11 5 11-5M16 16v12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <text x="10.5" y="24" fontSize="8" fontWeight="800" fill="currentColor" fontFamily="Nunito">?</text>
      </svg>
  ),
  figure: (p) => (
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden className="text-pc-accent-strong" {...p}>
        <path d="M10 5c1 3 2 5 3 6M22 5c-1 3-2 5-3 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="15" r="8" fill="#FFE9DC" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 26c0-3 2-4 5-4s5 1 5 4z" style={{ fill: "rgb(var(--pc-soft))" }} stroke="currentColor" strokeWidth="1.6" />
        <circle cx="13" cy="15" r="1.3" fill="#5B4038" /><circle cx="19" cy="15" r="1.3" fill="#5B4038" />
        <path d="M13.5 18.5h5" stroke="#5B4038" strokeWidth="1.2" strokeDasharray="1 1" />
      </svg>
  ),
  tag: (p) => (
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
        <path d="M5 15V6h9l13 13-9 9z" fill="#D8EFE0" stroke="#4F7F5E" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="10.5" cy="11.5" r="2" fill="#4F7F5E" />
        <text x="13" y="23" fontSize="8" fontWeight="800" fill="#4F7F5E" fontFamily="Nunito">€</text>
      </svg>
  ),
  secret: (p) => (
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
        <rect x="5" y="7" width="22" height="20" rx="4" fill="#EEE3F7" stroke="#7E62A3" strokeWidth="1.6" />
        <path d="M16 11l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#FFD66B" stroke="#7E62A3" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
  ),
  camera: (p) => (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
        <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10.3 12.4q.6-.8 1.4-.9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
  ),
  bag: (p) => (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
        <path d="M5 8h14l-1 12H6z" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 016 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
  ),
  miniBox: (p) => (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
        <path d="M4 8l8-4 8 4v9l-8 4-8-4z" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 8l8 4 8-4M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
  ),
  // Small icons for the sort menu (16px, take the text color).
  clock: (p) => (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  ),
  letters: (p) => (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
        <path d="M3.5 17l4-10 4 10M5 13.5h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 8h6l-6 9h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  ),
  stack: (p) => (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
        <path d="M12 4l8.5 4.5L12 13 3.5 8.5z" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  ),
  coin: (p) => (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
        <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="2" />
        <path d="M14.8 9.2a3.3 3.3 0 100 5.6M8 11h5M8 13.2h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
  ),
};

export default Icon;
