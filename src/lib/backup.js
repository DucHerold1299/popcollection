import { today } from "./format";

// Download the whole shelf as a .json file.
export function downloadBackup(figs, user) {
  const blob = new Blob([JSON.stringify(figs)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pop-collection-${user}-${today()}.json`;
  a.click();
}

// Read a backup file. Resolves with the list of figures, or rejects if the file isn't a valid backup.
export async function readBackup(file) {
  const d = JSON.parse(await file.text());
  if (!Array.isArray(d)) throw new Error("Not a backup");
  return d.map((x) => ({ photo: null, sig: null, ...x }));
}
