import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles'
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.metadata.title} | Mindful AI`,
    description: article.metadata.excerpt,
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

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

  return (
    <div>
      <ThemeSwitcher />

      <div className={`container ${containerClass}`}>
        <nav className="back-nav">
          <a href="/" className="back-link">
            Back to home
          </a>
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
            <MDXRemote source={article.content} components={useMDXComponents({})} />
          </div>

          <footer className="article-footer">
            <p>May your prompts be skillful and your responses illuminating.</p>
          </footer>
        </article>
      </div>
    </div>
  )
}
