import Logo from "../icons/Logo";
import { pageFont } from "../../styles/theme";

// Full-screen loading / error message.

export default function Splash({ text = "Loading your shelf…" }) {
  return (
      <div className="min-h-screen bg-pc-bg text-pc-muted flex flex-col items-center justify-center gap-4" style={pageFont}>
        <span className="motion-safe:animate-bounce"><Logo size={64} /></span>
        <p className="font-bold">{text}</p>
      </div>
  );
}
