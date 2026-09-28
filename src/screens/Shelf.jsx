import { useState, useEffect, useRef, useMemo } from "react";
import ShelfHeader from "../components/shelf/ShelfHeader";
import ShelfHero from "../components/shelf/ShelfHero";
import FigureCard from "../components/shelf/FigureCard";
import Modal from "../components/ui/Modal";
import FigureForm from "../components/figure-form/FigureForm";
import IdentifyPanel from "../components/identify/IdentifyPanel";
import ProfilePicture from "../components/profile/ProfilePicture";
import { blankFigure, collectionTotals, paidTotal } from "../lib/figures";
import { btnPrimary, fontCss, pageFont, serif } from "../styles/theme";

// Little four-point star, used as the search icon.
const Sparkle = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className={className}>
      <path d="M12 2.5c.6 4.6 2.4 6.9 7 7.5-4.6.6-6.4 2.9-7 7.5-.6-4.6-2.4-6.9-7-7.5 4.6-.6 6.4-2.9 7-7.5z" fill="currentColor" />
      <circle cx="19" cy="18.5" r="1.6" fill="currentColor" opacity=".55" />
    </svg>
);

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
              <Sparkle className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-pc-accent pointer-events-none" />
              <input className="pc-dreamy-field py-3 pl-11 pr-4 text-sm" placeholder="Search your shelf…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search collection" />
            </div>
            <div className="relative sm:w-56">
              <select className="pc-dreamy-field py-3 pl-5 pr-11 text-sm font-semibold" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
                <option value="recent">Recently bought</option>
                <option value="name">Name A–Z</option>
                <option value="series">Series</option>
                <option value="paid">Price paid</option>
              </select>
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden className="absolute right-4 top-1/2 -translate-y-1/2 text-pc-accent pointer-events-none">
                <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
