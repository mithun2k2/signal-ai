import React from 'react';
type IconType = 'note' | 'slide' | 'contact' | 'url' | 'quote' | 'target' | 'bolt' | 'brain' | 'rocket' | 'bulb' | 'user';

export default function CaptureIcon({ type, size = 20 }: { type: IconType; size?: number }) {
  const icons: Record<IconType, React.ReactElement> = {
    note: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="noteG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#noteG)" opacity="0.9"/>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#c4b5fd" strokeWidth="0.8" opacity="0.5"/>
        <line x1="7" y1="8" x2="17" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    slide: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="slideG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#slideG)" opacity="0.9"/>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5"/>
        <rect x="6" y="14" width="3" height="5" rx="1" fill="white" opacity="0.9"/>
        <rect x="10.5" y="11" width="3" height="8" rx="1" fill="white" opacity="0.9"/>
        <rect x="15" y="8" width="3" height="11" rx="1" fill="white" opacity="0.9"/>
      </svg>
    ),
    contact: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="contactG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#contactG)" opacity="0.9"/>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#6ee7b7" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="12" cy="10" r="3" fill="white" opacity="0.95"/>
        <path d="M6 19c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    url: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="urlG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee"/>
            <stop offset="100%" stopColor="#0891b2"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#urlG)" opacity="0.9"/>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#67e8f9" strokeWidth="0.8" opacity="0.5"/>
        <path d="M10 13a4 4 0 005.657 0l2-2a4 4 0 00-5.657-5.657l-1 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M14 11a4 4 0 00-5.657 0l-2 2a4 4 0 005.657 5.657l1-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    quote: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="quoteG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24"/>
            <stop offset="100%" stopColor="#d97706"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#quoteG)" opacity="0.9"/>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#fcd34d" strokeWidth="0.8" opacity="0.5"/>
        <path d="M7 11c0-1.657 1-3 3-3v2c-1 0-1.5.5-1.5 1.5V12H10v4H7v-5z" fill="white" opacity="0.95"/>
        <path d="M13 11c0-1.657 1-3 3-3v2c-1 0-1.5.5-1.5 1.5V12H16v4h-3v-5z" fill="white" opacity="0.95"/>
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="targetG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f87171"/>
            <stop offset="100%" stopColor="#dc2626"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#targetG)" opacity="0.9"/>
        <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.95"/>
      </svg>
    ),
    bolt: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="boltG2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#6d28d9"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#boltG2)" opacity="0.9"/>
        <polygon points="13,3 7,13 11,13 11,21 17,11 13,11" fill="white" opacity="0.95"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="brainG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc"/>
            <stop offset="100%" stopColor="#9333ea"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#brainG)" opacity="0.9"/>
        <path d="M8 10c0-2.5 8-2.5 8 0 0 1-1 2-2 2.5V16h-4v-3.5C9 12 8 11 8 10z" fill="white" opacity="0.85"/>
        <line x1="12" y1="7" x2="12" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    rocket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="rocketG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#rocketG)" opacity="0.9"/>
        <path d="M12 5c3 2 4 5 3 9l-3 3-3-3c-1-4 0-7 3-9z" fill="white" opacity="0.9"/>
        <circle cx="12" cy="12" r="1.5" fill="url(#rocketG)"/>
        <path d="M9 16l-2 2M15 16l2 2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    bulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="bulbG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a"/>
            <stop offset="100%" stopColor="#f59e0b"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#bulbG)" opacity="0.9"/>
        <path d="M12 6a5 5 0 013.5 8.5L15 17H9l-.5-2.5A5 5 0 0112 6z" fill="white" opacity="0.9"/>
        <line x1="10" y1="19" x2="14" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="userG" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8"/>
            <stop offset="100%" stopColor="#475569"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#userG)" opacity="0.9"/>
        <circle cx="12" cy="9" r="3" fill="white" opacity="0.95"/>
        <path d="M6 19c0-3 2.5-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  };

  return icons[type] ?? icons.note;
}