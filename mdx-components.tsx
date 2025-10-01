import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize MDX components here
    h1: ({ children }) => (
      <h1 className="font-serif text-4xl font-semibold mb-6 text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl font-semibold mt-12 mb-4 text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl font-semibold mt-8 mb-3 text-gray-900">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-6 leading-relaxed text-gray-700">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sage-light pl-6 py-4 my-8 bg-white rounded-r-lg shadow-sm">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    ...components,
  }
}
