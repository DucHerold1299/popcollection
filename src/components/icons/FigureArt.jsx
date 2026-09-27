// Placeholder picture for a figure without a photo. The character is guessed from the name.

const PALETTES = [["#FFD9C7", "#E0765C"], ["#FFF0B8", "#C99A2E"], ["#D8EFE0", "#4F7F5E"], ["#E6DDF5", "#7E62A3"], ["#D9ECF7", "#4C83A8"], ["#FFE0EA", "#C45C82"]];
const hashStr = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export default function FigureArt({ name = "", className = "" }) {
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
