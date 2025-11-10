#!/usr/bin/env node

/**
 * Build-time script to generate static .md files from MDX articles
 * Outputs to public/articles/ so they're served as static assets
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Import the conversion utilities (using dynamic import for ES modules)
async function generateMarkdownFiles() {
  // Dynamically import ES module
  const { mdxToMarkdown, addFrontmatter } = await import('../lib/mdx-to-markdown.js');

  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const outputDir = path.join(process.cwd(), 'public', 'articles');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read all MDX files
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.mdx'));

  console.log(`\n🔄 Generating markdown files for ${files.length} articles...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(articlesDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(fileContents);

      // Convert MDX to plain markdown
      const plainMarkdown = mdxToMarkdown(content);

      // Add frontmatter back
      const markdownWithFrontmatter = addFrontmatter(plainMarkdown, {
        title: frontmatter.title,
        date: frontmatter.date,
        excerpt: frontmatter.excerpt,
        template: frontmatter.template,
        category: frontmatter.category,
      });

      // Write to public/articles/
      const outputPath = path.join(outputDir, `${slug}.md`);
      fs.writeFileSync(outputPath, markdownWithFrontmatter, 'utf8');

      console.log(`✅ ${slug}.md`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary: ${successCount} succeeded, ${errorCount} failed\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run the script
generateMarkdownFiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
