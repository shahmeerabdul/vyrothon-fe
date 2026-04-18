export function BrandMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="bm-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id="bm-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="bm-g3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <filter id="bm-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Backplate */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="#0a0e1a"
        stroke="rgba(148,163,184,0.18)"
      />

      {/* Three stacked cipher layers, offset to suggest cascade */}
      <g filter="url(#bm-glow)">
        <rect
          x="8"
          y="9"
          width="20"
          height="5.5"
          rx="2"
          fill="url(#bm-g1)"
          opacity="0.95"
        />
        <rect
          x="12"
          y="17.25"
          width="20"
          height="5.5"
          rx="2"
          fill="url(#bm-g2)"
          opacity="0.95"
        />
        <rect
          x="8"
          y="25.5"
          width="20"
          height="5.5"
          rx="2"
          fill="url(#bm-g3)"
          opacity="0.95"
        />
      </g>

      {/* Flow dots connecting the stack */}
      <circle cx="18" cy="15.5" r="1" fill="#0a0e1a" />
      <circle cx="18" cy="15.5" r="0.55" fill="#67e8f9" />
      <circle cx="22" cy="23.75" r="1" fill="#0a0e1a" />
      <circle cx="22" cy="23.75" r="0.55" fill="#c4b5fd" />
    </svg>
  );
}
