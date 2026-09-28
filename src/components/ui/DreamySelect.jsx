import { useEffect, useId, useRef, useState } from "react";

// A soft, rounded dropdown in the style of the dreamy search field. (The list of a normal
// <select> is drawn by the phone/computer and can't be styled, so this builds its own.)
// options: [{ value, label, icon? }]. Keyboard: ↑ ↓ to move, Enter to pick, Escape to close.
export default function DreamySelect({ value, onChange, options, label, className = "" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const current = options.find((o) => o.value === value) || options[0];

  // Close when tapping or clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, [open]);

  // When opening, start on the chosen option and move keyboard focus into the list.
  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    listRef.current?.focus();
  }, [open]);

  const choose = (o) => { onChange(o.value); setOpen(false); buttonRef.current?.focus(); };

  const onListKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + options.length) % options.length); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(options[active]); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
    else if (e.key === "Tab") setOpen(false);
  };

  return (
      <div ref={rootRef} className={`relative ${className}`}>
        <button ref={buttonRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${current.label}`}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); } }}
                className="pc-dreamy-field flex items-center gap-2.5 py-3 pl-4 pr-11 text-sm font-semibold text-left">
          {current.icon && <span className="text-pc-accent shrink-0">{current.icon}</span>}
          <span className="truncate">{current.label}</span>
        </button>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden
             className={`absolute right-4 top-1/2 -translate-y-1/2 text-pc-accent pointer-events-none motion-safe:transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {open && (
            <ul ref={listRef} role="listbox" tabIndex={-1} aria-label={label} aria-activedescendant={`${id}-${active}`} onKeyDown={onListKey}
                className="pc-dreamy-menu absolute right-0 z-30 mt-2 w-full min-w-[14rem] p-1.5 focus:outline-none">
              {options.map((o, i) => {
                const selected = o.value === value;
                return (
                    <li key={o.value} id={`${id}-${i}`} role="option" aria-selected={selected}
                        onMouseEnter={() => setActive(i)} onClick={() => choose(o)}
                        className={`pc-dreamy-option flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm cursor-pointer ${i === active ? "is-active" : ""} ${selected ? "font-bold text-pc-ink" : "text-pc-muted"}`}>
                      {o.icon && <span className={`shrink-0 ${selected ? "text-pc-accent" : "text-pc-muted/70"}`}>{o.icon}</span>}
                      <span className="flex-1">{o.label}</span>
                      {selected && (
                          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden className="text-pc-accent shrink-0">
                            <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                      )}
                    </li>
                );
              })}
            </ul>
        )}
      </div>
  );
}
