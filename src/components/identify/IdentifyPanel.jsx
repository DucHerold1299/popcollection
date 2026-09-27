import { useState } from "react";
import PhotoPicker from "../ui/PhotoPicker";
import Thumb from "../ui/Thumb";
import { processPhoto, similarity } from "../../lib/photoRecognition";
import { btnPrimary } from "../../styles/theme";

// Take a photo and find the most similar figures in the collection.

export default function IdentifyPanel({ figs, onOpen, onAddNew }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const withPhotos = figs.filter((f) => f.sig);

  const handle = async (file) => {
    setBusy(true); setErr(""); setResult(null);
    try {
      const p = await processPhoto(file);
      const matches = withPhotos.map((f) => ({ f, score: similarity(p.sig, f.sig) })).sort((a, b) => b.score - a.score).slice(0, 3);
      setResult({ ...p, matches });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const label = (s) => (s > 0.8 ? "Strong match" : s > 0.65 ? "Possible match" : "Weak match");

  return (
      <div className="space-y-5">
        <p className="text-sm text-stone-600">
          Snap your figure on a plain background, roughly centred. The app compares it with the photos of figures already in your collection.
        </p>
        {withPhotos.length === 0 && (
            <div className="rounded-xl bg-[#F6F1E7] text-[#7A6A45] text-sm p-4">
              None of your figures has a photo yet, so there's nothing to compare against. Take a photo anyway and save it as a new figure. Next time it can be recognised.
            </div>
        )}
        <div className="flex items-center gap-3">
          <PhotoPicker onPhoto={handle} busy={busy} label={result ? "Try another photo" : "Take or upload photo"} />
          {err && <span className="text-sm text-[#B0626A]">{err}</span>}
        </div>

        {result && (
            <div className="grid sm:grid-cols-[140px_1fr] gap-5">
              <img src={result.photo} alt="Your photo" className="w-36 h-36 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">{result.matches.length ? "Best matches in your collection" : "No figures to compare with"}</h3>
                <ul className="space-y-2">
                  {result.matches.map(({ f, score }, i) => (
                      <li key={f.id}>
                        <button onClick={() => onOpen(f)} className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left hover:bg-pc-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${i === 0 && score > 0.65 ? "border-pc-ring bg-pc-softer" : "border-stone-200"}`}>
                          <Thumb src={f.photo} name={f.name} className="w-12 h-12 rounded-xl shrink-0" />
                          <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-pc-ink truncate">{f.name}</span>
                      <span className="block text-xs text-stone-500">{label(score)} · {Math.round(score * 100)}%</span>
                    </span>
                          <span className="text-xs text-pc-accent font-medium pr-1">Open →</span>
                        </button>
                      </li>
                  ))}
                </ul>
                <button onClick={() => onAddNew(result)} className={`${btnPrimary} mt-4`}>Not in my collection, add as new figure</button>
              </div>
            </div>
        )}
      </div>
  );
}
