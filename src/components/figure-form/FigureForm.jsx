import { useState } from "react";
import Field from "../ui/Field";
import Thumb from "../ui/Thumb";
import PhotoPicker from "../ui/PhotoPicker";
import Icon from "../icons/Icon";
import NamePicker from "./NamePicker";
import { BOX_PRESETS, BOUGHT_FROM, CONDITIONS } from "../../lib/constants";
import { eur } from "../../lib/format";
import { popmartSearch } from "../../lib/links";
import { processPhoto } from "../../lib/photoRecognition";
import { btn, btnGhost, btnPrimary, inputCls } from "../../styles/theme";

// Add or edit a figure.

export default function FigureForm({ initial, onSave, onCancel, catalog = {} }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const valid = f.name.trim() && f.paid !== "" && !isNaN(Number(String(f.paid).replace(",", ".")));

  const handlePhoto = async (file) => {
    setBusy(true); setErr("");
    try { const { photo, sig } = await processPhoto(file); setF((x) => ({ ...x, photo, sig, fromCatalog: false })); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
      <form onSubmit={(e) => { e.preventDefault(); if (valid) onSave({ ...f, paid: Number(String(f.paid).replace(",", ".")), qty: Math.max(1, Number(f.qty) || 1) }); }} className="space-y-5">
        <div className="flex items-center gap-4">
          <Thumb src={f.photo} name={f.name} className="w-24 h-24 rounded-xl shrink-0" />
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <PhotoPicker onPhoto={handlePhoto} busy={busy} label={f.photo ? "Replace photo" : "Add photo"} />
              {f.photo && <button type="button" onClick={() => setF({ ...f, photo: null, sig: null })} className={`${btn} text-stone-500 hover:text-[#B0626A]`}>Remove</button>}
            </div>
            <p className="text-xs text-stone-500">{err || (f.fromCatalog && f.photo ? "Picture added from the community catalog. Replace it with your own anytime." : "Your photo is shared with the community catalog, so friends get this picture too.")}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NamePicker f={f} setF={setF} catalog={catalog} />
          <Field label="Series"><input className={inputCls} value={f.series} onChange={set("series")} placeholder="e.g. The Monsters – Have a Seat" /></Field>
          <div className="sm:col-span-2">
            <span className="block text-xs font-medium text-stone-500 mb-1.5">How did you get it?</span>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="How did you get it?">
              {[["box", <Icon.box />, "Mystery box", "Pulled from a blind box"], ["bought", <Icon.tag />, "Bought it", "Paid a specific price"]].map(([k, ic, t, d]) => (
                  <button type="button" key={k} role="radio" aria-checked={f.origin === k} onClick={() => setF({ ...f, origin: k })}
                          className={`text-left rounded-2xl border-2 p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${f.origin === k ? "border-pc-accent bg-pc-softer" : "border-pc-line bg-white hover:bg-pc-surface"}`}>
                    <span aria-hidden>{ic}</span>
                    <span className="block font-bold text-sm mt-1">{t}</span>
                    <span className="block text-xs text-stone-500">{d}</span>
                  </button>
              ))}
            </div>
          </div>
          {f.origin === "box" ? (
              <div className="sm:col-span-2 rounded-2xl bg-pc-surface p-4 space-y-3">
                <Field label="Box price on Pop Mart (€) *"><input className={inputCls} inputMode="decimal" value={f.paid} onChange={set("paid")} placeholder="12,90" /></Field>
                <div className="flex flex-wrap items-center gap-2">
                  {BOX_PRESETS.map((p) => (
                      <button type="button" key={p} onClick={() => setF({ ...f, paid: String(p).replace(".", ",") })}
                              className={`rounded-full px-3 py-1 text-sm border focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${Number(String(f.paid).replace(",", ".")) === p ? "bg-pc-accent text-white border-pc-accent" : "bg-white border-pc-line-strong hover:border-pc-accent"}`}>
                        {eur(p)}
                      </button>
                  ))}
                  <a href={popmartSearch(f.series || f.name)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-pc-accent hover:underline ml-1">Check price on Pop Mart ↗</a>
                </div>
                <p className="text-xs text-stone-500">Pick a typical box price or type the exact one from popmart.com.</p>
              </div>
          ) : (
              <>
                <Field label="Price you paid (€) *"><input className={inputCls} inputMode="decimal" value={f.paid} onChange={set("paid")} placeholder="25,00" /></Field>
                <Field label="Bought from">
                  <select className={inputCls} value={f.from} onChange={set("from")}><option value="">Choose…</option>{BOUGHT_FROM.map((x) => <option key={x}>{x}</option>)}</select>
                </Field>
              </>
          )}
          <Field label="Quantity"><input type="number" min="1" className={inputCls} value={f.qty} onChange={set("qty")} /></Field>
          <Field label="Bought on"><input type="date" className={inputCls} value={f.bought} onChange={set("bought")} /></Field>
          <Field label="Condition">
            <select className={inputCls} value={f.condition} onChange={set("condition")}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <Field label="Notes"><input className={inputCls} value={f.notes} onChange={set("notes")} placeholder="Where bought, trades…" /></Field>
          <label className="flex items-center gap-3 self-end pb-2 cursor-pointer text-sm text-stone-700">
            <input type="checkbox" checked={f.secret} onChange={set("secret")} className="w-4 h-4 accent-pc-accent" />
            Secret / chase figure
          </label>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
          <button disabled={!valid || busy} className={btnPrimary}>Save figure</button>
        </div>
      </form>
  );
}
