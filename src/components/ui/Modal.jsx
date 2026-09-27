import { useEffect } from "react";
import { serif } from "../../styles/theme";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
      <div className="fixed inset-0 z-50 bg-pc-ink/30 backdrop-blur-[3px] flex items-end sm:items-center justify-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
        <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur">
            <h2 className="text-xl font-semibold text-pc-ink" style={serif}>{title}</h2>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full text-stone-500 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pc-ring">✕</button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
  );
}
