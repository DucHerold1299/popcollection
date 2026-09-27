import { useRef } from "react";
import Logo from "../icons/Logo";
import Avatar from "../ui/Avatar";
import { btn, btnGhost, serif } from "../../styles/theme";

// Top bar: logo, Backup / Restore and the logged-in user. Tap the picture to change it.
export default function ShelfHeader({ user, avatar, onProfile, onBackup, onRestore, onLogout }) {
  const fileRef = useRef(null);
  return (
      <header className="sticky top-0 z-40 bg-pc-bg/85 backdrop-blur border-b border-pc-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={38} />
            <span className="text-xl font-semibold tracking-tight" style={serif}>Pop Collection</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onBackup} className={btnGhost}>Backup</button>
            <button onClick={() => fileRef.current.click()} className={btnGhost}>Restore</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden"
                   onChange={(e) => { const file = e.target.files?.[0]; if (file) onRestore(file); e.target.value = ""; }} />
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-pc-line">
              <button onClick={onProfile} aria-label="Change profile picture" title="Change profile picture" className="rounded-full hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring focus-visible:ring-offset-2">
                <Avatar src={avatar} name={user} size={36} />
              </button>
              <span className="hidden sm:inline text-sm font-bold">{user}</span>
              <button onClick={onLogout} className={`${btn} text-stone-500 hover:text-pc-accent-strong`}>Log out</button>
            </div>
          </div>
        </div>
      </header>
  );
}
