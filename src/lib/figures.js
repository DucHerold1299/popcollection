import { CONDITIONS } from "./constants";
import { uid, today, median, daysAgo } from "./format";

// A figure on the shelf, and the numbers calculated from its logged prices.

export const blankFigure = (extra = {}) => ({ id: uid(), name: "", series: "", secret: false, condition: CONDITIONS[0], paid: "", bought: today(), qty: 1, notes: "", origin: "box", from: "", photo: null, sig: null, checks: [], ...extra });

export function stats(f) {
  const recent = f.checks.filter((c) => daysAgo(c.date) <= 60).map((c) => c.price);
  const all = f.checks.map((c) => c.price);
  const market = median(recent.length ? recent : all);
  const last = f.checks.length ? f.checks.reduce((a, b) => (a.date > b.date ? a : b)).date : null;
  const paidTotal = (Number(f.paid) || 0) * f.qty;
  const marketTotal = market != null ? market * f.qty : null;
  return { market, last, paidTotal, marketTotal, delta: marketTotal != null ? marketTotal - paidTotal : null, stale: last ? daysAgo(last) > 30 : true };
}
