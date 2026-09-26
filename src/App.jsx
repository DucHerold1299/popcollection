import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "./supabase";

const SOURCES = ["Vinted", "Kleinanzeigen", "eBay (sold)", "Other"];
const SRC_COLOR = { Vinted: "#7FA9A8", Kleinanzeigen: "#9BAE7C", "eBay (sold)": "#C98E88", Other: "#A59D94" };
const ORIGINS = { box: "Mystery box", bought: "Bought" };
const BOX_PRESETS = [12.9, 13.9, 15, 17.9, 22];
const BOUGHT_FROM = ["Pop Mart store", "Vinted", "Kleinanzeigen", "eBay", "Friend / trade", "Other"];
const popmartSearch = (q) => `https://www.popmart.com/de/search?keyword=${encodeURIComponent(q || "")}`;
const CONDITIONS = ["Sealed box", "Opened, with card", "Loose"];

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const eur = (n) => (n == null || isNaN(n) ? "–" : n.toLocaleString("de-DE", { style: "currency", currency: "EUR" }));
const median = (arr) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const daysAgo = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);

const searchLinks = (q) => {
  const e = encodeURIComponent(q);
  return [
    { name: "Vinted", url: `https://www.vinted.de/catalog?search_text=${e}&order=price_low_to_high` },
    { name: "Kleinanzeigen", url: `https://www.kleinanzeigen.de/s-${encodeURIComponent(q.trim().replace(/\s+/g, "-"))}/k0` },
    { name: "eBay (sold)", url: `https://www.ebay.de/sch/i.html?_nkw=${e}&LH_Sold=1&LH_Complete=1` },
  ];
};

/* ---------- Photo recognition (runs fully in the browser) ---------- */
// Each photo gets a "fingerprint": a colour histogram of the centre area + a tiny
// grayscale shape map. New photos are compared against the fingerprints of
// figures already in the collection.
function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Could not read that image"));
    img.src = URL.createObjectURL(file);
  });
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, max ? d / max : 0, max];
}

async function processPhoto(file) {
  const img = await loadImage(file);
  // centre square crop
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2, sy = (img.height - side) / 2;

  const thumb = document.createElement("canvas");
  thumb.width = thumb.height = 320;
  thumb.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, 320, 320);
  const photo = thumb.toDataURL("image/jpeg", 0.78);

  // colour histogram on inner 70% (figure usually sits in the middle)
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const inset = side * 0.15;
  ctx.drawImage(img, sx + inset, sy + inset, side - 2 * inset, side - 2 * inset, 0, 0, 64, 64);
  const px = ctx.getImageData(0, 0, 64, 64).data;
  const H = 12, S = 3, V = 3;
  const hist = new Array(H * S * V + 3).fill(0);
  for (let i = 0; i < px.length; i += 4) {
    const [h, s, v] = rgbToHsv(px[i], px[i + 1], px[i + 2]);
    if (s < 0.12) { hist[H * S * V + Math.min(2, Math.floor(v * 3))]++; continue; } // greys/white/black
    const bin = Math.floor(h / 30) * S * V + Math.min(S - 1, Math.floor(s * S)) * V + Math.min(V - 1, Math.floor(v * V));
    hist[bin]++;
  }
  const total = 64 * 64;
  const colour = hist.map((x) => x / total);

  // 16x16 grayscale shape map, normalised
  const g = document.createElement("canvas");
  g.width = g.height = 16;
  const gctx = g.getContext("2d", { willReadFrequently: true });
  gctx.drawImage(img, sx, sy, side, side, 0, 0, 16, 16);
  const gp = gctx.getImageData(0, 0, 16, 16).data;
  const gray = [];
  for (let i = 0; i < gp.length; i += 4) gray.push(0.299 * gp[i] + 0.587 * gp[i + 1] + 0.114 * gp[i + 2]);
  const mean = gray.reduce((a, b) => a + b, 0) / gray.length;
  const sd = Math.sqrt(gray.reduce((a, b) => a + (b - mean) ** 2, 0) / gray.length) || 1;
  const shape = gray.map((x) => +((x - mean) / sd).toFixed(3));

  return { photo, sig: { colour: colour.map((x) => +x.toFixed(4)), shape } };
}

function similarity(a, b) {
  let inter = 0;
  for (let i = 0; i < a.colour.length; i++) inter += Math.min(a.colour[i], b.colour[i]);
  let corr = 0;
  for (let i = 0; i < a.shape.length; i++) corr += a.shape[i] * b.shape[i];
  corr = (corr / a.shape.length + 1) / 2; // 0..1
  return 0.7 * inter + 0.3 * corr;
}

/* ---------- Pop-style illustrations & icons (original drawings, no official artwork) ---------- */
function NyotaMark({ size = 36 }) {
  // Nyota-inspired: sleepy girl in a fluffy cloud hood with a little star
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="32" fill="#FFE3EC" />
      <g fill="#FFFFFF" stroke="#F2C6D3" strokeWidth="1.5">
        <circle cx="18" cy="30" r="9" /><circle cx="46" cy="30" r="9" /><circle cx="24" cy="19" r="10" /><circle cx="40" cy="19" r="10" /><circle cx="32" cy="15" r="10" />
      </g>
      <circle cx="32" cy="36" r="15" fill="#FFE9DC" />
      <path d="M18 31c4-6 9-8 14-8s10 2 14 8c-4-3-9-4-14-4s-10 1-14 4z" fill="#8C6A5C" />
      <path d="M25 37q2 2 4 0M35 37q2 2 4 0" stroke="#5B4038" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="23.5" cy="41" rx="3" ry="1.8" fill="#FFB5B5" opacity=".8" /><ellipse cx="40.5" cy="41" rx="3" ry="1.8" fill="#FFB5B5" opacity=".8" />
      <path d="M30.5 43.5q1.5 1 3 0" stroke="#5B4038" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M44 9l1.6 3.4 3.7.5-2.7 2.6.7 3.7-3.3-1.8-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="#FFD66B" />
    </svg>
  );
}

