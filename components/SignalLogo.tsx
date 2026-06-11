export default function SignalLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="14" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
      <rect width="48" height="48" rx="14" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" />
      <polygon points="27,4 14,26 22,26 21,44 34,22 26,22" fill="url(#boltGrad)" />
    </svg>
  )
}