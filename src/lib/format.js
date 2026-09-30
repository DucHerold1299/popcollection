// Small helpers for ids, dates and text.

export const uid = () => Math.random().toString(36).slice(2, 9);
export const today = () => new Date().toISOString().slice(0, 10);
export const normName = (n) => n.toLowerCase().replace(/[–—-]/g, " ").replace(/\s+/g, " ").trim();
