import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const articles = getAllArticles()

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Mindful AI</title>
    <link>https://themindfulai.dev</link>
    <description>A thoughtful exploration of artificial intelligence - exploring AI, philosophy, and technology with mindfulness</description>
    <language>en-us</language>
    <atom:link href="https://themindfulai.dev/feed" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>https://themindfulai.dev/articles/${article.slug}</link>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <guid>https://themindfulai.dev/articles/${article.slug}</guid>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}
