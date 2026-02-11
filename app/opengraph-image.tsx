import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'The Mindful AI — A thoughtful exploration of artificial intelligence'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(145deg, #FAFAF8 0%, #F0EDE6 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Enso circle */}
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M 85 50 A 35 35 0 1 1 50 15"
            stroke="#7C9885"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="50" cy="50" r="4" fill="#7C9885" opacity="1" />
          <circle cx="35" cy="40" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="65" cy="40" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="42" cy="60" r="2.5" fill="#7C9885" opacity="0.7" />
          <circle cx="58" cy="60" r="2.5" fill="#7C9885" opacity="0.7" />
          <line x1="50" y1="50" x2="35" y2="40" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="65" y2="40" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="42" y2="60" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="50" x2="58" y2="60" stroke="#7C9885" strokeWidth="1.5" opacity="0.4" />
        </svg>

        <div
          style={{
            fontSize: '56px',
            fontWeight: 600,
            color: '#2C3E50',
            lineHeight: 1.2,
            marginTop: '30px',
            textAlign: 'center',
          }}
        >
          The Mindful AI
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#5A6C7D',
            marginTop: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 300,
            textAlign: 'center',
          }}
        >
          A thoughtful exploration of artificial intelligence
        </div>

        <div
          style={{
            fontSize: '18px',
            color: '#7C9885',
            marginTop: '24px',
            fontFamily: 'sans-serif',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Technology • Philosophy • Future
        </div>

        {/* Decorative bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #7C9885 0%, #A8BFA8 50%, #7C9885 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
