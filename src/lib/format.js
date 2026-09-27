// Small helpers for ids, dates, money and text.

export const uid = () => Math.random().toString(36).slice(2, 9);
export const today = () => new Date().toISOString().slice(0, 10);
export const eur = (n) => (n == null || isNaN(n) ? "–" : n.toLocaleString("de-DE", { style: "currency", currency: "EUR" }));
export const median = (arr) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const daysAgo = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
export const normName = (n) => n.toLowerCase().replace(/[–—-]/g, " ").replace(/\s+/g, " ").trim();
