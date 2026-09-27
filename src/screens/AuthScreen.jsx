import { useState } from "react";
import { supabase } from "../supabase";
import Field from "../components/ui/Field";
import Logo from "../components/icons/Logo";
import { toEmail } from "../lib/auth";
import { LOGIN_BG } from "../lib/wallpapers";
import { btnPrimary, fontCss, inputCls, pageFont, serif } from "../styles/theme";

// Log in / create account, with a random wallpaper behind it.

export default function AuthScreen() {
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
    let email;
    try { email = toEmail(n); } catch (e2) { setBusy(false); return setErr(e2.message); }
    const { error } = mode === "register"
        ? await supabase.auth.signUp({ email, password: pin, options: { data: { name: n } } })
        : await supabase.auth.signInWithPassword({ email, password: pin });
    setBusy(false);
    if (!error) return;
    const m = error.message.toLowerCase();
    if (m.includes("already")) setErr("That name is taken. Try another one.");
    else if (m.includes("invalid login")) setErr("Name or PIN doesn't match.");
    else if (m.includes("security purposes")) setErr("Please wait a minute before trying again.");
    else if (m.includes("rate") || m.includes("too many")) setErr("Too many tries. Wait a minute and try again.");
    else setErr("Something went wrong: " + error.message);
  };

  return (
      <div className="min-h-screen bg-pc-bg text-pc-ink relative overflow-hidden flex items-center justify-center p-4" style={pageFont}>
        <style>{fontCss}</style>
        {LOGIN_BG ? (
            <>
              <img src={LOGIN_BG} alt="" aria-hidden
                   onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                   onError={(e) => (e.currentTarget.style.display = "none")}
                   className="absolute inset-0 w-full h-full object-cover opacity-0 motion-safe:transition-opacity duration-700" />
              <div aria-hidden className="absolute inset-0 bg-pc-ink/20" />
            </>
        ) : (
            <>
              <div aria-hidden className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-pc-decor1 opacity-70" />
              <div aria-hidden className="absolute bottom-10 -left-24 w-72 h-72 rounded-full bg-pc-decor2 opacity-60" />
              <div aria-hidden className="absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-pc-decor3 opacity-70" />
            </>
        )}
        <div className="relative w-full max-w-md">
          <div className={`text-center mb-8 ${LOGIN_BG ? "bg-white/75 backdrop-blur-md rounded-3xl py-5 px-8 mx-auto w-fit" : ""}`}>
            <span className="inline-block mb-4"><Logo size={72} /></span>
            <h1 className="text-4xl font-semibold tracking-tight" style={serif}>Pop Collection</h1>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-24px_rgb(var(--pc-shadow)/0.45)] border border-pc-line">
            <div className="grid grid-cols-2 bg-pc-softer rounded-full p-1 mb-6" role="tablist">
              {[["login", "Log in"], ["register", "Create account"]].map(([m, l]) => (
                  <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setErr(""); }}
                          className={`rounded-full py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring ${mode === m ? "bg-white shadow text-pc-accent-strong" : "text-pc-muted"}`}>{l}</button>
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