const Icon = {
  box: (p) => (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
      <path d="M5 11l11-5 11 5v12l-11 5-11-5z" fill="#FFD9C7" stroke="#CC6249" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 11l11 5 11-5M16 16v12" fill="none" stroke="#CC6249" strokeWidth="1.6" strokeLinejoin="round" />
      <text x="10.5" y="24" fontSize="8" fontWeight="800" fill="#CC6249" fontFamily="Nunito">?</text>
    </svg>
  ),
  figure: (p) => (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
      <path d="M10 5c1 3 2 5 3 6M22 5c-1 3-2 5-3 6" stroke="#CC6249" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="15" r="8" fill="#FFE9DC" stroke="#CC6249" strokeWidth="1.6" />
      <path d="M11 26c0-3 2-4 5-4s5 1 5 4z" fill="#FFD9C7" stroke="#CC6249" strokeWidth="1.6" />
      <circle cx="13" cy="15" r="1.3" fill="#5B4038" /><circle cx="19" cy="15" r="1.3" fill="#5B4038" />
      <path d="M13.5 18.5h5" stroke="#5B4038" strokeWidth="1.2" strokeDasharray="1 1" />
    </svg>
  ),
  tag: (p) => (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
      <path d="M5 15V6h9l13 13-9 9z" fill="#D8EFE0" stroke="#4F7F5E" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10.5" cy="11.5" r="2" fill="#4F7F5E" />
      <text x="13" y="23" fontSize="8" fontWeight="800" fill="#4F7F5E" fontFamily="Nunito">€</text>
    </svg>
  ),
  secret: (p) => (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden {...p}>
      <rect x="5" y="7" width="22" height="20" rx="4" fill="#EEE3F7" stroke="#7E62A3" strokeWidth="1.6" />
      <path d="M16 11l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#FFD66B" stroke="#7E62A3" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  camera: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.3 12.4q.6-.8 1.4-.9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  bag: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
      <path d="M5 8h14l-1 12H6z" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  miniBox: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
      <path d="M4 8l8-4 8 4v9l-8 4-8-4z" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 8l8 4 8-4M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
};

// Characters are guessed from the figure name; everything else becomes a mystery box.
const PALETTES = [["#FFD9C7", "#E0765C"], ["#FFF0B8", "#C99A2E"], ["#D8EFE0", "#4F7F5E"], ["#E6DDF5", "#7E62A3"], ["#D9ECF7", "#4C83A8"], ["#FFE0EA", "#C45C82"]];
const hashStr = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

function FigureArt({ name = "", className = "" }) {
  const n = name.toLowerCase();
  const [bg, ink] = PALETTES[hashStr(name) % PALETTES.length];
  const kind = /labubu|monsters|zimomo/.test(n) ? "labubu" : /hirono/.test(n) ? "hirono" : /skull ?panda/.test(n) ? "skullpanda"
    : /cry ?baby/.test(n) ? "crybaby" : /nyota/.test(n) ? "nyota" : /molly/.test(n) ? "molly" : /dimoo/.test(n) ? "dimoo" : /pucky/.test(n) ? "pucky" : "box";
  const face = (eyes = "dot") => (
    <g>
      {eyes === "dot" && <><circle cx="41" cy="54" r="3" fill="#3D2E27" /><circle cx="59" cy="54" r="3" fill="#3D2E27" /><circle cx="42" cy="53" r="1" fill="#fff" /><circle cx="60" cy="53" r="1" fill="#fff" /></>}
      {eyes === "sleepy" && <path d="M37 54q4 3 8 0M55 54q4 3 8 0" stroke="#3D2E27" strokeWidth="2.4" fill="none" strokeLinecap="round" />}
      {eyes === "big" && <><ellipse cx="41" cy="54" rx="5" ry="6" fill="#3D2E27" /><ellipse cx="59" cy="54" rx="5" ry="6" fill="#3D2E27" /><circle cx="43" cy="52" r="1.8" fill="#fff" /><circle cx="61" cy="52" r="1.8" fill="#fff" /></>}
      <ellipse cx="35" cy="62" rx="4" ry="2.4" fill="#FF9E9E" opacity=".55" /><ellipse cx="65" cy="62" rx="4" ry="2.4" fill="#FF9E9E" opacity=".55" />
    </g>
  );
  const head = <circle cx="50" cy="56" r="21" fill="#FFEBDD" />;
  const body = <path d="M34 92c0-12 7-17 16-17s16 5 16 17z" fill={ink} opacity=".85" />;
  const parts = {
    labubu: <>{body}<path d="M36 40c-6-14-4-28 2-30 5 2 6 16 4 28zM64 40c6-14 4-28-2-30-5 2-6 16-4 28z" fill="#EAD7C9" stroke={ink} strokeWidth="1.5" />
      <circle cx="50" cy="56" r="23" fill="#EAD7C9" />{head}{face("big")}<path d="M40 65q10 7 20 0" fill="#fff" stroke="#3D2E27" strokeWidth="1.6" /><path d="M43 65.5v3M47 66.5v3M51 67v3M55 66.5v3M58 65.5v2.5" stroke="#3D2E27" strokeWidth="1" /></>,
    hirono: <>{body}{head}<path d="M28 52c0-16 10-22 22-22s22 6 22 22c-3-6-6-8-9-8l-3 5-4-6-4 6-4-6-4 6-3-5c-4 0-8 3-13 8z" fill="#4A3B35" />{face("dot")}<path d="M44 68q6-3 12 0" stroke="#3D2E27" strokeWidth="1.8" fill="none" strokeLinecap="round" /><path d="M37 49l7 1.5M63 49l-7 1.5" stroke="#3D2E27" strokeWidth="1.6" strokeLinecap="round" /></>,
    skullpanda: <>{body}<path d="M24 60c0-22 12-32 26-32s26 10 26 32c0 4-2 8-4 10H28c-2-2-4-6-4-10z" fill={ink} />{head}<ellipse cx="41" cy="54" rx="6.5" ry="7.5" fill="#3D2E27" /><ellipse cx="59" cy="54" rx="6.5" ry="7.5" fill="#3D2E27" /><circle cx="42" cy="52" r="2" fill="#fff" /><circle cx="60" cy="52" r="2" fill="#fff" /><path d="M47 66h6" stroke="#3D2E27" strokeWidth="1.6" strokeLinecap="round" /></>,
    crybaby: <>{body}{head}<path d="M29 50c2-14 11-20 21-20s19 6 21 20c-6-6-13-8-21-8s-15 2-21 8z" fill="#F5C6A5" />{face("big")}<path d="M36 61c-2 4-2 7 0 8 2-1 2-4 0-8z" fill="#8CC7F0" /><path d="M45 68q5-4 10 0" stroke="#3D2E27" strokeWidth="1.8" fill="none" strokeLinecap="round" /></>,
    nyota: <>{body}<g fill="#fff" stroke={ink} strokeOpacity=".35" strokeWidth="1.5"><circle cx="30" cy="54" r="10" /><circle cx="70" cy="54" r="10" /><circle cx="36" cy="38" r="12" /><circle cx="64" cy="38" r="12" /><circle cx="50" cy="32" r="12" /></g>{head}<path d="M31 52c5-8 12-10 19-10s14 2 19 10c-5-4-12-5-19-5s-14 1-19 5z" fill="#8C6A5C" />{face("sleepy")}<path d="M47 67q3 2 6 0" stroke="#3D2E27" strokeWidth="1.6" fill="none" strokeLinecap="round" /><path d="M66 20l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" fill="#FFD66B" /></>,
    molly: <>{body}{head}<path d="M28 52c0-15 10-23 22-23s22 8 22 23c-4-4-8-6-12-6 1-4 0-7-2-8-2 5-8 8-14 8-6 0-11 2-16 6z" fill="#F0C987" /><ellipse cx="50" cy="30" rx="20" ry="7" fill={ink} />{face("big")}<path d="M46 67q4-2 8 0" stroke="#3D2E27" strokeWidth="1.8" fill="none" strokeLinecap="round" /></>,
    dimoo: <>{body}<g fill={bg} stroke={ink} strokeWidth="1.5"><circle cx="34" cy="40" r="11" /><circle cx="66" cy="40" r="11" /><circle cx="50" cy="33" r="13" /></g>{head}{face("dot")}<path d="M46 66q4 3 8 0" stroke="#3D2E27" strokeWidth="1.6" fill="none" strokeLinecap="round" /></>,
    pucky: <>{body}<path d="M32 44c-2-12 6-20 18-20s20 8 18 20" fill="#F7E6A8" />{head}{face("sleepy")}<circle cx="50" cy="26" r="4" fill="#F7E6A8" /></>,
    box: <><path d="M22 38l28-12 28 12v32L50 84 22 70z" fill="#fff" stroke={ink} strokeWidth="2" strokeLinejoin="round" /><path d="M22 38l28 12 28-12M50 50v34" fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round" /><text x="30" y="73" fontSize="20" fontWeight="800" fill={ink} fontFamily="Nunito">?</text><text x="58" y="70" fontSize="14" fontWeight="800" fill={ink} opacity=".5" fontFamily="Nunito">?</text></>,
  };
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={name ? `Illustration of ${name}` : "Figure illustration"} style={{ background: bg }}>
      <circle cx="82" cy="18" r="3" fill="#fff" opacity=".8" /><circle cx="14" cy="80" r="2" fill="#fff" opacity=".8" />
      {parts[kind]}
    </svg>
  );
}

