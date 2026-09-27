import { useRef } from "react";
import NyotaMark from "../icons/NyotaMark";
import { btn, btnGhost, serif } from "../../styles/theme";

// Top bar: logo, Backup / Restore and the logged-in user.
export default function ShelfHeader({ user, onBackup, onRestore, onLogout }) {
  const fileRef = useRef(null);
  return (
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/85 backdrop-blur border-b border-[#F3E4D4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5">
            <NyotaMark size={38} />
            <span className="text-xl font-semibold tracking-tight" style={serif}>Pop Collection</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onBackup} className={btnGhost}>Backup</button>
            <button onClick={() => fileRef.current.click()} className={btnGhost}>Restore</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden"
                   onChange={(e) => { const file = e.target.files?.[0]; if (file) onRestore(file); e.target.value = ""; }} />
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[#F3E4D4]">
              <span className="w-9 h-9 rounded-full bg-[#FFE7DC] text-[#CC6249] font-extrabold flex items-center justify-center" aria-hidden>{user[0].toUpperCase()}</span>
              <span className="hidden sm:inline text-sm font-bold">{user}</span>
              <button onClick={onLogout} className={`${btn} text-stone-500 hover:text-[#CC6249]`}>Log out</button>
            </div>
          </div>
        </div>
      </header>
  );
}
