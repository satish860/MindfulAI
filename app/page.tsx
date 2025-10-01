import { ThemeSwitcher } from './components/ThemeSwitcher'

export default function Home() {
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
          <article>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime="2025-09-29">September 29, 2025</time>
                <span className="reading-time">5 min read</span>
              </div>
              <h2>The Art of Prompt Engineering: Finding Clarity in Conversation</h2>
              <p className="article-excerpt">
                Like the careful arrangement of stones in a Japanese garden, effective prompt engineering requires patience, intention, and an understanding of balance. Each word carries weight, each instruction creates ripples through the vast ocean of artificial intelligence.
              </p>
              <a href="#" className="read-more">Continue reading</a>
            </div>
          </article>

          <article>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime="2025-09-25">September 25, 2025</time>
                <span className="reading-time">7 min read</span>
              </div>
              <h2>Embracing Imperfection: What AI Can Learn from Wabi-Sabi</h2>
              <p className="article-excerpt">
                In the pursuit of perfect algorithms, we sometimes forget the beauty of imperfection. The Japanese philosophy of wabi-sabi teaches us to find grace in the incomplete, the impermanent, and the imperfect - lessons that could reshape how we approach artificial intelligence.
              </p>
              <a href="#" className="read-more">Continue reading</a>
            </div>
          </article>

          <article>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime="2025-09-20">September 20, 2025</time>
                <span className="reading-time">4 min read</span>
              </div>
              <h2>Digital Meditation: Finding Peace in the Age of AI</h2>
              <p className="article-excerpt">
                As artificial intelligence accelerates the pace of change in our world, the ancient practice of mindfulness becomes more relevant than ever. How do we maintain our center while riding the waves of technological transformation?
              </p>
              <a href="#" className="read-more">Continue reading</a>
            </div>
          </article>

          <article>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime="2025-09-15">September 15, 2025</time>
                <span className="reading-time">6 min read</span>
              </div>
              <h2>The Beginner's Mind: Approaching AI with Shoshin</h2>
              <p className="article-excerpt">
                "In the beginner's mind there are many possibilities, but in the expert's mind there are few." Suzuki Roshi's wisdom on Shoshin offers profound insights for anyone working with or thinking about artificial intelligence.
              </p>
              <a href="#" className="read-more">Continue reading</a>
            </div>
          </article>
        </main>

        <footer>
          <p>Cultivating wisdom in the digital age</p>
        </footer>
      </div>
    </div>
  )
}
