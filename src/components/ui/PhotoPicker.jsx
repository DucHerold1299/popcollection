import { useRef } from "react";
import Icon from "../icons/Icon";
import { btnGhost } from "../../styles/theme";

export default function PhotoPicker({ onPhoto, busy, label = "Take or upload photo" }) {
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
