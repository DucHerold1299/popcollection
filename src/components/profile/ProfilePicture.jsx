import { useRef, useState } from "react";
import Avatar from "../ui/Avatar";
import Icon from "../icons/Icon";
import { makeAvatar } from "../../lib/avatar";
import { btnGhost, btnPrimary } from "../../styles/theme";

// Choose, change or remove your profile picture. onSave(picture or null) should throw if saving fails.
export default function ProfilePicture({ user, avatar, onSave }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const run = async (getPicture) => {
    setBusy(true); setErr("");
    try { await onSave(await getPicture()); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
      <div className="flex flex-col items-center text-center gap-5">
        <Avatar src={avatar} name={user} size={128} />
        <div className="flex gap-2 flex-wrap justify-center">
          <button type="button" disabled={busy} onClick={() => fileRef.current.click()} className={btnPrimary}>
            <span className="inline-flex items-center gap-2"><Icon.camera />{busy ? "Saving…" : avatar ? "Change photo" : "Choose photo"}</span>
          </button>
          {avatar && <button type="button" disabled={busy} onClick={() => run(async () => null)} className={btnGhost}>Remove</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
               onChange={(e) => { const file = e.target.files?.[0]; if (file) run(() => makeAvatar(file)); e.target.value = ""; }} />
        {err
            ? <p role="alert" className="text-sm text-[#B0626A] bg-[#FBF0EF] rounded-xl px-3 py-2">{err}</p>
            : <p className="text-xs text-stone-500 max-w-xs">Your photo is cropped to a square and saved to your account, so it shows on all your devices.</p>}
      </div>
  );
}
