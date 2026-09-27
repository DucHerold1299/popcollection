import { CONDITIONS } from "./constants";
import { uid, today } from "./format";

// A new, empty figure for the add form.
export const blankFigure = (extra = {}) => ({ id: uid(), name: "", series: "", secret: false, condition: CONDITIONS[0], paid: "", bought: today(), qty: 1, notes: "", origin: "box", from: "", photo: null, sig: null, ...extra });

// What a figure cost in total (price × quantity).
export const paidTotal = (f) => (Number(f.paid) || 0) * (f.qty || 1);

// The numbers on the summary cards.
export function collectionTotals(figs) {
  return {
    count: figs.reduce((n, f) => n + (f.qty || 1), 0),
    paid: figs.reduce((n, f) => n + paidTotal(f), 0),
    series: new Set(figs.map((f) => f.series).filter(Boolean)).size,
    secrets: figs.filter((f) => f.secret).reduce((n, f) => n + (f.qty || 1), 0),
  };
}
