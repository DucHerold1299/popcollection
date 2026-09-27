// Logo: a sleepy girl in a cloud hood (original drawing, no official artwork).

export default function NyotaMark({ size = 36 }) {
  // Nyota-inspired: sleepy girl in a fluffy cloud hood with a little star
  return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r="32" fill="#FFE3EC" />
        <g fill="#FFFFFF" stroke="#F2C6D3" strokeWidth="1.5">
          <circle cx="18" cy="30" r="9" /><circle cx="46" cy="30" r="9" /><circle cx="24" cy="19" r="10" /><circle cx="40" cy="19" r="10" /><circle cx="32" cy="15" r="10" />
        </g>
        <circle cx="32" cy="36" r="15" fill="#FFE9DC" />
        <path d="M18 31c4-6 9-8 14-8s10 2 14 8c-4-3-9-4-14-4s-10 1-14 4z" fill="#8C6A5C" />
        <path d="M25 37q2 2 4 0M35 37q2 2 4 0" stroke="#5B4038" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx="23.5" cy="41" rx="3" ry="1.8" fill="#FFB5B5" opacity=".8" /><ellipse cx="40.5" cy="41" rx="3" ry="1.8" fill="#FFB5B5" opacity=".8" />
        <path d="M30.5 43.5q1.5 1 3 0" stroke="#5B4038" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M44 9l1.6 3.4 3.7.5-2.7 2.6.7 3.7-3.3-1.8-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="#FFD66B" />
      </svg>
  );
}
