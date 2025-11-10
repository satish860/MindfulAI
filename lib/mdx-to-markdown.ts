/**
 * Utility functions for converting MDX content to plain Markdown
 * suitable for LLM consumption
 */

interface TabData {
  label?: string;
  title?: string;
  code?: string;
  language?: string;
}

/**
 * Convert MDX content to plain Markdown by stripping/converting JSX components
 * while preserving standard Markdown features
 */
export function mdxToMarkdown(mdxContent: string): string {
  let markdown = mdxContent;

  // Convert InteractiveSandbox components to code blocks
  // Pattern: <InteractiveSandbox ...props...>code</InteractiveSandbox>
  markdown = markdown.replace(
    /<InteractiveSandbox[^>]*>([\s\S]*?)<\/InteractiveSandbox>/g,
    (match, content) => {
      // Extract code from nested structure
      const codeMatch = content.match(/```([a-z]*)\n([\s\S]*?)```/);
      if (codeMatch) {
        const lang = codeMatch[1] || 'javascript';
        const code = codeMatch[2];
        return `\`\`\`${lang}\n// Interactive sandbox example\n${code}\`\`\``;
      }
      return `\`\`\`javascript\n// Interactive example\n${content.trim()}\n\`\`\``;
    }
  );

  // Convert SandboxTabs components to multiple code blocks with headings
  // Pattern: <SandboxTabs tabs={[{...}]}>content</SandboxTabs>
  markdown = markdown.replace(
    /<SandboxTabs[^>]*tabs=\{(\[[\s\S]*?\])\}[^>]*>([\s\S]*?)<\/SandboxTabs>/g,
    (match, tabsJson, content) => {
      try {
        // Try to parse the tabs structure
        const tabs = eval(`(${tabsJson})`) as TabData[];
        let result = '\n';
        tabs.forEach((tab: TabData) => {
          result += `### ${tab.label || tab.title || 'Example'}\n\n`;
          if (tab.code) {
            const lang = tab.language || 'javascript';
            result += `\`\`\`${lang}\n${tab.code}\n\`\`\`\n\n`;
          }
        });
        return result;
      } catch {
        // If parsing fails, just return the content
        return content;
      }
    }
  );

  // Remove import statements (JSX/React imports)
  markdown = markdown.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  markdown = markdown.replace(/^import\s+\{[^}]*\}\s+from\s+['"].*?['"];?\s*$/gm, '');

  // Remove export statements
  markdown = markdown.replace(/^export\s+(default\s+)?/gm, '');

  // Convert self-closing JSX components to text descriptions
  // Pattern: <ComponentName prop="value" />
  markdown = markdown.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*\/>/g, (_match, componentName) => {
    return `[${componentName} component]`;
  });

  // Remove opening and closing tags of other JSX components
  // Pattern: <ComponentName ...> and </ComponentName>
  markdown = markdown.replace(/<\/?([A-Z][a-zA-Z0-9]*)[^>]*>/g, () => {
    return ''; // Remove the tags but keep the content inside
  });

  // Clean up excessive newlines (more than 2)
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  markdown = markdown.trim();

  return markdown;
}

/**
 * Wrap markdown content with YAML frontmatter
 */
export function addFrontmatter(
  markdown: string,
  frontmatter: Record<string, unknown>
): string {
  const yamlLines = ['---'];

  // Add each frontmatter field
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string' && (value.includes(':') || value.includes('\n'))) {
      // Quote strings with special characters
      yamlLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else if (typeof value === 'string') {
      yamlLines.push(`${key}: "${value}"`);
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  }

  yamlLines.push('---');
  yamlLines.push('');

  return yamlLines.join('\n') + markdown;
}
