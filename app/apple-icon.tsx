import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #a78bfa, #6d28d9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24">
          <polygon
            points="13,2 6,13 11,13 11,22 18,11 13,11"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}