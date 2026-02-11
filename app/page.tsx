import { ThemeSwitcher } from './components/ThemeSwitcher'
import { LogoWithText } from './components/Logo'
import { getAllArticles } from '@/lib/articles'

export default function Home() {
  const articles = getAllArticles()

  const siteUrl = 'https://themindfulai.dev'

  // Organization + WebSite schema for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Mindful AI",
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description: "A thoughtful exploration of artificial intelligence — exploring AI philosophy, ethics, infrastructure, and the future of technology with mindfulness.",
    sameAs: [
      "https://twitter.com/themindfulai",
    ],
  }

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Mindful AI",
    url: siteUrl,
    description: "Exploring AI, philosophy, and technology with mindfulness. Thoughtful articles on AI infrastructure, ethics, and the future of technology.",
    publisher: {
      "@type": "Organization",
      name: "The Mindful AI",
      url: siteUrl,
    },
  }

  // Blog schema with article list
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Mindful AI",
    url: siteUrl,
    description: "A thoughtful exploration of artificial intelligence — blending Eastern philosophy with practical AI guidance on infrastructure, document processing, and research agents.",
    publisher: {
      "@type": "Organization",
      name: "The Mindful AI",
    },
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${siteUrl}/articles/${article.slug}`,
      datePublished: article.date,
      description: article.excerpt,
      author: {
        "@type": "Person",
        name: "The Mindful AI",
      },
    })),
  }

  // FAQPage schema for GEO optimization (+40% AI visibility)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is The Mindful AI blog about?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Mindful AI is a blog that explores artificial intelligence through the lens of philosophy, ethics, and mindfulness. It covers practical topics like AI infrastructure, document processing with RLMs (Recursive Language Models), and AI research agent evaluation, while maintaining a contemplative, Zen-inspired perspective on technology.",
        },
      },
      {
        "@type": "Question",
        name: "What is RLM (Recursive Language Model) for document processing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RLM (Recursive Language Model) is an alternative to RAG (Retrieval-Augmented Generation) for document processing. Instead of embedding chunks and searching with vector similarity, RLM lets the LLM navigate documents like environments — achieving 91% accuracy compared to RAG's 72% on complex financial documents, according to benchmarks on 100+ real-world documents.",
        },
      },
      {
        "@type": "Question",
        name: "How do you evaluate AI research agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evaluating AI research agents requires adaptive evaluation methods and citation validation, not simple output comparison. The DeepResearch Bench approach uses structured rubrics that assess factual accuracy, source quality, reasoning depth, and coverage — because comparing AI-written reports is fundamentally harder than comparing code outputs.",
        },
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ThemeSwitcher />

      <div className="container">
        <header>
          <LogoWithText size={48} />
          <h1 className="sr-only">The Mindful AI — Exploring Artificial Intelligence with Philosophy and Mindfulness</h1>
          <p className="tagline">A thoughtful exploration of artificial intelligence</p>
          <p className="subtitle">Technology • Philosophy • Future</p>
        </header>

        <main className="articles">
          {articles.map((article) => {
            const date = new Date(article.date)
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            return (
              <article key={article.slug}>
                <div className="article-content">
                  <div className="article-meta">
                    <time dateTime={article.date}>{formattedDate}</time>
                    <span className="reading-time">{article.readingTime}</span>
                  </div>
                  <h2>
                    <a href={`/articles/${article.slug}`} className="article-title-link">
                      {article.title}
                    </a>
                  </h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <a href={`/articles/${article.slug}`} className="read-more">
                    Continue reading
                  </a>
                </div>
              </article>
            )
          })}
        </main>

        <footer>
          <p>Cultivating wisdom in the digital age</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="/about">About</a>
            <span className="footer-separator">·</span>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer">RSS</a>
          </nav>
        </footer>
      </div>
    </div>
  )
}