/* ---------- Data ---------- */

const blankFigure = (extra = {}) => ({ id: uid(), name: "", series: "", secret: false, condition: CONDITIONS[0], paid: "", bought: today(), qty: 1, notes: "", origin: "box", from: "", photo: null, sig: null, checks: [], ...extra });

function stats(f) {
  const recent = f.checks.filter((c) => daysAgo(c.date) <= 60).map((c) => c.price);
  const all = f.checks.map((c) => c.price);
  const market = median(recent.length ? recent : all);
  const last = f.checks.length ? f.checks.reduce((a, b) => (a.date > b.date ? a : b)).date : null;
  const paidTotal = (Number(f.paid) || 0) * f.qty;
  const marketTotal = market != null ? market * f.qty : null;
  return { market, last, paidTotal, marketTotal, delta: marketTotal != null ? marketTotal - paidTotal : null, stale: last ? daysAgo(last) > 30 : true };
}

/* ---------- UI primitives ---------- */
const inputCls = "w-full rounded-xl border border-[#EBDCCB] bg-white px-3 py-2 text-sm text-[#3D2E27] placeholder:text-stone-400 focus:outline-none focus:border-[#F0A48F] focus:ring-2 focus:ring-[#FDE3D8]";
const btn = "rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";
const serif = { fontFamily: "'Fraunces', Georgia, serif" };
const btnPrimary = `${btn} bg-[#E0765C] text-white font-bold shadow-[0_4px_14px_-4px_rgba(224,118,92,0.6)] hover:bg-[#CC6249]`;
const btnGhost = `${btn} border border-[#EBDCCB] bg-white text-stone-700 hover:bg-[#FFF6EC]`;

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-stone-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Delta({ v, pct, bold = false }) {
  if (v == null) return <span className="text-stone-400 font-normal">no price data</span>;
  const up = v >= 0;
  return (
    <span className={`tabular-nums ${up ? "text-[#4F7F5E]" : "text-[#B0626A]"} ${bold ? "" : "font-medium"}`}>
      {up ? "↑" : "↓"} {eur(Math.abs(v))}{pct != null && isFinite(pct) ? ` (${up ? "+" : "−"}${Math.abs(pct).toFixed(0)}%)` : ""}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-[#3D2E27]/30 backdrop-blur-[3px] flex items-end sm:items-center justify-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur">
          <h2 className="text-xl font-semibold text-[#3D2E27]" style={serif}>{title}</h2>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full text-stone-500 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F]">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function PhotoPicker({ onPhoto, busy, label = "Take or upload photo" }) {
  const ref = useRef(null);
  return (
    <>
      <button type="button" onClick={() => ref.current.click()} disabled={busy} className={btnGhost}>
        <span className="inline-flex items-center gap-2">{busy ? "Reading photo…" : <><Icon.camera />{label}</>}</span>
      </button>
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(f); e.target.value = ""; }} />
    </>
  );
}

