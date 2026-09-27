import { eur } from "../../lib/format";

export default function Bar({ label, value, max, color }) {
  return (
      <div className="flex items-center gap-3 text-sm">
        <span className="w-36 shrink-0 truncate text-stone-600">{label}</span>
        <div className="flex-1 h-2.5 rounded-full bg-stone-100 overflow-hidden">
          <div className="h-full rounded-full motion-safe:transition-all" style={{ width: `${(value / max) * 100}%`, background: color }} />
        </div>
        <span className="w-20 text-right font-medium tabular-nums text-pc-ink">{eur(value)}</span>
      </div>
  );
}
