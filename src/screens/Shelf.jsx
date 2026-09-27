import { useState, useEffect, useRef, useMemo } from "react";
import ShelfHeader from "../components/shelf/ShelfHeader";
import ShelfHero from "../components/shelf/ShelfHero";
import FigureCard from "../components/shelf/FigureCard";
import Modal from "../components/ui/Modal";
import FigureForm from "../components/figure-form/FigureForm";
import PricePanel from "../components/prices/PricePanel";
import IdentifyPanel from "../components/identify/IdentifyPanel";
import { blankFigure, stats } from "../lib/figures";
import { downloadBackup, readBackup } from "../lib/backup";
import { btnPrimary, fontCss, inputCls, pageFont, serif } from "../styles/theme";

const SORTS = {
  delta: (a, b) => (b.s.delta ?? -1e9) - (a.s.delta ?? -1e9),
  value: (a, b) => (b.s.marketTotal ?? -1) - (a.s.marketTotal ?? -1),
  name: (a, b) => a.f.name.localeCompare(b.f.name),
  recent: (a, b) => b.f.bought.localeCompare(a.f.bought),
  stale: (a, b) => (a.s.last || "").localeCompare(b.s.last || ""),
};

// The main page after logging in: summary, search, the list of figures and the pop-up windows.
export default function Shelf({ user, initialFigs, onSync, onLogout, catalog, onContribute }) {
  const [figs, setFigs] = useState(initialFigs);
  const prevFigs = useRef(initialFigs);
  useEffect(() => { const before = prevFigs.current; prevFigs.current = figs; if (before !== figs) onSync(before, figs); }, [figs]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("delta");
  const [editing, setEditing] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    const list = figs.filter((f) => (f.name + " " + f.series + " " + f.notes).toLowerCase().includes(t)).map((f) => ({ f, s: stats(f) }));
    return list.sort(SORTS[sort]);
  }, [figs, q, sort]);

  const totals = useMemo(() => {
    let paid = 0, market = 0, count = 0, priced = 0;
    figs.forEach((f) => { const s = stats(f); count += f.qty; paid += s.paidTotal; if (s.marketTotal != null) { market += s.marketTotal; priced += s.paidTotal; } });
    return { paid, market, count, delta: market - priced, priced };
  }, [figs]);

  const save = (f) => { if (f.photo && !f.fromCatalog) onContribute(f); setFigs((xs) => (xs.some((x) => x.id === f.id) ? xs.map((x) => (x.id === f.id ? f : x)) : [f, ...xs])); setEditing(null); flash("Saved"); };
  const updateFig = (f) => { setFigs((xs) => xs.map((x) => (x.id === f.id ? f : x))); setPricing(f); };
  const remove = (f) => { if (confirm(`Delete "${f.name}"?`)) setFigs((xs) => xs.filter((x) => x.id !== f.id)); };

  const backup = () => { downloadBackup(figs, user); flash("Backup downloaded"); };
  const restore = (file) => {
    readBackup(file)
        .then((d) => { setFigs(d); flash(`Loaded ${d.length} figures`); })
        .catch(() => flash("That file isn't a valid backup"));
  };

  return (
      <div className="min-h-screen bg-[#FFF8F0] text-[#3D2E27]" style={pageFont}>
        <style>{fontCss}</style>

        <ShelfHeader user={user} onBackup={backup} onRestore={restore} onLogout={onLogout} />
        <ShelfHero user={user} catalogCount={Object.keys(catalog).length} totals={totals}
                   onAdd={() => setEditing(blankFigure())} onIdentify={() => setIdentifying(true)} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-2xl font-semibold mb-5" style={serif}>My shelf</h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative sm:max-w-sm w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" aria-hidden>⌕</span>
              <input className={inputCls + " pl-8"} placeholder="Search by name, series or notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search collection" />
            </div>
            <select className={inputCls + " sm:w-56"} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
              <option value="delta">Biggest gain</option>
              <option value="value">Highest value</option>
              <option value="stale">Needs price check</option>
              <option value="recent">Recently bought</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#EBDCCB] p-12 text-center">
                <p className="text-lg font-semibold mb-1">{figs.length ? "Nothing matches" : "Your shelf is empty"}</p>
                <p className="text-stone-500 text-sm mb-5">{figs.length ? "Try a different search." : "Add your first figure or identify one by photo."}</p>
                {!figs.length && <button onClick={() => setEditing(blankFigure())} className={btnPrimary}>+ Add figure</button>}
              </div>
          ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map(({ f, s }) => (
                    <FigureCard key={f.id} f={f} s={s} onPrices={() => setPricing(f)} onEdit={() => setEditing(f)} onDelete={() => remove(f)} />
                ))}
              </ul>
          )}

          <p className="text-xs text-stone-400 mt-12 max-w-2xl leading-relaxed">
            Your shelf is saved online automatically. Backup downloads a copy as a file, just in case.
            Estimated value is the median of prices logged in the last 60 days, or all prices if none are recent.
          </p>
        </main>

        {editing && (
            <Modal title={figs.some((x) => x.id === editing.id) ? "Edit figure" : "New figure"} onClose={() => setEditing(null)}>
              <FigureForm catalog={catalog} initial={{ ...editing, paid: String(editing.paid) }} onSave={save} onCancel={() => setEditing(null)} />
            </Modal>
        )}
        {pricing && (
            <Modal title={pricing.name} onClose={() => setPricing(null)}>
              <PricePanel key={pricing.id} fig={pricing} onUpdate={updateFig} />
            </Modal>
        )}
        {identifying && (
            <Modal title="Identify by photo" onClose={() => setIdentifying(false)}>
              <IdentifyPanel
                  figs={figs}
                  onOpen={(f) => { setIdentifying(false); setPricing(f); }}
                  onAddNew={(r) => { setIdentifying(false); setEditing(blankFigure({ photo: r.photo, sig: r.sig })); }}
              />
            </Modal>
        )}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#3D2E27] text-white text-sm px-4 py-2 shadow-lg z-50">{toast}</div>}
      </div>
  );
}
