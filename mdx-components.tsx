import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from './app/components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize MDX components here
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    p: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    pre: ({ children, ...props }: any) => {
      // Extract language from className
      const childProps = children?.props
      const className = childProps?.className || ''
      const language = className.replace('language-', '')

      // Extract code string from children
      const codeString = childProps?.children || ''

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
    code: ({ children, ...props }) => (
      <code {...props}>
        {children}
      </code>
    ),
    ...components,
  }
}
