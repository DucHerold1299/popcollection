// The whole set of a series: figures you own are ticked, missing ones are dashed.
export default function SeriesChecklist({ group, onClose }) {
  return (
      <section className="rounded-3xl border border-pc-line bg-white/80 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold">{group.series}</h3>
            <p className="text-xs text-pc-muted mt-0.5">
              {group.setOwned} of {group.setSize} figures
              {group.secretsTotal > 0 && ` · ${group.secretsOwned} of ${group.secretsTotal} secret${group.secretsTotal > 1 ? "s" : ""}`}
              {group.setOwned < group.setSize && ` · ${group.setSize - group.setOwned} missing`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-pc-accent hover:bg-pc-softer focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">Show all figures</button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {group.checklist.map((x) => (
              <li key={x.figure}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${x.owned ? "bg-pc-softer text-pc-ink font-bold border border-pc-ring/60" : "border border-dashed border-pc-line-strong text-pc-muted"}`}>
                {x.owned
                    ? <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden className="text-pc-accent"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <span className="sr-only">Missing: </span>}
                {x.figure}
                {x.secret && <span className="text-[9px] font-bold uppercase tracking-wide text-[#8A7340]">Secret</span>}
              </li>
          ))}
        </ul>
      </section>
  );
}
