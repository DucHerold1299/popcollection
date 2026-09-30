import { CONDITIONS } from "./constants";
import { uid, today, normName } from "./format";
import { FIGURE_LIST, SERIES_LIST } from "../data/characters";

// A new, empty figure for the add form.
export const blankFigure = (extra = {}) => ({ id: uid(), name: "", series: "", secret: false, condition: CONDITIONS[0], bought: today(), qty: 1, notes: "", origin: "box", from: "", photo: null, sig: null, ...extra });

export const NO_SERIES = "No series";
const howMany = (f) => f.qty || 1;
export const seriesOf = (f) => f.series?.trim() || NO_SERIES;

// Your collection grouped by series, biggest first. For each series:
// - count: how many figures you have (duplicates included)
// - for series in the Pop Mart list (data/characters.js) also a checklist of the whole set:
//   which figures you own and which are still missing, plus progress numbers.
export function seriesOverview(figs) {
  const groups = new Map();
  for (const f of figs) {
    const series = seriesOf(f);
    const g = groups.get(series) || { series, figs: [], count: 0 };
    g.figs.push(f);
    g.count += howMany(f);
    groups.set(series, g);
  }

  return [...groups.values()].map((g) => {
    const known = SERIES_LIST.find((s) => normName(s.series) === normName(g.series));
    const owned = new Set(g.figs.map((f) => normName(f.name)));
    const checklist = known
        ? FIGURE_LIST.filter((x) => x.series === known.series).map((x) => ({ ...x, owned: owned.has(normName(x.name)) }))
        : null;
    const regular = checklist?.filter((x) => !x.secret) || [];
    return {
      ...g,
      character: known?.character || g.figs[0].name.split(" – ")[0],
      checklist,
      setSize: regular.length,
      setOwned: regular.filter((x) => x.owned).length,
      secretsOwned: checklist?.filter((x) => x.secret && x.owned).length || 0,
      secretsTotal: checklist?.filter((x) => x.secret).length || 0,
    };
  }).sort((a, b) => (a.series === NO_SERIES) - (b.series === NO_SERIES) || b.count - a.count || a.series.localeCompare(b.series));
}

// The numbers on the summary cards.
export function collectionTotals(figs) {
  const overview = seriesOverview(figs).filter((g) => g.series !== NO_SERIES);
  return {
    count: figs.reduce((n, f) => n + howMany(f), 0),
    series: overview.length,
    secrets: figs.filter((f) => f.secret).reduce((n, f) => n + howMany(f), 0),
    top: overview[0] || null, // the series you have the most figures of
  };
}
