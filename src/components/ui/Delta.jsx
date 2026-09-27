import { eur } from "../../lib/format";

export default function Delta({ v, pct, bold = false }) {
  if (v == null) return <span className="text-stone-400 font-normal">no price data</span>;
  const up = v >= 0;
  return (
      <span className={`tabular-nums ${up ? "text-[#4F7F5E]" : "text-[#B0626A]"} ${bold ? "" : "font-medium"}`}>
      {up ? "↑" : "↓"} {eur(Math.abs(v))}{pct != null && isFinite(pct) ? ` (${up ? "+" : "−"}${Math.abs(pct).toFixed(0)}%)` : ""}
    </span>
  );
}
