import { useState } from "react";
import FigureArt from "../icons/FigureArt";
import { CHARACTERS } from "../../data/characters";
import { normName } from "../../lib/format";
import { btn, inputCls } from "../../styles/theme";

// Pick a character, then one of its series.

export default function BrowsePopMart({ onPick }) {
  const [char, setChar] = useState(null);
  const [q, setQ] = useState("");
  const nq = normName(q);
  const chars = CHARACTERS.filter((c) => !nq || normName(c.name + " " + c.series.join(" ")).includes(nq));
  const current = char && CHARACTERS.find((c) => c.name === char);
  const series = current ? current.series.filter((x) => !nq || normName(x).includes(nq) || normName(current.name).includes(nq)) : [];

  return (
      <div className="rounded-2xl border border-pc-line bg-pc-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          {current && (
              <button type="button" onClick={() => { setChar(null); setQ(""); }} className={`${btn} px-3 py-1.5 bg-white border border-pc-line-strong text-stone-600 hover:bg-pc-softer`} aria-label="Back to all characters">← All</button>
          )}
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder={current ? `Search ${current.name} series…` : "Search characters or series…"} aria-label="Search Pop Mart list" />
        </div>

        {!current ? (
            chars.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-6">No character matches "{q}". Switch to <b>Type name</b> to enter it yourself.</p>
            ) : (
                <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                  {chars.map((c) => (
                      <li key={c.name}>
                        <button type="button" onClick={() => { setChar(c.name); setQ(""); }}
                                className="w-full rounded-2xl bg-white border border-pc-line p-2 text-center hover:border-pc-accent hover:-translate-y-0.5 motion-safe:transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">
                          <FigureArt name={c.name} className="w-full aspect-square rounded-xl" />
                          <span className="block text-xs font-bold mt-1.5 truncate">{c.name}</span>
                          <span className="block text-[10px] text-stone-400">{c.series.length} series</span>
                        </button>
                      </li>
                  ))}
                </ul>
            )
        ) : (
            <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {series.map((x) => (
                  <li key={x}>
                    <button type="button" onClick={() => onPick({ character: current.name, series: x })}
                            className="w-full flex items-center gap-3 rounded-xl bg-white border border-pc-line px-3 py-2 text-left hover:border-pc-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">
                      <FigureArt name={current.name} className="w-9 h-9 rounded-lg shrink-0" />
                      <span className="text-sm font-bold flex-1">{x}</span>
                      <span className="text-pc-accent text-sm" aria-hidden>→</span>
                    </button>
                  </li>
              ))}
              {series.length === 0 && <li className="text-sm text-stone-500 text-center py-4">No series matches "{q}".</li>}
            </ul>
        )}
        <p className="text-[11px] text-stone-400 mt-2">Missing a series? Switch to <b>Type name</b> and enter it yourself.</p>
      </div>
  );
}
