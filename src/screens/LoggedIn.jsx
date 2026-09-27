import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Shelf from "./Shelf";
import Splash from "../components/ui/Splash";
import { normName } from "../lib/format";
import { loadAvatar, saveAvatar } from "../lib/profile";

// Loads the user's figures and the community catalog, and saves changes to Supabase.

export default function LoggedIn({ session }) {
  const uidUser = session.user.id;
  const name = session.user.user_metadata?.name || session.user.email.split("@")[0];
  const [data, setData] = useState(null);
  const [catalog, setCatalog] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [saveErr, setSaveErr] = useState("");

  // The profile picture loads on its own, so a missing picture never blocks the shelf.
  useEffect(() => { loadAvatar(uidUser).then(setAvatar); }, [uidUser]);
  const changeAvatar = async (picture) => { await saveAvatar(uidUser, picture); setAvatar(picture); };

  useEffect(() => {
    (async () => {
      const [f, c] = await Promise.all([
        supabase.from("figures").select("id, data").order("created_at", { ascending: false }),
        supabase.from("catalog").select("key, name, series, photo, sig, by_name, by_user"),
      ]);
      if (f.error || c.error) return setLoadErr((f.error || c.error).message);
      setData(f.data.map((r) => ({ ...r.data, id: r.id })));
      setCatalog(Object.fromEntries(c.data.map((r) => [r.key, { key: r.key, name: r.name, series: r.series, photo: r.photo, sig: r.sig, by: r.by_name, byUser: r.by_user }])));
    })();
  }, [uidUser]);

  // Save only what changed: new/edited figures are upserted, removed ones deleted.
  const sync = async (before, after) => {
    const changed = after.filter((f) => !before.includes(f));
    const afterIds = new Set(after.map((f) => f.id));
    const removed = before.filter((f) => !afterIds.has(f.id)).map((f) => f.id);
    const ops = [];
    if (changed.length) ops.push(supabase.from("figures").upsert(changed.map((f) => ({ user_id: uidUser, id: f.id, data: f, updated_at: new Date().toISOString() })), { onConflict: "user_id,id" }));
    if (removed.length) ops.push(supabase.from("figures").delete().eq("user_id", uidUser).in("id", removed));
    const res = await Promise.all(ops);
    const bad = res.find((r) => r.error);
    setSaveErr(bad ? "Couldn't save your last change. Check your connection and try again." : "");
  };

  const contribute = async (f) => {
    const key = normName(f.name);
    const existing = catalog[key];
    if (existing && existing.byUser !== uidUser) return; // first photo wins; others keep theirs
    const row = { key, name: f.name, series: f.series, photo: f.photo, sig: f.sig, by_name: name, by_user: uidUser };
    setCatalog((c) => ({ ...c, [key]: { key, name: f.name, series: f.series, photo: f.photo, sig: f.sig, by: name, byUser: uidUser } }));
    await supabase.from("catalog").upsert(row, { onConflict: "key" });
  };

  if (loadErr) return <Splash text={`Couldn't load your shelf: ${loadErr}`} />;
  if (!data) return <Splash />;
  return (
      <>
        <Shelf user={name} avatar={avatar} onChangeAvatar={changeAvatar} initialFigs={data} onSync={sync} onLogout={() => supabase.auth.signOut()} catalog={catalog} onContribute={contribute} />
        {saveErr && <div role="alert" className="fixed bottom-6 right-6 max-w-xs rounded-2xl bg-[#B0626A] text-white text-sm px-4 py-3 shadow-lg z-50">{saveErr}</div>}
      </>
  );
}
