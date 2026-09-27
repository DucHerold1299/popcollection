import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Splash from "./components/ui/Splash";
import AuthScreen from "./screens/AuthScreen";
import LoggedIn from "./screens/LoggedIn";

// Decides which screen to show: loading, login, or the shelf.
export default function App() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <Splash text="Opening Pop Collection…" />;
  if (!session) return <AuthScreen />;
  return <LoggedIn key={session.user.id} session={session} />;
}
