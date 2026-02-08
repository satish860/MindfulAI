import type { MDXComponents } from 'mdx/types'
import React from 'react'
import { CodeBlock } from './app/components/CodeBlock'
import { MermaidDiagram } from './app/components/MermaidDiagram'
import { InteractiveSandbox } from './app/components/InteractiveSandbox'
import { SandboxTabs } from './app/components/SandboxTabs'

// Helper function to generate slug from heading text
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Helper component for headings with anchor links
function Heading({ level, children }: { level: number; children: React.ReactNode }) {
  const text = typeof children === 'string' ? children : String(children)
  const slug = generateSlug(text)
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements

  return (
    <HeadingTag id={slug} className="heading-anchor">
      <a href={`#${slug}`} className="anchor-link">
        {children}
      </a>
    </HeadingTag>
  )
}

// Non-hook version for use in async server components
export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize MDX components here
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    p: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    pre: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      // Extract language from className
      const childProps = React.isValidElement(children) ? children.props : null
      const className = (childProps as { className?: string })?.className || ''
      const language = className.replace('language-', '')

      // Extract code string from children
      const codeString = (childProps as { children?: string })?.children || ''

      // Handle mermaid diagrams
      if (language === 'mermaid') {
        return <MermaidDiagram chart={codeString} />
      }

      // Map language codes to display names
      const languageMap: Record<string, string> = {
        'javascript': 'JavaScript',
        'typescript': 'TypeScript',
        'python': 'Python',
        'jsx': 'JSX',
        'tsx': 'TSX',
        'json': 'JSON',
        'bash': 'Bash',
        'shell': 'Shell',
      }

      const title = languageMap[language] || language.toUpperCase()

      return (
        <CodeBlock title={title} language={language} code={codeString}>
          {children}
        </CodeBlock>
      )
    },
    table: ({ children, ...props }) => (
      <div className="table-responsive-wrapper">
        <table {...props}>{children}</table>
      </div>
    ),
    code: ({ children, ...props }) => (
      <code {...props}>
        {children}
      </code>
    ),
    InteractiveSandbox,
    SandboxTabs,
    ...components,
  }
}

// Alias for compatibility with MDX type system
export const useMDXComponents = getMDXComponents
