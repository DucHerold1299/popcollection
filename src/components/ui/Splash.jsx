import NyotaMark from "../icons/NyotaMark";
import { fontCss, pageFont } from "../../styles/theme";

// Full-screen loading / error message.

export default function Splash({ text = "Loading your shelf…" }) {
  return (
      <div className="min-h-screen bg-[#FFF8F0] text-[#7A6558] flex flex-col items-center justify-center gap-4" style={pageFont}>
        <style>{fontCss}</style>
        <span className="motion-safe:animate-bounce"><NyotaMark size={64} /></span>
        <p className="font-bold">{text}</p>
      </div>
  );
}
