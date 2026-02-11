import { ImageResponse } from 'next/og'
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles'

export const runtime = 'nodejs'

export const alt = 'Article preview'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  const title = article?.metadata.title || 'The Mindful AI'
  const category = article?.metadata.category || ''
  const readingTime = article?.metadata.readingTime || ''
  const date = article?.metadata.date
    ? new Date(article.metadata.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(145deg, #FAFAF8 0%, #F0EDE6 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top: Enso + Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Enso circle SVG */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 100 100"
            fill="none"
          >
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
          {category && (
            <div
              style={{
                fontSize: '20px',
                color: '#7C9885',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
                fontWeight: 500,
              }}
            >
              {category}
            </div>
          )}
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? '42px' : title.length > 40 ? '50px' : '56px',
              fontWeight: 600,
              color: '#2C3E50',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: Meta + Branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '18px',
              color: '#5A6C7D',
              fontFamily: 'sans-serif',
            }}
          >
            {date && <span>{date}</span>}
            {readingTime && (
              <span style={{ display: 'flex', gap: '24px' }}>
                <span style={{ color: '#A8BFA8' }}>·</span>
                <span>{readingTime}</span>
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#7C9885',
              fontWeight: 600,
              fontStyle: 'italic',
            }}
          >
            The Mindful AI
          </div>
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
