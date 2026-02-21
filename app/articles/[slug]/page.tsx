import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs, getAllArticles } from '@/lib/articles'
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher'
import { Logo } from '@/app/components/Logo'
import { ArticleActions } from '@/app/components/ArticleActions'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getMDXComponents } from '@/mdx-components'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const articleUrl = `https://themindfulai.dev/articles/${slug}`

  // Use article-specific keywords if available, otherwise fall back to generic
  const defaultKeywords = article.metadata.category
    ? [article.metadata.category, "AI", "Technology", "Philosophy"]
    : ["AI", "Technology", "Philosophy"]
  const keywords = article.metadata.keywords && article.metadata.keywords.length > 0
    ? article.metadata.keywords
    : defaultKeywords

  return {
    title: article.metadata.title,
    description: article.metadata.excerpt,
    keywords,
    authors: [{ name: "The Mindful AI" }],
    openGraph: {
      type: "article",
      locale: "en_US",
      url: articleUrl,
      title: article.metadata.title,
      description: article.metadata.excerpt,
      siteName: "The Mindful AI",
      publishedTime: article.metadata.date,
      authors: ["The Mindful AI"],
      tags: article.metadata.category ? [article.metadata.category] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.excerpt,
      creator: "@themindfulai",
    },
    alternates: {
      canonical: articleUrl,
      types: {
        'application/rss+xml': '/feed.xml',
        'text/markdown': `/articles/${slug}.md`,
      },
    },
  }
}

function getRelatedArticles(currentSlug: string, currentCategory: string | undefined, limit = 3) {
  const allArticles = getAllArticles()
  const otherArticles = allArticles.filter((a) => a.slug !== currentSlug)

  // Prioritize same category, then by recency
  const sameCategory = otherArticles.filter((a) => a.category && a.category === currentCategory)
  const differentCategory = otherArticles.filter((a) => a.category !== currentCategory)

  return [...sameCategory, ...differentCategory].slice(0, limit)
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const date = new Date(article.metadata.date)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const template = article.metadata.template || 'article'
  const containerClass = template === 'short' ? 'container-short' : 'container-article'
  const articleClass = `article-page article-${template}`

  const articleUrl = `https://themindfulai.dev/articles/${slug}`
  const ogImageUrl = `https://themindfulai.dev/articles/${slug}/opengraph-image`

  // Structured data for SEO - rendered in <head> via Next.js script placement
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.metadata.title,
    description: article.metadata.excerpt,
    image: ogImageUrl,
    datePublished: article.metadata.date,
    dateModified: article.metadata.date,
    author: {
      "@type": "Person",
      name: "The Mindful AI",
      url: "https://themindfulai.dev"
    },
    publisher: {
      "@type": "Organization",
      name: "The Mindful AI",
      url: "https://themindfulai.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://themindfulai.dev/icon"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    },
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.metadata.category || "AI",
    keywords: article.metadata.keywords && article.metadata.keywords.length > 0
      ? article.metadata.keywords
      : (article.metadata.category
        ? [article.metadata.category, "AI", "Artificial Intelligence", "Technology", "Philosophy"]
        : ["AI", "Artificial Intelligence", "Technology", "Philosophy"]),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-intro", ".article-content h2"],
    },
    inLanguage: "en-US",
  }

  // BreadcrumbList for enhanced Google search results
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://themindfulai.dev"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.metadata.title,
        item: articleUrl
      }
    ]
  }

  // FAQPage schema for GEO optimization (+40% AI visibility per Princeton GEO research)
  // Parse FAQ entries from frontmatter if available
  const faqData = article.metadata.faq && Array.isArray(article.metadata.faq) && article.metadata.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.metadata.faq.map((item: { q: string; a: string }) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }
    : null

  // Get related articles for internal linking
  const relatedArticles = getRelatedArticles(slug, article.metadata.category)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {faqData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      )}
      <ThemeSwitcher />

      <div className={`container ${containerClass}`}>
        <nav className="back-nav">
          <Link href="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Logo size={24} />
            Back to home
          </Link>
        </nav>

        <article className={articleClass}>
          <header className="article-header">
            <div className="article-header-top">
              <div className="article-meta">
                <time dateTime={article.metadata.date}>{formattedDate}</time>
                <span className="reading-time">{article.metadata.readingTime}</span>
                {article.metadata.category && (
                  <span className="category">{article.metadata.category}</span>
                )}
              </div>
              <ArticleActions slug={slug} title={article.metadata.title} />
            </div>
            <h1>{article.metadata.title}</h1>
            <p className="article-intro">{article.metadata.excerpt}</p>
          </header>

          <div className="article-content">
            <MDXRemote
              source={article.content}
              components={getMDXComponents({})}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                }
              }}
            />
          </div>

          <footer className="article-footer">
            <p>May your prompts be skillful and your responses illuminating.</p>
            <div className="article-markdown-link">
              <a href={`/articles/${slug}.md`} target="_blank" rel="noopener noreferrer">
                View as Markdown
              </a>
              <span className="markdown-hint"> · Perfect for sharing with LLMs</span>
            </div>
          </footer>
        </article>

        {/* Related Articles - Internal Linking for SEO */}
        {relatedArticles.length > 0 && (
          <section className="related-articles">
            <h2 className="related-articles-title">Continue Reading</h2>
            <div className="related-articles-grid">
              {relatedArticles.map((related) => {
                const relatedDate = new Date(related.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <Link
                    key={related.slug}
                    href={`/articles/${related.slug}`}
                    className="related-article-card"
                  >
                    {related.category && (
                      <span className="related-article-category">{related.category}</span>
                    )}
                    <h3 className="related-article-title">{related.title}</h3>
                    <p className="related-article-excerpt">{related.excerpt}</p>
                    <div className="related-article-meta">
                      <time dateTime={related.date}>{relatedDate}</time>
                      <span>{related.readingTime}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
