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
      </div>
    </div>
  )
}
