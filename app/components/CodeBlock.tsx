'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: React.ReactNode
  title?: string
  language?: string
  code?: string
}

export function CodeBlock({ children, title, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const displayTitle = title || (language ? `${language.toUpperCase()}` : 'Code')

  // Extract code string from children
  const codeString = code || (typeof children === 'string'
    ? children
    : React.Children.toArray(children)
        .map(child => {
          if (React.isValidElement(child)) {
            return (child.props as { children?: string })?.children || ''
          }
          return String(child)
        })
        .join('')
        .trim())

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{displayTitle}</span>
        <button
          onClick={handleCopy}
          className="copy-button"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          background: '#1e1e1e',
          padding: '1.5rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace",
            fontSize: '0.85rem',
            lineHeight: '1.6',
          }
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}
