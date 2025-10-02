import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Disable Turbopack temporarily to test remark-gfm
  experimental: {
    turbo: undefined,
  },
};

// Enable GitHub-flavored markdown (tables, strikethrough, task lists, etc.)
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig);
