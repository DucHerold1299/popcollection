import Logo from "../icons/Logo";
import Icon from "../icons/Icon";
import Delta from "../ui/Delta";
import { eur } from "../../lib/format";
import { btnGhost, btnPrimary, serif } from "../../styles/theme";

function StatCard({ label, value, bg, icon }) {
  return (
      <div className={`${bg} rounded-3xl p-5`}>
        <div className="mb-2" aria-hidden>{icon}</div>
        <div className="text-xs font-bold text-pc-muted">{label}</div>
        <div className="text-lg sm:text-2xl font-extrabold mt-0.5 tabular-nums">{value}</div>
      </div>
  );
}

// Greeting, the two main buttons and the four summary numbers.
export default function ShelfHero({ user, catalogCount, totals, onAdd, onIdentify }) {
  return (
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-pc-decor1 opacity-70" />
        <div aria-hidden className="absolute top-40 -left-24 w-64 h-64 rounded-full bg-pc-decor2 opacity-60" />
        <div aria-hidden className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full bg-pc-decor3 opacity-70" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-12 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h1 className="flex items-center gap-3 text-4xl sm:text-5xl font-semibold tracking-tight" style={serif}>
              Hi {user} <Logo size={52} />
            </h1>
            <p className="mt-3 text-sm text-pc-muted"><b className="text-pc-ink">{catalogCount}</b> figure pictures in the community catalog</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onAdd} className={`${btnPrimary} px-6 py-3 text-base rounded-full`}>+ Add a figure</button>
              <button onClick={onIdentify} className={`${btnGhost} px-6 py-3 text-base rounded-full`}><span className="inline-flex items-center gap-2"><Icon.camera />Identify by photo</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="On the shelf" value={totals.count} bg="bg-pc-decor1" icon={<Icon.figure />} />
            <StatCard label="Total paid" value={eur(totals.paid)} bg="bg-pc-decor2" icon={<Icon.box />} />
            <StatCard label="Worth today" value={eur(totals.market)} bg="bg-pc-decor3" icon={<Icon.tag />} />
            <StatCard label="Gain / loss" value={<Delta bold v={totals.priced ? totals.delta : null} />} bg="bg-pc-decor4" icon={<Icon.secret />} />
          </div>
        </div>
      </section>
  );
}
