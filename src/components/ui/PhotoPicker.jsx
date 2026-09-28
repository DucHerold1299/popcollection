import { useRef } from "react";
import Icon from "../icons/Icon";
import { btnGhost } from "../../styles/theme";

// Two ways to add a picture: take a new photo with the camera, or pick one from the photo library.
// On a computer both open the normal file picker.
export default function PhotoPicker({ onPhoto, busy, cameraLabel = "Take photo", libraryLabel = "From library" }) {
  const cameraRef = useRef(null);
  const libraryRef = useRef(null);
  const handle = (e) => { const f = e.target.files?.[0]; if (f) onPhoto(f); e.target.value = ""; };

  if (busy) {
    return <button type="button" disabled className={btnGhost}>Reading photo…</button>;
  }
  return (
      <>
        <button type="button" onClick={() => cameraRef.current.click()} className={btnGhost}>
          <span className="inline-flex items-center gap-2"><Icon.camera />{cameraLabel}</span>
        </button>
        <button type="button" onClick={() => libraryRef.current.click()} className={btnGhost}>
          <span className="inline-flex items-center gap-2"><Icon.gallery />{libraryLabel}</span>
        </button>
        {/* capture="environment" opens the back camera on phones; without it, phones offer the photo library. */}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} />
        <input ref={libraryRef} type="file" accept="image/*" className="hidden" onChange={handle} />
      </>
  );
}
