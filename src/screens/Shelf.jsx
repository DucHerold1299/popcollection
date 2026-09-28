import { useState, useEffect, useRef, useMemo } from "react";
import ShelfHeader from "../components/shelf/ShelfHeader";
import ShelfHero from "../components/shelf/ShelfHero";
import FigureCard from "../components/shelf/FigureCard";
import Modal from "../components/ui/Modal";
import FigureForm from "../components/figure-form/FigureForm";
import IdentifyPanel from "../components/identify/IdentifyPanel";
import ProfilePicture from "../components/profile/ProfilePicture";
import { blankFigure, collectionTotals, paidTotal } from "../lib/figures";
import { btnPrimary, fontCss, inputCls, pageFont, serif } from "../styles/theme";

const SORTS = {
  recent: (a, b) => b.bought.localeCompare(a.bought),
  name: (a, b) => a.name.localeCompare(b.name),
  series: (a, b) => (a.series || "~").localeCompare(b.series || "~") || a.name.localeCompare(b.name),
  paid: (a, b) => paidTotal(b) - paidTotal(a),
};

// The main page after logging in: summary, search, the list of figures and the pop-up windows.
export default function Shelf({ user, avatar, onChangeAvatar, initialFigs, onSync, onLogout, catalog, onContribute }) {
  const [figs, setFigs] = useState(initialFigs);
  const prevFigs = useRef(initialFigs);
  useEffect(() => { const before = prevFigs.current; prevFigs.current = figs; if (before !== figs) onSync(before, figs); }, [figs]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [editing, setEditing] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    return figs.filter((f) => (f.name + " " + f.series + " " + f.notes).toLowerCase().includes(t)).sort(SORTS[sort]);
  }, [figs, q, sort]);

  const totals = useMemo(() => collectionTotals(figs), [figs]);

  const save = (f) => { if (f.photo && !f.fromCatalog) onContribute(f); setFigs((xs) => (xs.some((x) => x.id === f.id) ? xs.map((x) => (x.id === f.id ? f : x)) : [f, ...xs])); setEditing(null); flash("Saved"); };
  const remove = (f) => { if (confirm(`Delete "${f.name}"?`)) setFigs((xs) => xs.filter((x) => x.id !== f.id)); };

  const changeAvatar = async (picture) => {
    await onChangeAvatar(picture);
    setProfileOpen(false);
    flash(picture ? "Profile picture saved" : "Profile picture removed");
  };

  return (
      <div className="min-h-screen bg-pc-bg text-pc-ink" style={pageFont}>
        <style>{fontCss}</style>

        <ShelfHeader user={user} avatar={avatar} onProfile={() => setProfileOpen(true)} onLogout={onLogout} />
        <ShelfHero user={user} avatar={avatar} onProfile={() => setProfileOpen(true)} totals={totals}
                   onAdd={() => setEditing(blankFigure())} onIdentify={() => setIdentifying(true)} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-2xl font-semibold mb-5" style={serif}>My shelf</h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative sm:max-w-sm w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" aria-hidden>⌕</span>
              <input className={inputCls + " pl-8"} placeholder="Search by name, series or notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search collection" />
            </div>
            <select className={inputCls + " sm:w-56"} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
              <option value="recent">Recently bought</option>
              <option value="name">Name A–Z</option>
              <option value="series">Series</option>
              <option value="paid">Price paid</option>
            </select>
          </div>

          {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pc-line-strong p-12 text-center">
                <p className="text-lg font-semibold mb-1">{figs.length ? "Nothing matches" : "Your shelf is empty"}</p>
                <p className="text-stone-500 text-sm mb-5">{figs.length ? "Try a different search." : "Add your first figure or identify one by photo."}</p>
                {!figs.length && <button onClick={() => setEditing(blankFigure())} className={btnPrimary}>+ Add figure</button>}
              </div>
          ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((f) => (
                    <FigureCard key={f.id} f={f} onEdit={() => setEditing(f)} onDelete={() => remove(f)} />
                ))}
              </ul>
          )}
        </main>

        {editing && (
            <Modal bare title={figs.some((x) => x.id === editing.id) ? "Edit figure" : "New figure"} onClose={() => setEditing(null)}>
              <FigureForm catalog={catalog} initial={{ ...editing, paid: String(editing.paid) }} onSave={save} onCancel={() => setEditing(null)} />
            </Modal>
        )}
        {identifying && (
            <Modal title="Identify by photo" onClose={() => setIdentifying(false)}>
              <IdentifyPanel
                  figs={figs}
                  onOpen={(f) => { setIdentifying(false); setEditing(f); }}
                  onAddNew={(r) => { setIdentifying(false); setEditing(blankFigure({ photo: r.photo, sig: r.sig })); }}
              />
            </Modal>
        )}
        {profileOpen && (
            <Modal title="Profile picture" onClose={() => setProfileOpen(false)}>
              <ProfilePicture user={user} avatar={avatar} onSave={changeAvatar} />
            </Modal>
        )}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-pc-ink text-white text-sm px-4 py-2 shadow-lg z-50">{toast}</div>}
      </div>
  );
}
