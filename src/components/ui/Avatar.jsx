// Round profile picture. Shows the first letter of the name when there is no photo.
export default function Avatar({ src, name = "?", size = 36 }) {
  const style = { width: size, height: size };
  if (src) return <img src={src} alt="" aria-hidden className="rounded-full object-cover shrink-0" style={style} />;
  return (
      <span aria-hidden className="rounded-full bg-pc-soft text-pc-accent-strong font-extrabold flex items-center justify-center shrink-0" style={{ ...style, fontSize: size * 0.44 }}>
        {name[0]?.toUpperCase()}
      </span>
  );
}
