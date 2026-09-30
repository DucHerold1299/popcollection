import { useEffect, useState } from "react";
import Logo from "../icons/Logo";
import Avatar from "../ui/Avatar";
import Icon from "../icons/Icon";
import { HERO_IMAGE } from "../../lib/heroImages";
import { loadPictureColors } from "../../lib/theme";

// Used when there is no background picture: the theme colors.
const THEME_GRADIENT = "rgb(var(--pc-accent-strong)), rgb(var(--pc-accent)), rgb(var(--pc-ink)), rgb(var(--pc-accent-strong))";
import { btnGhost, btnPrimary, serif } from "../../styles/theme";

function StatCard({ label, value, detail, bg, icon }) {
  return (
      <div className={`${bg} rounded-3xl p-5 min-w-0`}>
        <div className="mb-2" aria-hidden>{icon}</div>
        <div className="text-xs font-bold text-pc-muted">{label}</div>
        <div className={`font-extrabold mt-0.5 tabular-nums ${detail ? "text-sm sm:text-base leading-snug line-clamp-2" : "text-lg sm:text-2xl"}`}>{value}</div>
        {detail && <div className="text-xs text-pc-muted mt-0.5">{detail}</div>}
      </div>
  );
}

// Greeting, the two main buttons and the four summary numbers, on the background picture from src/assets/hero/.
export default function ShelfHero({ user, avatar, totals, onAdd, onIdentify, onProfile }) {
  // "Hi …" is colored with the main colors of the background picture.
  const [colors, setColors] = useState(null);
  useEffect(() => { loadPictureColors(HERO_IMAGE).then(setColors); }, []);
  const gradient = `linear-gradient(90deg, ${colors ? [...colors, colors[0]].join(", ") : THEME_GRADIENT})`;

  return (
      <section className="relative overflow-hidden">
        {HERO_IMAGE ? (
            <>
              <img src={HERO_IMAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
              {/* Light fade on the left so "Hi …" stays readable, and at the bottom so the picture blends into the page. */}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-pc-bg/85 via-pc-bg/30 to-transparent" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-pc-bg" />
            </>
        ) : (
            <>
              <div aria-hidden className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-pc-decor1 opacity-70" />
              <div aria-hidden className="absolute top-40 -left-24 w-64 h-64 rounded-full bg-pc-decor2 opacity-60" />
              <div aria-hidden className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full bg-pc-decor3 opacity-70" />
            </>
        )}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-12 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h1 className="flex items-center gap-3 text-4xl sm:text-5xl font-semibold tracking-tight" style={serif}>
              <span className="pc-dreamy-text pb-1" style={{ backgroundImage: gradient }}>Hi {user}</span>
              {/* Your profile picture (tap to change it); the logo until you've set one. */}
              <button type="button" onClick={onProfile} aria-label="Change profile picture" title="Change profile picture"
                      className="rounded-full hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring focus-visible:ring-offset-2">
                {avatar ? <Avatar src={avatar} name={user} size={52} /> : <Logo size={52} />}
              </button>
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onAdd} className={`${btnPrimary} px-6 py-3 text-base rounded-full`}>+ Add a figure</button>
              <button onClick={onIdentify} className={`${btnGhost} px-6 py-3 text-base rounded-full`}><span className="inline-flex items-center gap-2"><Icon.camera />Identify by photo</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="On the shelf" value={totals.count} bg="bg-pc-decor1" icon={<Icon.figure />} />
            <StatCard label="Top collection" bg="bg-pc-decor2" icon={<Icon.crown />}
                      value={totals.top ? totals.top.series : "–"}
                      detail={totals.top ? `${totals.top.count} ${totals.top.count === 1 ? "figure" : "figures"}` : "Add figures with a series"} />
            <StatCard label="Series" value={totals.series} bg="bg-pc-decor3" icon={<Icon.box />} />
            <StatCard label="Secrets" value={totals.secrets} bg="bg-pc-decor4" icon={<Icon.secret />} />
          </div>
        </div>
      </section>
  );
}
