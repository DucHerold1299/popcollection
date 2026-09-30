import { useState } from "react";
import Field from "../ui/Field";
import Thumb from "../ui/Thumb";
import PhotoPicker from "../ui/PhotoPicker";
import Icon from "../icons/Icon";
import NamePicker from "./NamePicker";
import { BOUGHT_FROM, CONDITIONS } from "../../lib/constants";
import { processPhoto } from "../../lib/photoRecognition";
import { btn, btnGhost, btnPrimary, inputCls } from "../../styles/theme";

// Add or edit a figure.

export default function FigureForm({ initial, onSave, onCancel, catalog = {} }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const isGift = f.origin === "gift";
  const valid = f.name.trim();

  const handlePhoto = async (file) => {
    setBusy(true); setErr("");
    try { const { photo, sig } = await processPhoto(file); setF((x) => ({ ...x, photo, sig, fromCatalog: false })); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
      <form onSubmit={(e) => { e.preventDefault(); if (valid) onSave({ ...f, qty: Math.max(1, Number(f.qty) || 1) }); }} className="space-y-5">
        <div className="flex items-center gap-4">
          <Thumb src={f.photo} name={f.name} className="w-24 h-24 rounded-xl shrink-0" />
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <PhotoPicker onPhoto={handlePhoto} busy={busy} cameraLabel={f.photo ? "New photo" : "Take photo"} />
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
            <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="How did you get it?">
              {[["box", <Icon.box />, "Mystery box", "Pulled from a blind box"], ["bought", <Icon.tag />, "Bought it", "From a shop or seller"], ["gift", <Icon.gift />, "Gift", "Someone gave it to you"]].map(([k, ic, t, d]) => (
                  <button type="button" key={k} role="radio" aria-checked={f.origin === k} onClick={() => setF({ ...f, origin: k })}
                          className={`text-left rounded-2xl border-2 p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${f.origin === k ? "border-pc-accent bg-pc-softer" : "border-pc-line bg-white hover:bg-pc-surface"}`}>
                    <span aria-hidden>{ic}</span>
                    <span className="block font-bold text-sm mt-1">{t}</span>
                    <span className="hidden sm:block text-xs text-stone-500">{d}</span>
                  </button>
              ))}
            </div>
          </div>
          {isGift && (
              <div className="sm:col-span-2">
                <Field label="Who gave it to you?"><input className={inputCls} value={f.giftFrom || ""} onChange={set("giftFrom")} placeholder="e.g. Mia, for my birthday" /></Field>
              </div>
          )}
          {f.origin === "bought" && (
              <div className="sm:col-span-2">
                <Field label="Bought from">
                  <select className={inputCls} value={f.from} onChange={set("from")}><option value="">Choose…</option>{BOUGHT_FROM.map((x) => <option key={x}>{x}</option>)}</select>
                </Field>
              </div>
          )}
          <Field label="Quantity"><input type="number" min="1" className={inputCls} value={f.qty} onChange={set("qty")} /></Field>
          {/* Gifts have no date field; they keep the day they were added (used for "Newest first").
              Otherwise: pick the date, or tap "I don't know" if you don't remember it. */}
          {!isGift && (
              <div>
                <span className="block text-xs font-medium text-stone-500 mb-1.5">Bought on</span>
                <div className="flex gap-2">
                  {f.dateUnknown
                      ? <div className={`${inputCls} text-stone-400 flex items-center`}>Don't remember</div>
                      : <input type="date" aria-label="Bought on" className={inputCls} value={f.bought} onChange={set("bought")} />}
                  <button type="button" aria-pressed={!!f.dateUnknown} onClick={() => setF({ ...f, dateUnknown: !f.dateUnknown })}
                          className={`shrink-0 rounded-xl px-3 text-sm font-bold border focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${f.dateUnknown ? "bg-pc-accent text-white border-pc-accent" : "bg-white text-pc-muted border-pc-line-strong hover:border-pc-accent"}`}>
                    I don't know
                  </button>
                </div>
              </div>
          )}
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
