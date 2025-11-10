import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles'
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher'
import { Logo } from '@/app/components/Logo'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getMDXComponents } from '@/mdx-components'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const articleUrl = `https://themindfulai.dev/articles/${slug}`

  return {
    title: article.metadata.title,
    description: article.metadata.excerpt,
    keywords: article.metadata.category ? [article.metadata.category, "AI", "Technology", "Philosophy"] : ["AI", "Technology", "Philosophy"],
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
        'text/markdown': `/articles/${slug}.md`,
      },
    },
  }
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.metadata.title,
    description: article.metadata.excerpt,
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
      logo: {
        "@type": "ImageObject",
        url: "https://themindfulai.dev/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://themindfulai.dev/articles/${slug}`
    }
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
            <div className="article-meta">
              <time dateTime={article.metadata.date}>{formattedDate}</time>
              <span className="reading-time">{article.metadata.readingTime}</span>
              {article.metadata.category && (
                <span className="category">{article.metadata.category}</span>
              )}
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
      </div>
    </div>
  )
}
