import Icon from "../icons/Icon";
import Thumb from "../ui/Thumb";
import { eur } from "../../lib/format";

// One figure on the shelf.
export default function FigureCard({ f, onEdit, onDelete }) {
  return (
      <li className="rounded-3xl bg-white border border-pc-line overflow-hidden flex flex-col shadow-[0_6px_20px_-12px_rgb(var(--pc-shadow)/0.35)] hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgb(var(--pc-shadow)/0.45)] motion-safe:transition-all">
        <div className="flex gap-4 p-4">
          <Thumb src={f.photo} name={f.name} className="w-20 h-20 rounded-2xl shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-stone-500 truncate">{f.series || "No series"}</p>
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-pc-softer text-pc-accent-strong px-2 py-0.5">{f.origin === "bought" ? <><Icon.bag />{f.from || "Bought"}</> : <><Icon.miniBox />Box</>}</span>
              {f.secret && <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F3EAD3] text-[#8A7340] px-2 py-0.5">Secret</span>}
            </div>
            <h3 className="font-semibold leading-snug mt-0.5">{f.name}{f.qty > 1 && <span className="text-sm font-normal text-stone-400"> ×{f.qty}</span>}</h3>
            <p className="text-xs text-stone-400 mt-1">{f.condition} · {new Date(f.bought).toLocaleDateString("de-DE")}</p>
          </div>
        </div>
        <div className="px-4 pb-4 flex-1 space-y-3">
          {f.notes && <p className="text-sm text-stone-500 italic">“{f.notes}”</p>}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-pc-surface px-3 py-2 text-sm">
            <span className="text-stone-500">Paid</span>
            <span className="font-medium tabular-nums">{eur(f.paid)}{f.qty > 1 && <span className="text-stone-400 font-normal"> each</span>}</span>
          </div>
        </div>
        <div className="flex border-t border-stone-100 text-sm">
          <button onClick={onEdit} className="flex-1 py-2.5 font-medium text-pc-accent hover:bg-pc-softer focus:outline-none focus-visible:bg-pc-softer">Edit</button>
          <button onClick={onDelete} className="flex-1 py-2.5 text-stone-400 border-l border-stone-100 hover:text-[#B0626A] hover:bg-[#FBF3F3] focus:outline-none focus-visible:bg-[#FBF3F3]">Delete</button>
        </div>
      </li>
  );
}
