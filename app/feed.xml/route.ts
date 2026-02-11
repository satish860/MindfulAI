import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const articles = getAllArticles()
  const siteUrl = 'https://themindfulai.dev'

  const itemsXml = articles
    .map(
      (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category>${article.category || 'AI'}</category>
    </item>`
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Mindful AI</title>
    <link>${siteUrl}</link>
    <description>Exploring AI, philosophy, and technology with mindfulness. Thoughtful articles on AI infrastructure, ethics, and the future of technology.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/icon</url>
      <title>The Mindful AI</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
