// Picks one item from a list per page load, at random, but never the same one twice in a row.
// `key` is the name under which the last choice is remembered in the browser.
export function pickPerVisit(list, key) {
  const n = list.length;
  if (!n) return null;
  let last = -1;
  try { const s = localStorage.getItem(key); if (s !== null) last = Number(s); } catch {}
  let i = Math.floor(Math.random() * n);
  if (n > 1 && i === last) i = (i + 1) % n;
  try { localStorage.setItem(key, String(i)); } catch {}
  return list[i];
}
