import { useState } from "react";
import NameWithCatalog from "./NameWithCatalog";
import BrowsePopMart from "./BrowsePopMart";

// Switch between typing the name and browsing the Pop Mart list.

export default function NamePicker({ f, setF, catalog }) {
  const [mode, setMode] = useState("type");
  const [focusKey, setFocusKey] = useState(0);
  return (
      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500">Figure</span>
          <div className="inline-grid grid-cols-2 bg-[#FFF1EA] rounded-full p-0.5" role="tablist" aria-label="How to choose the figure">
            {[["type", "Type name"], ["browse", "Browse Pop Mart"]].map(([m, l]) => (
                <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                        className={`rounded-full px-3 py-1 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A48F] ${mode === m ? "bg-white shadow text-[#CC6249]" : "text-[#7A6558]"}`}>{l}</button>
            ))}
          </div>
        </div>
        {mode === "type" ? (
            <NameWithCatalog key={focusKey} f={f} setF={setF} catalog={catalog} />
        ) : (
            <BrowsePopMart onPick={({ character, series }) => {
              setF((x) => ({ ...x, series, name: `${character} – ` }));
              setMode("type");
              setFocusKey((k) => k + 1);
            }} />
        )}
      </div>
  );
}
