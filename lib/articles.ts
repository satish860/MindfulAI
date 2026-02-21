import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface ArticleFAQ {
  q: string
  a: string
}

export interface ArticleMetadata {
  slug: string
  title: string
  date: string
  readingTime: string
  excerpt: string
  template?: 'article' | 'short' | 'technical'
  category?: string
  keywords?: string[]
  faq?: ArticleFAQ[]
}

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const files = fs.readdirSync(articlesDirectory)
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(slug: string) {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    metadata: {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      readingTime: stats.text,
      excerpt: data.excerpt || '',
      template: data.template || 'article',
      category: data.category || '',
      keywords: data.keywords || undefined,
      faq: data.faq || undefined,
    } as ArticleMetadata,
    content,
  }
}

export function getAllArticles(): ArticleMetadata[] {
  const slugs = getArticleSlugs()
  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug)
      return article ? { ...article.metadata, slug } : null
    })
    .filter((article): article is ArticleMetadata => article !== null)
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return articles
}
