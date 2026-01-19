'use client'

import { useState } from 'react'

interface ArticleActionsProps {
  slug: string
  title: string
}

export function ArticleActions({ slug, title }: ArticleActionsProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const markdownUrl = `/articles/${slug}.md`

  const handleCopyMarkdown = async () => {
    setCopyState('copying')
    try {
      const response = await fetch(markdownUrl)
      if (!response.ok) throw new Error('Failed to fetch markdown')
      const markdown = await response.text()
      await navigator.clipboard.writeText(markdown)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), 2000)
    }
    setIsDropdownOpen(false)
  }

  const handleOpenInClaude = async () => {
    try {
      const response = await fetch(markdownUrl)
      if (!response.ok) throw new Error('Failed to fetch markdown')
      const markdown = await response.text()

      // Create a prompt asking Claude to discuss the article
      const prompt = `I'd like to discuss this article with you:\n\n${markdown}\n\nPlease share your thoughts on the key ideas presented.`

      // Encode and open in Claude.ai
      const encodedPrompt = encodeURIComponent(prompt)
      window.open(`https://claude.ai/new?q=${encodedPrompt}`, '_blank')
    } catch (error) {
      console.error('Failed to open in Claude:', error)
      // Fallback: just open Claude.ai
      window.open('https://claude.ai/new', '_blank')
    }
    setIsDropdownOpen(false)
  }

  const getCopyButtonText = () => {
    switch (copyState) {
      case 'copying': return 'Copying...'
      case 'copied': return 'Copied!'
      case 'error': return 'Failed'
      default: return 'Copy page'
    }
  }

  return (
    <div className="article-actions">
      <div className="article-actions-group">
        <button
          className="article-action-btn article-action-primary"
          onClick={handleOpenInClaude}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat with this blog
        </button>

        <div className="article-action-dropdown">
          <button
            className="article-action-btn article-action-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="More options"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="article-action-backdrop"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="article-action-menu">
                <button
                  onClick={handleCopyMarkdown}
                  className="article-action-menu-item"
                  disabled={copyState === 'copying'}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {copyState === 'copied' ? (
                      <path d="M20 6L9 17l-5-5" />
                    ) : (
                      <>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </>
                    )}
                  </svg>
                  {getCopyButtonText()}
                </button>
                <a
                  href={markdownUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-action-menu-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Markdown
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
