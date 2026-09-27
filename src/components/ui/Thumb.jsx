import FigureArt from "../icons/FigureArt";

// Shows the photo if there is one, otherwise the drawn placeholder.

export default function Thumb({ src, name = "", className = "" }) {
  return src ? <img src={src} alt={name} className={`object-cover ${className}`} /> : <FigureArt name={name} className={className} />;
}
