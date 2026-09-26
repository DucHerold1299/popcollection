import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  document.body.innerHTML =
    '<p style="font-family:sans-serif;padding:2rem">Missing Supabase settings. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel (Settings, Environment Variables) and redeploy.</p>';
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(url, key);
