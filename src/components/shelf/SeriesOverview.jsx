import FigureArt from "../icons/FigureArt";

// One card per series you collect: how many figures you have and, for known series,
// how much of the set is complete. Tap a card to show that series' checklist and figures.
export default function SeriesOverview({ groups, selected, onSelect }) {
  return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => {
          const active = selected === g.series;
          const pct = g.setSize ? Math.round((g.setOwned / g.setSize) * 100) : 0;
          return (
              <li key={g.series}>
                <button type="button" onClick={() => onSelect(active ? null : g.series)} aria-pressed={active}
                        className={`w-full h-full flex items-center gap-3 rounded-3xl border bg-white/80 p-3 text-left motion-safe:transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${active ? "border-pc-accent ring-2 ring-pc-ring/40" : "border-pc-line"}`}>
                  <FigureArt name={g.character} className="w-14 h-14 rounded-2xl shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold leading-snug line-clamp-2">{g.series}</span>
                    <span className="block text-xs text-pc-muted mt-0.5">
                      {g.count} {g.count === 1 ? "figure" : "figures"}
                      {g.setSize > 0 && <> · <b className="text-pc-ink">{g.setOwned} / {g.setSize}</b> of the set</>}
                      {g.secretsOwned > 0 && <> · {g.secretsOwned} secret{g.secretsOwned > 1 ? "s" : ""}</>}
                    </span>
                    {g.setSize > 0 && (
                        <span className="mt-2 block h-1.5 rounded-full bg-pc-softer overflow-hidden" aria-hidden>
                          <span className="block h-full rounded-full bg-pc-accent" style={{ width: `${pct}%` }} />
                        </span>
                    )}
                  </span>
                  {g.setSize > 0 && g.setOwned === g.setSize && <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full bg-pc-accent text-white px-2 py-0.5">Complete</span>}
                </button>
              </li>
          );
        })}
      </ul>
  );
}
