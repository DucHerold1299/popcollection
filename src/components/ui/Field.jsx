export default function Field({ label, children }) {
  return (
      <label className="block">
        <span className="block text-xs font-medium text-stone-500 mb-1.5">{label}</span>
        {children}
      </label>
  );
}
