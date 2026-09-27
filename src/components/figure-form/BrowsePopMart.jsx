import { useState } from "react";
import FigureArt from "../icons/FigureArt";
import { CHARACTERS, SERIES_LIST } from "../../data/characters";
import { normName } from "../../lib/format";
import { btn, inputCls } from "../../styles/theme";

const itemCls = "w-full flex items-center gap-3 rounded-xl bg-white border border-pc-line px-3 py-2 text-left hover:border-pc-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring";
const SecretBadge = () => <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F3EAD3] text-[#8A7340] px-2 py-0.5">Secret</span>;

// Pick a character, then a series, then the figure.
// onPick({ character, series, figure?, secret? }); without a figure the name is typed by hand.
export default function BrowsePopMart({ onPick }) {
  const [char, setChar] = useState(null);
  const [seriesName, setSeriesName] = useState(null);
  const [q, setQ] = useState("");
  const nq = normName(q);
  const match = (text) => !nq || normName(text).includes(nq);

  const character = char && CHARACTERS.find((c) => c.name === char);
  const series = seriesName && SERIES_LIST.find((s) => s.series === seriesName);
  const go = (nextChar, nextSeries) => { setChar(nextChar); setSeriesName(nextSeries); setQ(""); };

  const back = series ? () => go(char, null) : character ? () => go(null, null) : null;
  const placeholder = series ? `Search ${series.series} figures…` : character ? `Search ${character.name} series…` : "Search characters or series…";

  return (
      <div className="rounded-2xl border border-pc-line bg-pc-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          {back && <button type="button" onClick={back} className={`${btn} px-3 py-1.5 bg-white border border-pc-line-strong text-stone-600 hover:bg-pc-softer`} aria-label="Back">←</button>}
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Search Pop Mart list" />
        </div>

        {series ? <FigureList series={series} match={match} q={q} onPick={onPick} />
            : character ? <SeriesList character={character} match={match} q={q} onOpen={(s) => go(char, s.series)} onPick={onPick} />
            : <CharacterGrid match={match} q={q} onOpen={(c) => go(c.name, null)} />}
      </div>
  );
}

function CharacterGrid({ match, q, onOpen }) {
  const chars = CHARACTERS.filter((c) => match(c.name + " " + c.series.map((s) => s.name).join(" ")));
  if (!chars.length) return <p className="text-sm text-stone-500 text-center py-6">No character matches "{q}". Switch to <b>Type name</b> to enter it yourself.</p>;
  return (
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
        {chars.map((c) => (
            <li key={c.name}>
              <button type="button" onClick={() => onOpen(c)}
                      className="w-full rounded-2xl bg-white border border-pc-line p-2 text-center hover:border-pc-accent hover:-translate-y-0.5 motion-safe:transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">
                <FigureArt name={c.name} className="w-full aspect-square rounded-xl" />
                <span className="block text-xs font-bold mt-1.5 truncate">{c.name}</span>
                <span className="block text-[10px] text-stone-400">{c.series.length} series</span>
              </button>
            </li>
        ))}
      </ul>
  );
}

function SeriesList({ character, match, q, onOpen, onPick }) {
  const list = SERIES_LIST.filter((s) => s.character === character.name && (match(s.series) || match(character.name)));
  return (
      <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {list.map((s) => (
            <li key={s.series}>
              <button type="button" className={itemCls}
                      onClick={() => (s.figures.length ? onOpen(s) : onPick({ character: s.character, series: s.series }))}>
                <FigureArt name={character.name} className="w-9 h-9 rounded-lg shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold">{s.series}</span>
                  <span className="block text-xs text-stone-500">{s.figures.length ? `${s.figures.length} figures` : "No figure list yet · type the name"}</span>
                </span>
                <span className="text-pc-accent text-sm" aria-hidden>→</span>
              </button>
            </li>
        ))}
        {!list.length && <li className="text-sm text-stone-500 text-center py-4">No series matches "{q}".</li>}
      </ul>
  );
}

function FigureList({ series, match, q, onPick }) {
  const list = series.figures.filter((x) => match(x.figure));
  return (
      <>
        <ul className="grid sm:grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
          {list.map((x) => (
              <li key={x.figure}>
                <button type="button" className={itemCls}
                        onClick={() => onPick({ character: series.character, series: series.series, figure: x.figure, secret: x.secret })}>
                  <span className="flex-1 min-w-0 text-sm font-bold">{x.figure}</span>
                  {x.secret && <SecretBadge />}
                </button>
              </li>
          ))}
          {!list.length && <li className="sm:col-span-2 text-sm text-stone-500 text-center py-4">No figure matches "{q}".</li>}
        </ul>
        <button type="button" onClick={() => onPick({ character: series.character, series: series.series })}
                className="mt-2 text-xs font-bold text-pc-accent hover:underline">Not in the list? Type the name yourself →</button>
      </>
  );
}
