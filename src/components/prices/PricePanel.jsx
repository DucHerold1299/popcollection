import { useState } from "react";
import Field from "../ui/Field";
import Delta from "../ui/Delta";
import Thumb from "../ui/Thumb";
import Bar from "../ui/Bar";
import { SOURCES, SRC_COLOR } from "../../lib/constants";
import { uid, today, eur, median } from "../../lib/format";
import { searchLinks } from "../../lib/links";
import { stats } from "../../lib/figures";
import { btnPrimary, inputCls } from "../../styles/theme";

// Look up prices, log them and compare against what you paid.

function StepHeading({ n, children }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-pc-ink mb-3">
      <span className="w-5 h-5 rounded-full bg-pc-soft text-pc-accent text-xs flex items-center justify-center">{n}</span>{children}
    </h3>
  );
}

export default function PricePanel({ fig, onUpdate }) {
  const [src, setSrc] = useState(SOURCES[0]);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(today());
  const [query, setQuery] = useState(fig.name.replace(/–/g, " ").replace(/\s+/g, " ").trim());
  const s = stats(fig);
  const bySrc = SOURCES.map((name) => {
    const ps = fig.checks.filter((c) => c.source === name).map((c) => c.price);
    return { name, med: median(ps), n: ps.length };
  }).filter((x) => x.n);
  const max = Math.max(...bySrc.map((x) => x.med), Number(fig.paid) || 0, 1);
  const valid = price !== "" && !isNaN(Number(price.replace(",", ".")));

  const add = (e) => {
    e.preventDefault();
    if (!valid) return;
    onUpdate({ ...fig, checks: [...fig.checks, { id: uid(), source: src, price: Number(price.replace(",", ".")), date }] });
    setPrice("");
  };


  return (
      <div className="space-y-7">
        <div className="flex items-center gap-4">
          <Thumb src={fig.photo} name={fig.name} className="w-16 h-16 rounded-xl shrink-0" />
          <div className="text-sm text-stone-500">{fig.series || "No series"} · paid <span className="text-pc-ink font-medium">{eur(fig.paid)}</span></div>
        </div>

        <section>
          <StepHeading n="1">Look it up</StepHeading>
          <input className={inputCls + " mb-3"} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search term" />
          <div className="flex flex-wrap gap-2">
            {searchLinks(query).map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-pc-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">
                  <span className="w-2 h-2 rounded-full" style={{ background: SRC_COLOR[l.name] }} />{l.name} ↗
                </a>
            ))}
          </div>
        </section>

        <section>
          <StepHeading n="2">Log what you found</StepHeading>
          <form onSubmit={add} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
            <Field label="Source"><select className={inputCls} value={src} onChange={(e) => setSrc(e.target.value)}>{SOURCES.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Price €"><input className={inputCls} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29,00" /></Field>
            <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <button disabled={!valid} className={`${btnPrimary} h-[38px]`}>Add</button>
          </form>
        </section>

        <section>
          <StepHeading n="3">Compare</StepHeading>
          {bySrc.length === 0 ? (
              <p className="text-sm text-stone-500 rounded-xl bg-pc-surface p-4 text-center">No prices logged yet. Search above, then add a few listings.</p>
          ) : (
              <div className="space-y-3">
                <Bar label="You paid" value={Number(fig.paid)} max={max} color="#C9B6A4" />
                {bySrc.map((b) => <Bar key={b.name} label={`${b.name} (${b.n})`} value={b.med} max={max} color={SRC_COLOR[b.name]} />)}
                <div className="flex flex-wrap justify-between gap-2 pt-4 mt-2 border-t border-stone-200 text-sm text-stone-600">
                  <span>Estimated value <span className="text-pc-ink font-semibold">{eur(s.market)}</span></span>
                  <Delta v={s.market != null ? s.market - fig.paid : null} pct={fig.paid ? ((s.market - fig.paid) / fig.paid) * 100 : null} />
                </div>
              </div>
          )}
        </section>

        {fig.checks.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-pc-ink mb-2">History</h3>
              <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200">
                {[...fig.checks].sort((a, b) => b.date.localeCompare(a.date)).map((c) => (
                    <li key={c.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SRC_COLOR[c.source] }} />
                      <span className="flex-1 text-stone-700">{c.source}</span>
                      <span className="text-stone-400 tabular-nums">{new Date(c.date).toLocaleDateString("de-DE")}</span>
                      <span className="font-medium tabular-nums w-20 text-right text-pc-ink">{eur(c.price)}</span>
                      <button onClick={() => onUpdate({ ...fig, checks: fig.checks.filter((x) => x.id !== c.id) })}
                              aria-label={`Delete ${c.source} price`} className="text-stone-300 hover:text-[#B0626A] px-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">✕</button>
                    </li>
                ))}
              </ul>
            </section>
        )}
      </div>
  );
}
