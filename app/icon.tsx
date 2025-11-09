import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF8',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Enso circle */}
          <path
            d="M 85 50 A 35 35 0 1 1 50 15"
            stroke="#7C9885"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* AI neural nodes */}
          <circle cx="50" cy="50" r="4" fill="#7C9885" opacity="1" />
          <circle cx="35" cy="40" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="65" cy="40" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="42" cy="60" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="58" cy="60" r="2.5" fill="#7C9885" opacity="0.7" />

          {/* Connection lines */}
          <line x1="50" y1="50" x2="35" y2="40" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="65" y2="40" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="42" y2="60" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="58" y2="60" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
