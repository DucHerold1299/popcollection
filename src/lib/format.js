// Small helpers for ids, dates, money and text.

export const uid = () => Math.random().toString(36).slice(2, 9);
export const today = () => new Date().toISOString().slice(0, 10);
export const eur = (n) => (n == null || isNaN(n) ? "–" : n.toLocaleString("de-DE", { style: "currency", currency: "EUR" }));
export const normName = (n) => n.toLowerCase().replace(/[–—-]/g, " ").replace(/\s+/g, " ").trim();
