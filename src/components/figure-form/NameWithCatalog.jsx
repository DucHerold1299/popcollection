import React, { useState, useRef } from "react";
import Field from "../ui/Field";
import FigureArt from "../icons/FigureArt";
import { SERIES_LIST, FIGURE_LIST } from "../../data/characters";
import { normName } from "../../lib/format";
import { inputCls } from "../../styles/theme";

// Name input with suggestions: pictures from the community catalog, figures, then series.

const GROUP_LABEL = { photo: "With picture", figure: "Figures", series: "Series" };

export default function NameWithCatalog({ f, setF, catalog }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);
  const q = normName(f.name);

  const inChosenSeries = (x) => normName(x.series) === normName(f.series || "");
  const photoHits = q.length < 2 ? [] : Object.values(catalog)
      .filter((c) => normName(c.name + " " + (c.series || "")).includes(q)).slice(0, 4)
      .map((c) => ({ type: "photo", key: "p-" + c.key, c }));
  // Figures from the already chosen series come first.
  const figureHits = q.length < 2 ? [] : FIGURE_LIST
      .filter((x) => normName(x.name + " " + x.series).includes(q) && normName(x.name) !== q)
      .sort((a, b) => inChosenSeries(b) - inChosenSeries(a)).slice(0, 16)
      .map((x) => ({ type: "figure", key: "f-" + x.series + "-" + x.figure, x }));
  const seriesHits = q.length < 2 ? [] : SERIES_LIST
      .filter((x) => normName(x.character + " " + x.series).includes(q) && !inChosenSeries(x)).slice(0, 5)
      .map((x) => ({ type: "series", key: "s-" + x.series, x }));
  const hits = [...photoHits, ...figureHits, ...seriesHits];

  const title = (h) => (h.type === "photo" ? h.c.name : h.type === "figure" ? h.x.name : h.x.series);
  const subtitle = (h) => (h.type === "photo" ? `${h.c.series || "No series"} · photo by ${h.c.by}`
      : h.type === "figure" ? h.x.series
      : `${h.x.character} · ${h.x.figures.length ? `${h.x.figures.length} figures` : "then type the figure's name"}`);

  const pick = (h) => {
    if (h.type === "photo") {
      const c = h.c;
      setF((x) => ({ ...x, name: c.name, series: x.series || c.series, photo: x.photo || c.photo, sig: x.sig || c.sig, fromCatalog: !x.photo }));
      setOpen(false);
    } else if (h.type === "figure") {
      setF((x) => ({ ...x, name: h.x.name, series: h.x.series, secret: h.x.secret }));
      setOpen(false);
    } else {
      // Pick a series: fill the series and start the name, then show that series' figures to pick from.
      setF((x) => ({ ...x, series: h.x.series, name: `${h.x.character} – `, secret: false }));
      setHi(0);
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
      <div className="relative">
        <Field label="Figure name *">
          <input ref={inputRef} autoFocus onFocusCapture={(e) => { const v = e.target.value; e.target.setSelectionRange?.(v.length, v.length); }} className={inputCls} value={f.name} placeholder="Start typing, e.g. Nyota"
                 role="combobox" aria-expanded={open && hits.length > 0} aria-autocomplete="list"
                 onFocus={() => setOpen(true)}
                 onChange={(e) => { setF((x) => ({ ...x, name: e.target.value })); setOpen(true); setHi(0); }}
                 onBlur={() => setTimeout(() => setOpen(false), 150)}
                 onKeyDown={(e) => {
                   if (!open || !hits.length) return;
                   if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % hits.length); }
                   if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + hits.length) % hits.length); }
                   if (e.key === "Enter") { e.preventDefault(); pick(hits[hi]); }
                   if (e.key === "Escape") setOpen(false);
                 }} />
        </Field>
        {f.series && <p className="text-xs text-stone-500 mt-1">Series: <b className="text-pc-ink">{f.series}</b></p>}
        {open && hits.length > 0 && (
            <ul role="listbox" className="absolute z-10 mt-1 w-full sm:w-[150%] max-h-80 overflow-y-auto bg-white rounded-2xl border border-pc-line shadow-xl">
              {hits.map((h, i) => {
                const header = i === 0 || hits[i - 1].type !== h.type;
                return (
                    <React.Fragment key={h.key}>
                      {header && (
                          <li className="px-3 pt-2 pb-1 text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                            {GROUP_LABEL[h.type]}
                          </li>
                      )}
                      <li role="option" aria-selected={i === hi}>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(h)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left ${i === hi ? "bg-pc-softer" : "hover:bg-pc-surface"}`}>
                          {h.type === "photo"
                              ? <img src={h.c.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                              : <FigureArt name={h.x.character} className="w-10 h-10 rounded-xl" />}
                          <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <span className="truncate">{title(h)}</span>
                        {h.type === "figure" && h.x.secret && <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F3EAD3] text-[#8A7340] px-2 py-0.5">Secret</span>}
                      </span>
                      <span className="block text-xs text-stone-500 truncate">{subtitle(h)}</span>
                    </span>
                        </button>
                      </li>
                    </React.Fragment>
                );
              })}
            </ul>
        )}
      </div>
  );
}
