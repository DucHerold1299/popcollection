import { supabase } from "../supabase";

// Profile pictures live in the "profiles" table in Supabase (one row per user).

export async function loadAvatar(userId) {
  const { data, error } = await supabase.from("profiles").select("avatar").eq("user_id", userId).maybeSingle();
  if (error) { console.warn("Couldn't load profile picture:", error.message); return null; }
  return data?.avatar ?? null;
}

// Pass null to remove the picture.
export async function saveAvatar(userId, avatar) {
  const { error } = await supabase.from("profiles")
      .upsert({ user_id: userId, avatar, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw new Error(`Couldn't save your picture: ${error.message}`);
}