function Thumb({ src, name = "", className = "" }) {
  return src ? <img src={src} alt={name} className={`object-cover ${className}`} /> : <FigureArt name={name} className={className} />;
}

/* ---------- Figure form ---------- */
const normName = (n) => n.toLowerCase().replace(/[–—-]/g, " ").replace(/\s+/g, " ").trim();

function NameWithCatalog({ f, setF, catalog }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const q = normName(f.name);
  const hits = q.length < 2 ? [] : Object.values(catalog).filter((c) => normName(c.name + " " + c.series).includes(q)).slice(0, 6);
  const pick = (c) => {
    setF((x) => ({ ...x, name: c.name, series: x.series || c.series, photo: x.photo || c.photo, sig: x.sig || c.sig, fromCatalog: !x.photo }));
    setOpen(false);
  };
  return (
    <div className="relative">
      <Field label="Figure name *">
        <input autoFocus className={inputCls} value={f.name} placeholder="Start typing, e.g. Labubu"
          role="combobox" aria-expanded={open && hits.length > 0} aria-autocomplete="list"
          onChange={(e) => { setF((x) => ({ ...x, name: e.target.value })); setOpen(true); setHi(0); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (!open || !hits.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % hits.length); }
            if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + hits.length) % hits.length); }
            if (e.key === "Enter") { e.preventDefault(); pick(hits[hi]); }
          }} />
      </Field>
      {open && hits.length > 0 && (
        <ul role="listbox" className="absolute z-10 mt-1 w-full sm:w-[150%] bg-white rounded-2xl border border-[#F3E4D4] shadow-xl overflow-hidden">
          <li className="px-3 pt-2 pb-1 text-[11px] font-bold text-stone-400 uppercase tracking-wide">From the community catalog</li>
          {hits.map((c, i) => (
            <li key={c.key} role="option" aria-selected={i === hi}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(c)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left ${i === hi ? "bg-[#FFF1EA]" : "hover:bg-[#FFF6EC]"}`}>
                <img src={c.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <span className="min-w-0">
                  <span className="block text-sm font-bold truncate">{c.name}</span>
                  <span className="block text-xs text-stone-500 truncate">{c.series || "No series"} · photo by {c.by}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FigureForm({ initial, onSave, onCancel, catalog = {} }) {
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
        <NameWithCatalog f={f} setF={setF} catalog={catalog} />
        <Field label="Series"><input className={inputCls} value={f.series} onChange={set("series")} placeholder="e.g. The Monsters – Have a Seat" /></Field>
        <div className="sm:col-span-2">
          <span className="block text-xs font-medium text-stone-500 mb-1.5">How did you get it?</span>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="How did you get it?">
            {[["box", <Icon.box />, "Mystery box", "Pulled from a blind box"], ["bought", <Icon.tag />, "Bought it", "Paid a specific price"]].map(([k, ic, t, d]) => (
              <button type="button" key={k} role="radio" aria-checked={f.origin === k} onClick={() => setF({ ...f, origin: k })}
                className={`text-left rounded-2xl border-2 p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] ${f.origin === k ? "border-[#E0765C] bg-[#FFF1EA]" : "border-[#F3E4D4] bg-white hover:bg-[#FFF6EC]"}`}>
                <span aria-hidden>{ic}</span>
                <span className="block font-bold text-sm mt-1">{t}</span>
                <span className="block text-xs text-stone-500">{d}</span>
              </button>
            ))}
          </div>
        </div>
        {f.origin === "box" ? (
          <div className="sm:col-span-2 rounded-2xl bg-[#FFF6EC] p-4 space-y-3">
            <Field label="Box price on Pop Mart (€) *"><input className={inputCls} inputMode="decimal" value={f.paid} onChange={set("paid")} placeholder="12,90" /></Field>
            <div className="flex flex-wrap items-center gap-2">
              {BOX_PRESETS.map((p) => (
                <button type="button" key={p} onClick={() => setF({ ...f, paid: String(p).replace(".", ",") })}
                  className={`rounded-full px-3 py-1 text-sm border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] ${Number(String(f.paid).replace(",", ".")) === p ? "bg-[#E0765C] text-white border-[#E0765C]" : "bg-white border-[#EBDCCB] hover:border-[#E0765C]"}`}>
                  {eur(p)}
                </button>
              ))}
              <a href={popmartSearch(f.series || f.name)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#E0765C] hover:underline ml-1">Check price on Pop Mart ↗</a>
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
          <input type="checkbox" checked={f.secret} onChange={set("secret")} className="w-4 h-4 accent-[#E0765C]" />
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

/* ---------- Identify by photo ---------- */
function IdentifyPanel({ figs, onOpen, onAddNew }) {
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
                  <button onClick={() => onOpen(f)} className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left hover:bg-[#FFF6EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] ${i === 0 && score > 0.65 ? "border-[#F4B8A5] bg-[#FFF1EA]" : "border-stone-200"}`}>
                    <Thumb src={f.photo} name={f.name} className="w-12 h-12 rounded-xl shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-[#3D2E27] truncate">{f.name}</span>
                      <span className="block text-xs text-stone-500">{label(score)} · {Math.round(score * 100)}%</span>
                    </span>
                    <span className="text-xs text-[#E0765C] font-medium pr-1">Prices →</span>
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

/* ---------- Price panel ---------- */
function Bar({ label, value, max, color }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 truncate text-stone-600">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-stone-100 overflow-hidden">
        <div className="h-full rounded-full motion-safe:transition-all" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="w-20 text-right font-medium tabular-nums text-[#3D2E27]">{eur(value)}</span>
    </div>
  );
}

function PricePanel({ fig, onUpdate }) {
  const [src, setSrc] = useState(SOURCES[0]);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(today());
  const [query, setQuery] = useState(fig.name.replace(/–/g, " ").replace(/\s+/g, " ").trim());
  const s = stats(fig);
  const bySrc = SOURCES.map((name) => {
    const ps = fig.checks.filter((c) => c.source === name).map((c) => c.price);
    return { name, med: median(ps), n: ps.length };
  }).filter((x) => x.n);
  const max = Math.max(...bySrc.map((x) => x.med), Number(fig.paid) || 0, 1);
  const valid = price !== "" && !isNaN(Number(price.replace(",", ".")));

  const add = (e) => {
    e.preventDefault();
    if (!valid) return;
    onUpdate({ ...fig, checks: [...fig.checks, { id: uid(), source: src, price: Number(price.replace(",", ".")), date }] });
    setPrice("");
  };

  const H = ({ n, children }) => (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D2E27] mb-3">
      <span className="w-5 h-5 rounded-full bg-[#FDE3D8] text-[#E0765C] text-xs flex items-center justify-center">{n}</span>{children}
    </h3>
  );

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <Thumb src={fig.photo} name={fig.name} className="w-16 h-16 rounded-xl shrink-0" />
        <div className="text-sm text-stone-500">{fig.series || "No series"} · paid <span className="text-[#3D2E27] font-medium">{eur(fig.paid)}</span></div>
      </div>

      <section>
        <H n="1">Look it up</H>
        <input className={inputCls + " mb-3"} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search term" />
        <div className="flex flex-wrap gap-2">
          {searchLinks(query).map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-[#FFF6EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F]">
              <span className="w-2 h-2 rounded-full" style={{ background: SRC_COLOR[l.name] }} />{l.name} ↗
            </a>
          ))}
        </div>
      </section>

      <section>
        <H n="2">Log what you found</H>
        <form onSubmit={add} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
          <Field label="Source"><select className={inputCls} value={src} onChange={(e) => setSrc(e.target.value)}>{SOURCES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Price €"><input className={inputCls} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29,00" /></Field>
          <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <button disabled={!valid} className={`${btnPrimary} h-[38px]`}>Add</button>
        </form>
      </section>

      <section>
        <H n="3">Compare</H>
        {bySrc.length === 0 ? (
          <p className="text-sm text-stone-500 rounded-xl bg-[#FFF6EC] p-4 text-center">No prices logged yet. Search above, then add a few listings.</p>
        ) : (
          <div className="space-y-3">
            <Bar label="You paid" value={Number(fig.paid)} max={max} color="#C9B6A4" />
            {bySrc.map((b) => <Bar key={b.name} label={`${b.name} (${b.n})`} value={b.med} max={max} color={SRC_COLOR[b.name]} />)}
            <div className="flex flex-wrap justify-between gap-2 pt-4 mt-2 border-t border-stone-200 text-sm text-stone-600">
              <span>Estimated value <span className="text-[#3D2E27] font-semibold">{eur(s.market)}</span></span>
              <Delta v={s.market != null ? s.market - fig.paid : null} pct={fig.paid ? ((s.market - fig.paid) / fig.paid) * 100 : null} />
            </div>
          </div>
        )}
      </section>

      {fig.checks.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-[#3D2E27] mb-2">History</h3>
          <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200">
            {[...fig.checks].sort((a, b) => b.date.localeCompare(a.date)).map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SRC_COLOR[c.source] }} />
                <span className="flex-1 text-stone-700">{c.source}</span>
                <span className="text-stone-400 tabular-nums">{new Date(c.date).toLocaleDateString("de-DE")}</span>
                <span className="font-medium tabular-nums w-20 text-right text-[#3D2E27]">{eur(c.price)}</span>
                <button onClick={() => onUpdate({ ...fig, checks: fig.checks.filter((x) => x.id !== c.id) })}
                  aria-label={`Delete ${c.source} price`} className="text-stone-300 hover:text-[#B0626A] px-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F]">✕</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ---------- App ---------- */
function Shelf({ user, initialFigs, onSync, onLogout, catalog, onContribute }) {
  const [figs, setFigs] = useState(initialFigs);
  const prevFigs = useRef(initialFigs);
  useEffect(() => { const before = prevFigs.current; prevFigs.current = figs; if (before !== figs) onSync(before, figs); }, [figs]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("delta");
  const [editing, setEditing] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    const list = figs.filter((f) => (f.name + " " + f.series + " " + f.notes).toLowerCase().includes(t)).map((f) => ({ f, s: stats(f) }));
    const cmp = {
      delta: (a, b) => (b.s.delta ?? -1e9) - (a.s.delta ?? -1e9),
      value: (a, b) => (b.s.marketTotal ?? -1) - (a.s.marketTotal ?? -1),
      name: (a, b) => a.f.name.localeCompare(b.f.name),
      recent: (a, b) => b.f.bought.localeCompare(a.f.bought),
      stale: (a, b) => (a.s.last || "").localeCompare(b.s.last || ""),
    }[sort];
    return list.sort(cmp);
  }, [figs, q, sort]);

  const totals = useMemo(() => {
    let paid = 0, market = 0, count = 0, priced = 0;
    figs.forEach((f) => { const s = stats(f); count += f.qty; paid += s.paidTotal; if (s.marketTotal != null) { market += s.marketTotal; priced += s.paidTotal; } });
    return { paid, market, count, delta: market - priced, priced };
  }, [figs]);

  const save = (f) => { if (f.photo && !f.fromCatalog) onContribute(f); setFigs((xs) => (xs.some((x) => x.id === f.id) ? xs.map((x) => (x.id === f.id ? f : x)) : [f, ...xs])); setEditing(null); flash("Saved"); };
  const updateFig = (f) => { setFigs((xs) => xs.map((x) => (x.id === f.id ? f : x))); setPricing(f); };
  const remove = (f) => { if (confirm(`Delete "${f.name}"?`)) setFigs((xs) => xs.filter((x) => x.id !== f.id)); };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(figs)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pop-collection-${user}-${today()}.json`;
    a.click();
    flash("Backup downloaded");
  };
  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      try { const d = JSON.parse(t); if (!Array.isArray(d)) throw 0; setFigs(d.map((x) => ({ photo: null, sig: null, ...x }))); flash(`Loaded ${d.length} figures`); }
      catch { flash("That file isn't a valid backup"); }
    });
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#3D2E27]" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');`}</style>

      <header className="sticky top-0 z-40 bg-[#FFF8F0]/85 backdrop-blur border-b border-[#F3E4D4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5">
            <NyotaMark size={38} />
            <span className="text-xl font-semibold tracking-tight" style={serif}>Pop Collection</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportJson} className={btnGhost}>Backup</button>
            <button onClick={() => fileRef.current.click()} className={btnGhost}>Restore</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importJson} />
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[#F3E4D4]">
              <span className="w-9 h-9 rounded-full bg-[#FFE7DC] text-[#CC6249] font-extrabold flex items-center justify-center" aria-hidden>{user[0].toUpperCase()}</span>
              <span className="hidden sm:inline text-sm font-bold">{user}</span>
              <button onClick={onLogout} className={`${btn} text-stone-500 hover:text-[#CC6249]`}>Log out</button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-[#FFE0CC] opacity-70" />
        <div aria-hidden className="absolute top-40 -left-24 w-64 h-64 rounded-full bg-[#FFF0B8] opacity-60" />
        <div aria-hidden className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full bg-[#DDF0E4] opacity-70" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-12 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h1 className="flex items-center gap-3 text-4xl sm:text-5xl font-semibold tracking-tight" style={serif}>
              Hi {user} <NyotaMark size={52} />
            </h1>
            <p className="mt-3 text-sm text-[#7A6558]"><b className="text-[#3D2E27]">{Object.keys(catalog).length}</b> figure pictures in the community catalog</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => setEditing(blankFigure())} className={`${btnPrimary} px-6 py-3 text-base rounded-full`}>+ Add a figure</button>
              <button onClick={() => setIdentifying(true)} className={`${btnGhost} px-6 py-3 text-base rounded-full`}><span className="inline-flex items-center gap-2"><Icon.camera />Identify by photo</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["On the shelf", totals.count, "bg-[#FFE7DC]", <Icon.figure />],
              ["Total paid", eur(totals.paid), "bg-[#FFF3C9]", <Icon.box />],
              ["Worth today", eur(totals.market), "bg-[#E1F2E7]", <Icon.tag />],
              ["Gain / loss", <Delta bold v={totals.priced ? totals.delta : null} />, "bg-[#EEE6F6]", <Icon.secret />],
            ].map(([l, v, bg, ic]) => (
              <div key={l} className={`${bg} rounded-3xl p-5`}>
                <div className="mb-2" aria-hidden>{ic}</div>
                <div className="text-xs font-bold text-[#7A6558]">{l}</div>
                <div className="text-lg sm:text-2xl font-extrabold mt-0.5 tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <h2 className="text-2xl font-semibold mb-5" style={serif}>My shelf</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative sm:max-w-sm w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" aria-hidden>⌕</span>
            <input className={inputCls + " pl-8"} placeholder="Search by name, series or notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search collection" />
          </div>
          <select className={inputCls + " sm:w-56"} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            <option value="delta">Biggest gain</option>
            <option value="value">Highest value</option>
            <option value="stale">Needs price check</option>
            <option value="recent">Recently bought</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EBDCCB] p-12 text-center">
            <p className="text-lg font-semibold mb-1">{figs.length ? "Nothing matches" : "Your shelf is empty"}</p>
            <p className="text-stone-500 text-sm mb-5">{figs.length ? "Try a different search." : "Add your first figure or identify one by photo."}</p>
            {!figs.length && <button onClick={() => setEditing(blankFigure())} className={btnPrimary}>+ Add figure</button>}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ f, s }) => (
              <li key={f.id} className="rounded-3xl bg-white border border-[#F3E4D4] overflow-hidden flex flex-col shadow-[0_6px_20px_-12px_rgba(160,100,60,0.35)] hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgba(160,100,60,0.45)] motion-safe:transition-all">
                <div className="flex gap-4 p-4">
                  <Thumb src={f.photo} name={f.name} className="w-20 h-20 rounded-2xl shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-stone-500 truncate">{f.series || "No series"}</p>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-[#FFF1EA] text-[#CC6249] px-2 py-0.5">{f.origin === "bought" ? <><Icon.bag />{f.from || "Bought"}</> : <><Icon.miniBox />Box</>}</span>
                      {f.secret && <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F3EAD3] text-[#8A7340] px-2 py-0.5">Secret</span>}
                    </div>
                    <h3 className="font-semibold leading-snug mt-0.5">{f.name}{f.qty > 1 && <span className="text-sm font-normal text-stone-400"> ×{f.qty}</span>}</h3>
                    <p className="text-xs text-stone-400 mt-1">{f.condition} · {new Date(f.bought).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1">
                  {f.notes && <p className="text-sm text-stone-500 italic mb-3">“{f.notes}”</p>}
                  <dl className="grid grid-cols-3 gap-2 text-sm rounded-xl bg-[#FFF6EC] p-3">
                    <div><dt className="text-stone-400 text-xs">Paid</dt><dd className="font-medium tabular-nums">{eur(f.paid)}</dd></div>
                    <div><dt className="text-stone-400 text-xs">Market</dt><dd className="font-medium tabular-nums">{eur(s.market)}</dd></div>
                    <div><dt className="text-stone-400 text-xs">Change</dt><dd className="text-xs mt-0.5"><Delta v={s.market != null ? s.market - f.paid : null} /></dd></div>
                  </dl>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex gap-1.5">
                      {SOURCES.map((src) => {
                        const n = f.checks.filter((c) => c.source === src).length;
                        return n ? <span key={src} title={`${src}: ${n} price(s)`} className="w-2 h-2 rounded-full" style={{ background: SRC_COLOR[src] }} /> : null;
                      })}
                    </div>
                    <p className={`text-xs ${s.stale ? "text-[#A0804A]" : "text-stone-400"}`}>
                      {s.last ? `Checked ${daysAgo(s.last)}d ago${s.stale ? " · update" : ""}` : "Never price-checked"}
                    </p>
                  </div>
                </div>
                <div className="flex border-t border-stone-100 text-sm">
                  <button onClick={() => setPricing(f)} className="flex-1 py-2.5 font-medium text-[#E0765C] hover:bg-[#FFF1EA] focus:outline-none focus-visible:bg-[#FFF1EA]">Prices</button>
                  <button onClick={() => setEditing(f)} className="flex-1 py-2.5 text-stone-600 border-l border-stone-100 hover:bg-[#FFF6EC] focus:outline-none focus-visible:bg-[#FFF6EC]">Edit</button>
                  <button onClick={() => remove(f)} className="flex-1 py-2.5 text-stone-400 border-l border-stone-100 hover:text-[#B0626A] hover:bg-[#FBF3F3] focus:outline-none focus-visible:bg-[#FBF3F3]">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-stone-400 mt-12 max-w-2xl leading-relaxed">
          Your shelf is saved online automatically. Backup downloads a copy as a file, just in case.
          Estimated value is the median of prices logged in the last 60 days, or all prices if none are recent.
        </p>
      </main>

      {editing && (
        <Modal title={figs.some((x) => x.id === editing.id) ? "Edit figure" : "New figure"} onClose={() => setEditing(null)}>
          <FigureForm catalog={catalog} initial={{ ...editing, paid: String(editing.paid) }} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {pricing && (
        <Modal title={pricing.name} onClose={() => setPricing(null)}>
          <PricePanel key={pricing.id} fig={pricing} onUpdate={updateFig} />
        </Modal>
      )}
      {identifying && (
        <Modal title="Identify by photo" onClose={() => setIdentifying(false)}>
          <IdentifyPanel
            figs={figs}
            onOpen={(f) => { setIdentifying(false); setPricing(f); }}
            onAddNew={(r) => { setIdentifying(false); setEditing(blankFigure({ photo: r.photo, sig: r.sig })); }}
          />
        </Modal>
      )}
      {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#3D2E27] text-white text-sm px-4 py-2 shadow-lg z-50">{toast}</div>}
    </div>
  );
}

/* ---------- Accounts (Supabase) ---------- */
// Friends log in with a name + 6-digit PIN. Behind the scenes the name is turned
// into an internal address, so nobody needs a real email.
const toEmail = (name) => `${name.trim().toLowerCase()}@example.com`;
const fontCss = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');`;

function Splash({ text = "Loading your shelf…" }) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#7A6558] flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{fontCss}</style>
      <span className="motion-safe:animate-bounce"><NyotaMark size={64} /></span>
      <p className="font-bold">{text}</p>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const n = name.trim();
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(n)) return setErr("Your name needs 3–20 letters, numbers, dots, dashes or underscores (no spaces).");
    if (!/^\d{6}$/.test(pin)) return setErr("Your PIN is 6 digits.");
    setBusy(true);
    const { error } = mode === "register"
      ? await supabase.auth.signUp({ email: toEmail(n), password: pin, options: { data: { name: n } } })
      : await supabase.auth.signInWithPassword({ email: toEmail(n), password: pin });
    setBusy(false);
    if (!error) return;
    const m = error.message.toLowerCase();
    if (m.includes("already")) setErr("That name is taken. Try another one.");
    else if (m.includes("invalid login")) setErr("Name or PIN doesn't match.");
    else if (m.includes("rate") || m.includes("too many")) setErr("Too many tries. Wait a minute and try again.");
    else setErr("Something went wrong: " + error.message);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#3D2E27] relative overflow-hidden flex items-center justify-center p-4" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{fontCss}</style>
      <div aria-hidden className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#FFE0CC] opacity-70" />
      <div aria-hidden className="absolute bottom-10 -left-24 w-72 h-72 rounded-full bg-[#FFF0B8] opacity-60" />
      <div aria-hidden className="absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-[#DDF0E4] opacity-70" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-block mb-4"><NyotaMark size={72} /></span>
          <h1 className="text-4xl font-semibold tracking-tight" style={serif}>Pop Collection</h1>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-24px_rgba(160,100,60,0.45)] border border-[#F3E4D4]">
          <div className="grid grid-cols-2 bg-[#FFF1EA] rounded-full p-1 mb-6" role="tablist">
            {[["login", "Log in"], ["register", "Create account"]].map(([m, l]) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setErr(""); }}
                className={`rounded-full py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] ${mode === m ? "bg-white shadow text-[#CC6249]" : "text-[#7A6558]"}`}>{l}</button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Field label={mode === "register" ? "Pick a name" : "Your name"}>
              <input autoFocus className={inputCls + " py-3 text-base"} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. labubu_lover" autoComplete="username" autoCapitalize="none" />
            </Field>
            <Field label={mode === "register" ? "Choose a 6-digit PIN" : "PIN"}>
              <input className={inputCls + " py-3 text-base tracking-[0.5em]"} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" placeholder="••••••" autoComplete={mode === "register" ? "new-password" : "current-password"} />
            </Field>
            {err && <p role="alert" className="text-sm text-[#B0626A] bg-[#FBF0EF] rounded-xl px-3 py-2">{err}</p>}
            <button disabled={busy} className={`${btnPrimary} w-full py-3 text-base rounded-full`}>{busy ? "One moment…" : mode === "register" ? "Create my shelf" : "Open my shelf"}</button>
          </form>
          {mode === "register" && <p className="text-xs text-center text-stone-400 mt-5">Remember your PIN. There's no email, so it can't be reset automatically.</p>}
        </div>
      </div>
    </div>
  );
}

function LoggedIn({ session }) {
  const uidUser = session.user.id;
  const name = session.user.user_metadata?.name || session.user.email.split("@")[0];
  const [data, setData] = useState(null);
  const [catalog, setCatalog] = useState({});
  const [loadErr, setLoadErr] = useState("");
  const [saveErr, setSaveErr] = useState("");

  useEffect(() => {
    (async () => {
      const [f, c] = await Promise.all([
        supabase.from("figures").select("id, data").order("created_at", { ascending: false }),
        supabase.from("catalog").select("key, name, series, photo, sig, by_name, by_user"),
      ]);
      if (f.error || c.error) return setLoadErr((f.error || c.error).message);
      setData(f.data.map((r) => ({ ...r.data, id: r.id })));
      setCatalog(Object.fromEntries(c.data.map((r) => [r.key, { key: r.key, name: r.name, series: r.series, photo: r.photo, sig: r.sig, by: r.by_name, byUser: r.by_user }])));
    })();
  }, [uidUser]);

  // Save only what changed: new/edited figures are upserted, removed ones deleted.
  const sync = async (before, after) => {
    const changed = after.filter((f) => !before.includes(f));
    const afterIds = new Set(after.map((f) => f.id));
    const removed = before.filter((f) => !afterIds.has(f.id)).map((f) => f.id);
    const ops = [];
    if (changed.length) ops.push(supabase.from("figures").upsert(changed.map((f) => ({ user_id: uidUser, id: f.id, data: f, updated_at: new Date().toISOString() })), { onConflict: "user_id,id" }));
    if (removed.length) ops.push(supabase.from("figures").delete().eq("user_id", uidUser).in("id", removed));
    const res = await Promise.all(ops);
    const bad = res.find((r) => r.error);
    setSaveErr(bad ? "Couldn't save your last change. Check your connection and try again." : "");
  };

  const contribute = async (f) => {
    const key = normName(f.name);
    const existing = catalog[key];
    if (existing && existing.byUser !== uidUser) return; // first photo wins; others keep theirs
    const row = { key, name: f.name, series: f.series, photo: f.photo, sig: f.sig, by_name: name, by_user: uidUser };
    setCatalog((c) => ({ ...c, [key]: { key, name: f.name, series: f.series, photo: f.photo, sig: f.sig, by: name, byUser: uidUser } }));
    await supabase.from("catalog").upsert(row, { onConflict: "key" });
  };

  if (loadErr) return <Splash text={`Couldn't load your shelf: ${loadErr}`} />;
  if (!data) return <Splash />;
  return (
    <>
      <Shelf user={name} initialFigs={data} onSync={sync} onLogout={() => supabase.auth.signOut()} catalog={catalog} onContribute={contribute} />
      {saveErr && <div role="alert" className="fixed bottom-6 right-6 max-w-xs rounded-2xl bg-[#B0626A] text-white text-sm px-4 py-3 shadow-lg z-50">{saveErr}</div>}
    </>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <Splash text="Opening Pop Collection…" />;
  if (!session) return <AuthScreen />;
  return <LoggedIn key={session.user.id} session={session} />;
}
