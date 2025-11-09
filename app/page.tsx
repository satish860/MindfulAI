import { ThemeSwitcher } from './components/ThemeSwitcher'
import { getAllArticles } from '@/lib/articles'

export default function Home() {
  const articles = getAllArticles()

  return (
    <div>
      <ThemeSwitcher />

      <div className="container">
        <header>
          <h1>Mindful AI</h1>
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
        </footer>
      </div>
    </div>
  )
}
